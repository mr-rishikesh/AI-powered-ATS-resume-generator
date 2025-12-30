import '../../../envConfig'
import { extractText } from "unpdf";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { generateATSScore } from "@/utils/calculateAts";
import { generateResume } from '@/utils/main';

export async function POST(req: Request) {

  

  try {
    let text1 = "";
    const form = await req.formData();
    const jobDescription = form.get("jobDescription") as String | null;
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    console.log(2);
    const name = file.name || "resume";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (name.toLowerCase().endsWith(".pdf")) {
      
      const uint8 = new Uint8Array(arrayBuffer);
      const { text } = await extractText(uint8);

      text1 = text[0] || "";
    } else if (
      name.toLowerCase().endsWith(".docx") ||
      name.toLowerCase().endsWith(".doc")
    ) {
      const { value } = await mammoth.extractRawText({ buffer });
      text1 = value || "";
    } else {
      text1 = buffer.toString("utf8");
    }

    const isImageOnly = text1.trim().length < 200;
    console.log(4);

    const {parsed} = await generateResume(text1 , jobDescription )

    return NextResponse.json({
      aiResponse : parsed,
      success: true,
      fileName: name,
      text1,
      meta: { isImageOnly, length: text1.length },
    });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}
