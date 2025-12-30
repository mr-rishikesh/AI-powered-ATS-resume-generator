import { generateResumeText } from "./generateResumetext";

export async function generateResume(resumeText : any, jobDescription : any){
    try {
         const {parsed  }= await generateResumeText(resumeText, jobDescription);
        //  await new Promise(())
         return {parsed};
    } catch (error) {
        console.log(error)
            return {
           message : "error occured"
      
    };
    }
   

   
}


