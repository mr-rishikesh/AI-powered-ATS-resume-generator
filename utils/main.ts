// import { resume_template } from "@/resume_template/template";
import { generateResumeText } from "./generateResumetext";
// import { jsonToLatexGenerator } from "./jsonToLatexGenerator";
// import { renderResumeToLatex } from "./renderResumeToLatex";
import { validateResumeJson, hasMinimumResumeData } from "./validateResumeJson";

/**
 * Main function to generate optimized resume JSON from resume text and job description
 * @param resumeText - Raw text extracted from resume file
 * @param jobDescription - Target job description for optimization
 * @returns Object containing validated resume JSON or error
 */
export async function generateResume(resumeText: any, jobDescription: any) {
  try {
    console.log("🚀 Starting resume generation...");
    console.log(`📄 Resume text length: ${resumeText?.length || 0} characters`);
    console.log(`📋 Job description length: ${jobDescription?.length || 0} characters`);

    // Step 1: Generate optimized resume JSON from AI
    const { parsed, success, error } = await generateResumeText(
      resumeText,
      jobDescription
    );

    if (!success || !parsed) {
      console.error("❌ Failed to generate resume JSON:", error);
      return {
        success: false,
        error: error || "Failed to generate optimized resume JSON",
        parsed: null,
      };
    }

    // Step 2: Validate and sanitize the parsed JSON
    let validatedResume;
    try {
      validatedResume = validateResumeJson(parsed);
    } catch (validationError: any) {
      console.error("❌ Resume validation failed:", validationError.message);
      return {
        success: false,
        error: `Validation failed: ${validationError.message}`,
        parsed: null,
      };
    }

    // Step 3: Check if resume has minimum required data
    if (!hasMinimumResumeData(validatedResume)) {
      console.warn("⚠️ Warning: Resume appears to have insufficient data");
      return {
        success: false,
        error: "Resume data is incomplete or missing critical information",
        parsed: validatedResume,
        warning: "Insufficient resume data extracted",
      };
    }

    console.log("✅ Resume generation and validation complete");

    // Optional: Generate LaTeX if template is available
    // const latex = renderResumeToLatex(resume_template, validatedResume);

    return {
      success: true,
      parsed: validatedResume,
      message: "Resume successfully optimized for ATS",
    };

  } catch (error: any) {
    console.error("❌ Unexpected error in generateResume:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred",
      parsed: null,
    };
  }
}
