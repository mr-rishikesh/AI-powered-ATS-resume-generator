import { NextResponse } from 'next/server';
import { validateResumeJson } from '@/utils/validateResumeJson';
import { generateTypstFromJson, writeTypstToTempFile } from '@/utils/generateTypstFromJson';
import { compileTypstToPdfBuffer, cleanupTempFiles } from '@/utils/compileTypstToPdf';

/**
 * POST /api/preview-pdf
 *
 * Generates a PDF resume preview from optimizedResume JSON using Typst
 * Same as generate-pdf but returns inline instead of download
 *
 * Request body:
 * {
 *   "optimizedResume": ResumeJSON
 * }
 *
 * Returns: PDF file for inline viewing
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

    // Return PDF for inline viewing
    const response = new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline', // Display in browser instead of download
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    return response;

  } catch (error: any) {
    console.error('❌ PDF preview generation error:', error);

    // Clean up on error
    if (typstFilePath) {
      cleanupTempFiles(typstFilePath);
    }

    return NextResponse.json(
      { success: false, error: error.message || 'PDF preview generation failed' },
      { status: 500 }
    );
  }
}
