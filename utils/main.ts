import { resume_template } from "@/resume_template/template";
import { generateResumeText } from "./generateResumetext";
import { jsonToLatexGenerator } from "./jsonToLatexGenerator";
import { renderResumeToLatex } from "./renderResumeToLatex";

export async function generateResume(resumeText: any, jobDescription: any) {
  try {
    const { parsed, success } = await generateResumeText(
      resumeText,
      jobDescription
    );
    //  await new Promise(())
    if (!success) {
      return {
        parsed: "error occured while generating json ",
      };
    }

    // const latex = renderResumeToLatex(resume_template, parsed);

    return { parsed: parsed };
  } catch (error) {
    console.log(error);
    return {
      message: "error occured",
    };
  }
}
