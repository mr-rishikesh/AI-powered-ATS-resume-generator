import '../envConfig.ts'
import Groq from "groq-sdk";
import { atsOptimizationPrompt } from "./prompts";
import { extractJsonFromModel } from "./extractJsonFromModel";

const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});


/**
 * Generates ATS-optimized resume JSON from raw resume text and job description
 * @param resumeText - Raw text extracted from resume PDF/DOCX
 * @param jobDescription - Target job description for optimization
 * @returns Parsed JSON object with resume data or error
 */
export async function generateResumeText(resumeText: any, jobDescription: any) {
  try {
    // Validate inputs
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Resume text is too short or empty");
    }

    const prompt = `
${atsOptimizationPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription || "No specific job description provided. Optimize for general ATS compatibility."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY the JSON object. No markdown, no backticks, no explanations.
The JSON must be valid and parseable by JSON.parse() without any modifications.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS Resume Optimization Engine specializing in Applicant Tracking Systems.

Your ONLY task is to output a SINGLE valid JSON object that extracts and optimizes resume data.

CRITICAL RULES:
- Output PURE JSON ONLY - no markdown, no backticks, no \`\`\`json, no comments
- All schema fields MUST be present (use empty strings/arrays if data is missing)
- NEVER fabricate information - only use data from the resume text
- NEVER change key names from the schema
- NEVER add extra fields not in the schema
- Dates must be plain text strings (e.g., "Jan 2020", "2019-2021")
- All arrays must be arrays, even if empty: []
- Strings must be properly escaped for JSON

Your output must be directly parseable by JSON.parse() without any preprocessing.

If you are unsure about any value, use an empty string "" or empty array [] instead of inventing data.
`
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent structured output
      max_tokens: 4000, // Increased for complex resumes
      top_p: 0.9,
    });

    // Extract the text from model output
    const text =
      response?.choices?.[0]?.message?.content?.trim() ||
      response?.choices?.[0]?.message?.reasoning?.trim();

    if (!text) {
      throw new Error("Model returned empty content");
    }

    console.log("📄 Raw AI Response Length:", text.length);
    console.log("📄 First 200 chars:", text.substring(0, 200));

    // Extract and parse JSON
    let parsed = extractJsonFromModel(text);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error("Failed to extract valid JSON from AI response");
    }

    // Validate critical fields
    if (!parsed.name && !parsed.contact) {
      console.warn("⚠️ Warning: Missing critical fields (name/contact) in parsed resume");
    }

    console.log("✅ Successfully parsed resume JSON");
    return { parsed, success: true };

  } catch (err: any) {
    console.error("❌ Error in generateResumeText:", err);

    // Detailed error response for debugging
    return {
      message: "Failed to generate optimized resume JSON",
      error: err?.message || String(err),
      success: false,
      parsed: null
    };
  }
}
