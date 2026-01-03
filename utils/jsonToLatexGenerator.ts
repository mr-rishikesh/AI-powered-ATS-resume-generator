import '../envConfig.ts'
import Groq from "groq-sdk";
import { atsOptimizationPrompt, jsonToLatexPrompt } from "./prompts";
import { extractJsonFromModel } from "./extractJsonFromModel";
import { env } from "process";
import { resume_template } from '@/resume_template/template';

const groq = new Groq({
  apiKey: process.env.GROQ_APIKEY,
});


export async function jsonToLatexGenerator(resumeJson : any) {
  try {
    const prompt = `
${jsonToLatexPrompt}
Input
 resume json : ${resumeJson}
 Latex resume template : ${resume_template}

Make sure you are only Returning  a valid JSON like this nothinig else text just a json that include tex latex content:
Return ONLY valid JSON.


Output 
 { resumeLatex : string
}
`;



    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `You are a deterministic Resume JSON to LaTeX renderer.

You do NOT generate, write, optimize, or invent resume content.
You ONLY render LaTeX by inserting provided data into an existing LaTeX template.

You behave like a strict formatter and placeholder replacer, not a writer.
Creativity, inference, or content generation is forbidden.
` },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
     // console.log("🧠 Full Groq API response:", JSON.stringify(response, null, 2));


    // Extract the text from model output
    const text =   
      response?.choices?.[0]?.message?.content?.trim() ||
       response?.choices?.[0]?.message?.reasoning?.trim();
    if (!text) throw new Error("Model returned empty content");

    let parsed = extractJsonFromModel(text);
   
    return {latex: response};
  } catch (err) {
    console.error("❌ Error generating while ai generation", err);

    // Safe fallback (never break your app)
    return {
     message : "error occured",
     parsed: "error occured in json to latex"
      
    };
  }
}
