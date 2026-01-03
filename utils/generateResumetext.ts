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
        { role: "system", content: `You are a deterministic resume data extraction and optimization engine.

Your task is to output a SINGLE valid JSON object that conforms EXACTLY to the provided schema.

Rules you MUST follow:
- Output JSON ONLY. No markdown, no comments, no explanations.
- All keys defined in the schema MUST be present.
- If information is missing, use empty strings "" or empty arrays [].
- NEVER invent information.
- NEVER change key names.
- NEVER omit required fields.
- NEVER nest additional objects.
- NEVER add extra keys.
- All arrays must always be arrays, even if empty.
- Dates must be plain text strings (no calculations).

If you are unsure about any value, leave it empty.

Your output MUST be parseable by JSON.parse() without modification.
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
   
    return { parsed , success:true};
  } catch (err) {
    console.error("❌ Error generating while ai generation", err);

    // Safe fallback (never break your app)
    return {
     message : "error occured in generate json from resume text",
     success:false,
     parsed :err

      
    };
  }
}
