// app/api/analyze/route.ts
import { NextResponse } from "next/server";

type GroqResponse = any; // adapt with real types if desired

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"; // replace with your model

async function callGroq(messages: any[]) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.0,
      max_tokens: 1000
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Groq error: " + txt);
  }
  const json = await res.json();
  // adapt depending on Groq output structure. The "choices" -> text or message.
  return json;
}

function deterministicChecks(resumeText: string) {
  const checks: { key: string; pass: boolean; reason?: string }[] = [];
  const length = resumeText.trim().length;

  // Heuristic 1 — text presence
  checks.push({
    key: "text_extraction",
    pass: length > 200,
    reason: length > 200 ? undefined : "Very little extracted text — possible image-only PDF"
  });

  // Heuristic 2 — presence of contact info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  checks.push({
    key: "contact_email",
    pass: hasEmail,
    reason: hasEmail ? undefined : "No email found; ATS often expects contact info"
  });

  // Heuristic 3 — presence of section headings
  const headingsFound = ["experience", "education", "skills", "projects"].filter(h =>
    resumeText.toLowerCase().includes(h)
  );
  checks.push({
    key: "sections",
    pass: headingsFound.length >= 2,
    reason: headingsFound.length >= 2 ? undefined : "Not many standard sections found (experience, education, skills...)"
  });

  // Heuristic 4 — long paragraphs (may hurt ATS/scan)
  const longPara = resumeText.split(/\n{2,}/).some(p => p.split(" ").length > 120);
  checks.push({
    key: "long_paragraphs",
    pass: !longPara,
    reason: longPara ? "Long paragraphs detected — prefer short bullet points" : undefined
  });

  return checks;
}

function keywordScore(resumeKeywords: string[], jobKeywords: string[]) {
  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const matched = jobKeywords.filter(k => resumeSet.has(k.toLowerCase()));
  const missing = jobKeywords.filter(k => !resumeSet.has(k.toLowerCase()));
  const matchPct = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
  return { matched, missing, matchPct };
}

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescText } = await req.json();
    if (!resumeText) return NextResponse.json({ error: "Missing resumeText" }, { status: 400 });

    // 1) Deterministic checks (formatting)
    const formatChecks = deterministicChecks(resumeText);

    // 2) Ask Groq to extract structured information from the resume.
    const extractResumePrompt = [
      { role: "system", content: "You are a strict JSON-outputting parser assistant." },
      {
        role: "user",
        content:
`Extract the following from the resume text. Output only valid JSON exactly matching this schema:
{
  "name": "<string or null>",
  "email": "<string or null>",
  "phone": "<string or null>",
  "title": "<string or null>",
  "skills": ["skill1","skill2", ...],
  "bullets": ["bullet1", "bullet2", ...],  // experience bullets
  "education": ["degree and institution lines ..."],
  "metrics": ["strings containing metrics like 'reduced X by 20%'", ...]
}
Resume text:
${resumeText}`
      }
    ];

    const groqResumeResp = await callGroq(extractResumePrompt);
    // This depends on the Groq response shape. Example: groq returns choices[0].message.content
    const groqText = groqResumeResp.choices?.[0]?.message?.content || groqResumeResp.choices?.[0]?.text || "";
    // try parse JSON
    let parsedResume: any = {};
    try { parsedResume = JSON.parse(groqText); } catch (e) {
      // fallback: ask Groq again with "fix JSON" or attempt a simple extraction
      parsedResume = { skills: [], bullets: [], metrics: [], name: null, email: null, phone: null, title: null, education: [] };
    }

    // 3) Get job keywords. If jobDescText provided, use Groq to extract keywords, else assume empty
    let jobKeywords: string[] = [];
    if (jobDescText) {
      const jobPrompt = [
        { role: "system", content: "You are a JSON-outputting extractor." },
        {
          role: "user",
          content: `Extract three arrays from this job description: requiredSkills, preferredSkills, roleTitles. Output only JSON:
{ "requiredSkills": [...], "preferredSkills":[...], "roleTitles":[...] }
Job description:
${jobDescText}`
        }
      ];
      const jobResp = await callGroq(jobPrompt);
      const jobText = jobResp.choices?.[0]?.message?.content || jobResp.choices?.[0]?.text || "";
      try {
        const parsedJob = JSON.parse(jobText);
        jobKeywords = [
          ...(parsedJob.requiredSkills || []),
          ...(parsedJob.preferredSkills || [])
        ].map((s: string) => s.trim()).filter(Boolean);
      } catch {
        jobKeywords = [];
      }
    }

    // 4) Keyword overlap
    const resumeSkills = (parsedResume.skills || []).map((s: string) => s.trim()).filter(Boolean);
    const { matched, missing, matchPct } = keywordScore(resumeSkills, jobKeywords);

    // 5) Ask Groq to suggest rewritten bullets / improvements
    const rewritePrompt = [
      { role: "system", content: "You are an assistant that returns JSON." },
      {
        role: "user",
        content:
`Given these resume bullets:
${JSON.stringify(parsedResume.bullets || [], null, 2)}
and these missing keywords:
${JSON.stringify(missing, null, 2)}
Return JSON:
{
  "suggestions": ["suggested improved bullet 1", ...],
  "topRisks": ["risk1", ...]
}`
      }
    ];
    const rewriteResp = await callGroq(rewritePrompt);
    const rewriteText = rewriteResp.choices?.[0]?.message?.content || rewriteResp.choices?.[0]?.text || "";
    let rewriteResult: any = { suggestions: [], topRisks: [] };
    try { rewriteResult = JSON.parse(rewriteText); } catch (e) { /* ignore */ }

    // 6) Compose ATS score:
    // Simple weighted score:
    // - format checks: each pass=+10 points
    // - keyword matchPct contributes up to 50 points
    // - presence of metrics adds +10
    // - contact info adds +10
    // normalize to 0-100

    let score = 0;
    const formatPoints = formatChecks.reduce((acc, c) => acc + (c.pass ? 10 : 0), 0); // e.g. 5 checks -> up to 50
    const keywordPoints = Math.round((matchPct / 100) * 40); // up to 40
    const metricsPoints = ((parsedResume.metrics && parsedResume.metrics.length > 0) ? 10 : 0);
    // contact info (email)
    const contactPoints = formatChecks.find(c => c.key === "contact_email")?.pass ? 10 : 0;

    score = Math.min(100, formatPoints + keywordPoints + metricsPoints + contactPoints);

    // 7) Compose response
    const result = {
      atsScore: score,
      breakdown: {
        formatChecks,
        keywordMatchPct: matchPct,
        matched,
        missing,
        metricsFound: parsedResume.metrics || [],
        contact: { email: parsedResume.email || null, phone: parsedResume.phone || null }
      },
      suggestions: rewriteResult.suggestions || [],
      topRisks: rewriteResult.topRisks || [],
      rawParsedResume: parsedResume
    };

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("analyze error", err);
    return NextResponse.json({ error: err.message || "analysis failed" }, { status: 500 });
  }
}
