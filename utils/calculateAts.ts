import '../envConfig.ts'
import Groq from "groq-sdk";
import { calculateAtsPrompt } from "./prompts";
import { extractJsonFromModel } from "./extractJsonFromModel";

const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});


/**
 * Generates ATS score by comparing resume against job description
 * @param resumeText - Raw text extracted from resume
 * @param jobDescription - Target job description
 * @returns Detailed ATS scoring analysis with breakdown and suggestions
 */
export async function generateATSScore(resumeText: any, jobDescription: any) {
  try {
    // Validate inputs
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text is too short or empty for ATS analysis");
    }



    const prompt = `
${calculateAtsPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY a valid JSON object with the following structure (no markdown, no backticks):

{
  "skills_match_score": <number 0-100>,
  "experience_match_score": <number 0-100>,
  "education_match_score": <number 0-100>,
  "keyword_match_score": <number 0-100>,
  "certifications_score": <number 0-100>,
  "job_title_alignment_score": <number 0-100>,
  "overall_ats_score": <number 0-100>,
  "explanation": "Detailed explanation of scoring methodology and key findings",
  "improvement_suggestions": "Specific, actionable recommendations to improve ATS score"
}

All scores must be integers between 0 and 100.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert Applicant Tracking System (ATS) evaluator with deep knowledge of resume screening algorithms.

Your task is to analyze how well a resume matches a job description and provide a detailed, objective scoring analysis.

CRITICAL RULES:
- Output PURE JSON ONLY - no markdown, no backticks, no explanations outside the JSON
- All scores must be integers between 0 and 100
- Base scores on actual content matching, not potential or assumptions
- Be specific in explanations - cite actual skills, keywords, and requirements
- Provide actionable improvement suggestions, not generic advice
- Calculate overall_ats_score as weighted average: skills (30%), experience (30%), keywords (20%), education (10%), certifications (5%), job title (5%)

Your output must be parseable by JSON.parse() without modification.`
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2, // Lower temperature for more consistent scoring
      max_tokens: 1200, // Increased for detailed explanations
      top_p: 0.9,
    });

    // Extract the text from model output
    const text =
      response?.choices?.[0]?.message?.content?.trim() ||
      response?.choices?.[0]?.message?.reasoning?.trim();

    if (!text) {
      throw new Error("Model returned empty content");
    }

    console.log("📊 Raw ATS Score Response Length:", text.length);

    // Parse JSON response
    let parsed = extractJsonFromModel(text);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error("Failed to extract valid ATS score JSON");
    }

    // Validate score fields
    const requiredFields = [
      'skills_match_score',
      'experience_match_score',
      'education_match_score',
      'keyword_match_score',
      'certifications_score',
      'job_title_alignment_score',
      'overall_ats_score'
    ];

    for (const field of requiredFields) {
      if (typeof parsed[field] !== 'number') {
        console.warn(`⚠️ Warning: ${field} is not a number, defaulting to 0`);
        parsed[field] = 0;
      }
      // Clamp scores to 0-100 range
      parsed[field] = Math.max(0, Math.min(100, Math.round(parsed[field])));
    }

    console.log(`✅ ATS Score calculated: ${parsed.overall_ats_score}/100`);

    return { parsed, success: true };

  } catch (err: any) {
    console.error("❌ Error generating ATS score:", err);

    // Return error with context
    return {
      success: false,
      message: "Failed to calculate ATS score",
      error: err?.message || String(err),
      parsed: null,
    };
  }
}
