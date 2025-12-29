import '../envConfig.ts'
import Groq from "groq-sdk";
import { calculateAtsPrompt } from "./prompts";
import { extractJsonFromModel } from "./extractJsonFromModel";
import { env } from "process";

const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});


export async function generateATSScore(resumeText : any, jobDescription : any) {
  try {
    const prompt = `
${calculateAtsPrompt}
Input
 resume text : ${resumeText}
 Job description : ${jobDescription}

Make sure you are only Returning  a valid JSON like this nothinig else text just a json:

{
"skills_match_score": number,
"experience_match_score": number,
"education_match_score": number,
"keyword_match_score": number,
"certifications_score": number,
"job_title_alignment_score": number,
"overall_ats_score": number,
"explanation": "Detailed explanation of the scoring and reasoning.",
"improvement_suggestions": "Actionable suggestions to improve the resume’s ATS score."
}
`;



    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an advanced Applicant Tracking System (ATS) evaluator. Your task is to analyze a candidate’s resume and a job description, then calculate a highly reliable ATS score that reflects how well the resume matches the job requirements. Always output strict JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    // console.log("🧠 Full Groq API response:", JSON.stringify(response, null, 2));


    // Extract the text from model output
    const text =   
      response?.choices?.[0]?.message?.content?.trim() ||
       response?.choices?.[0]?.message?.reasoning?.trim();
    if (!text) throw new Error("Model returned empty content");

    let parsed = extractJsonFromModel(text);

    // // Try to safely extract JSON
    // try {
    //   // Sometimes model adds notes — so extract only the JSON part
    //   const jsonMatch = text.match(/\{[\s\S]*\}/);
    //   parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    // } catch (err) {
    //   console.warn("⚠️ Model returned non-JSON text, using fallback parser:", text);
    //   // Fallback parser if AI sends plain text like "Subject: ..., Body: ..."
    //   const subjectMatch = text.match(/Subject:\s*(.*)/i);
    //   const bodyMatch = text.match(/Body:\s*([\s\S]*)/i);
    //   parsed = {
    //     subject: subjectMatch ? subjectMatch[1].trim() : null,
    //     body: bodyMatch ? bodyMatch[1].trim() : null,
    //   };
    // }

    // Cleanup and defaults

    return { parsed};
  } catch (err) {
    console.error("❌ Error generating while ai generation", err);

    // Safe fallback (never break your app)
    return {
     message : "error occured"
      
    };
  }
}
