import { NextResponse } from 'next/server';
import { validateResumeJson } from '@/utils/validateResumeJson';
import { generateTypstFromJson, writeTypstToTempFile } from '@/utils/generateTypstFromJson';
import { compileTypstToPdfBuffer, cleanupTempFiles } from '@/utils/compileTypstToPdf';

/**
 * POST /api/generate-pdf
 *
 * Generates a PDF resume from optimizedResume JSON using Typst
 *
 * Request body:
 * {
 *   "optimizedResume": ResumeJSON
 * }
 *
 * Returns: PDF file as binary stream
 */
export async function POST(req: Request) {
  let typstFilePath: string | null = null;

  try {
    const body = await req.json();
    const { optimizedResume } = body;

    if (!optimizedResume) {
      return NextResponse.json(
        { success: false, error: 'Missing optimizedResume in request body' },
        { status: 400 }
      );
    }

    // Validate JSON structure
    let validatedResume;
    try {
      validatedResume = validateResumeJson(optimizedResume);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: `Invalid resume JSON: ${error.message}` },
        { status: 400 }
      );
    }

    // Generate Typst content from JSON
    const typstContent = generateTypstFromJson(validatedResume);

    // Write to temporary file
    typstFilePath = writeTypstToTempFile(typstContent);

    // Compile Typst to PDF
    const pdfBuffer = await compileTypstToPdfBuffer(typstFilePath);

    // Clean up temporary Typst file
    cleanupTempFiles(typstFilePath);

    // Return PDF as response
    const response = new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${validatedResume.name.replace(/\s+/g, '_')}_Resume.pdf"`,
      },
    });

    return response;

  } catch (error: any) {
    console.error('❌ PDF generation error:', error);

    // Clean up on error
    if (typstFilePath) {
      cleanupTempFiles(typstFilePath);
    }

    return NextResponse.json(
      { success: false, error: error.message || 'PDF generation failed' },
      { status: 500 }
    );
  }
}
