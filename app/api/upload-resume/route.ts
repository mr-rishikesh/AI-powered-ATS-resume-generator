import '../../../envConfig'
import { extractText } from "unpdf";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { generateResume } from '@/utils/main';

/**
 * POST /api/upload-resume
 *
 * Handles resume file upload, text extraction, ATS optimization, and scoring
 *
 * Expected FormData:
 * - file: Resume file (PDF, DOCX, DOC, or TXT)
 * - jobDescription: Optional job description for targeted optimization
 *
 * Returns:
 * - optimizedResume: ATS-optimized resume JSON with structured fields
 * - atsScore: Detailed ATS scoring analysis (if job description provided)
 * - extractedText: Raw text extracted from resume
 * - metadata: File info and extraction details
 */
export async function POST(req: Request) {
  try {
    console.log("📥 Resume upload request received");

    // Step 1: Parse form data
    const form = await req.formData();
    const jobDescription = form.get("jobDescription") as string | null;
    const file = form.get("file") as File | null;

    // Validate file input
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded. Please provide a resume file."
        },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume";
    console.log(`📄 Processing file: ${fileName}`);

    // Step 2: Extract text from file based on file type
    let extractedText = "";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (fileName.toLowerCase().endsWith(".pdf")) {
      console.log("📄 Extracting text from PDF...");
      const uint8 = new Uint8Array(arrayBuffer);
      const { text } = await extractText(uint8);
      extractedText = text[0] || "";
    } else if (
      fileName.toLowerCase().endsWith(".docx") ||
      fileName.toLowerCase().endsWith(".doc")
    ) {
      console.log("📄 Extracting text from DOCX...");
      const { value } = await mammoth.extractRawText({ buffer });
      extractedText = value || "";
    } else {
      console.log("📄 Reading as plain text...");
      extractedText = buffer.toString("utf8");
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not extract sufficient text from the resume. The file may be image-based or corrupted.",
          extractedText,
          meta: {
            fileName,
            textLength: extractedText.length,
            isImageOnly: true,
          },
        },
        { status: 400 }
      );
    }

    console.log(`✅ Extracted ${extractedText.length} characters from resume`);

    // Step 3: Generate ATS-optimized resume JSON (with job description if provided)
    const resumeResult = await generateResume(extractedText, jobDescription);

    if (!resumeResult.success || !resumeResult.parsed) {
      return NextResponse.json(
        {
          success: false,
          error: resumeResult.error || "Failed to generate optimized resume",
          warning: resumeResult.warning,
          extractedText,
          meta: {
            fileName,
            textLength: extractedText.length,
          },
        },
        { status: 500 }
      );
    }

    // Step 4: Return successful response
    return NextResponse.json({
      success: true,
      optimizedResume: resumeResult.parsed,
      extractedText,
      meta: {
        fileName,
        textLength: extractedText.length,
        hasJobDescription: !!jobDescription,
        timestamp: new Date().toISOString(),
      },
      message: "Resume successfully processed and optimized for ATS",
    });

  } catch (err: any) {
    console.error("❌ Resume upload error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your resume",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
