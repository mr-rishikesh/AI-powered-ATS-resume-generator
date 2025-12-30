import '../envConfig.ts'
import Groq from "groq-sdk";
import { atsOptimizationPrompt } from "./prompts";
import { extractJsonFromModel } from "./extractJsonFromModel";
import { env } from "process";

const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});


export async function generateResumeText(resumeText : any, jobDescription : any) {
  try {
    const prompt = `
${atsOptimizationPrompt}
Input
 resume text : ${resumeText}
 Job description : ${jobDescription}

Make sure you are only Returning  a valid JSON like this nothinig else text just a json:
Return ONLY valid JSON.
Do not use markdown.
Do not wrap in backticks.
`;



    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an advanced Applicant Tracking System (ATS) resume text writer. Your task is to generate a candidate’s resume text, Always output strict JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    // console.log("🧠 Full Groq API response:", JSON.stringify(response, null, 2));


    // Extract the text from model output
    const text =   
      response?.choices?.[0]?.message?.content?.trim() ||
       response?.choices?.[0]?.message?.reasoning?.trim();
    if (!text) throw new Error("Model returned empty content");

    let parsed = extractJsonFromModel(text);
   
    return { parsed};
  } catch (err) {
    console.error("❌ Error generating while ai generation", err);

    // Safe fallback (never break your app)
    return {
     message : "error occured"
      
    };
  }
}
