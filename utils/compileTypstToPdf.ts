import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Compiles a Typst file to PDF using the Typst CLI
 * This replaces Puppeteer as the PDF generation engine
 *
 * @param typstFilePath - Path to the .typ file
 * @param outputPdfPath - Desired output path for PDF
 * @returns Path to the generated PDF
 */
export async function compileTypstToPdf(
  typstFilePath: string,
  outputPdfPath: string
): Promise<string> {
  try {
    // Validate input file exists
    if (!fs.existsSync(typstFilePath)) {
      throw new Error(`Typst file not found: ${typstFilePath}`);
    }

    // Determine Typst CLI path
    const typstCliPath = path.join(process.cwd(), 'bin', 'typst', 'typst.exe');

    if (!fs.existsSync(typstCliPath)) {
      throw new Error(`Typst CLI not found at: ${typstCliPath}`);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPdfPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Compile Typst to PDF
    const command = `"${typstCliPath}" compile "${typstFilePath}" "${outputPdfPath}"`;

    console.log(`🔄 Compiling Typst: ${typstFilePath}`);
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stderr && stderr.trim().length > 0) {
      console.warn(`⚠️  Typst compilation warnings:\n${stderr}`);
    }

    if (stdout && stdout.trim().length > 0) {
      console.log(`ℹ️  Typst output: ${stdout}`);
    }

    // Verify PDF was created
    if (!fs.existsSync(outputPdfPath)) {
      throw new Error(`PDF was not generated at: ${outputPdfPath}`);
    }

    const pdfSize = fs.statSync(outputPdfPath).size;
    if (pdfSize === 0) {
      throw new Error('Generated PDF is empty (0 bytes)');
    }

    console.log(`✅ PDF compiled successfully: ${outputPdfPath} (${pdfSize} bytes)`);

    return outputPdfPath;

  } catch (error: any) {
    console.error('❌ Typst compilation error:', error);

    // Parse Typst error messages for better debugging
    let detailedError = error.message;

    if (error.stderr) {
      console.error('Typst stderr:', error.stderr);

      // Extract line number and error details from Typst output
      // Use [\s\S] instead of . with /s flag for ES5 compatibility
      const lineMatch = error.stderr.match(/error: (.+?)\n[\s\S]*?-->\s+.*?:(\d+):(\d+)/);
      if (lineMatch) {
        const [, errorMsg, lineNum, colNum] = lineMatch;
        detailedError = `Typst error at line ${lineNum}, column ${colNum}: ${errorMsg}`;
        console.error(`📍 Error location: Line ${lineNum}, Column ${colNum}`);
        console.error(`📝 Error message: ${errorMsg}`);
      }
    }

    // Read and log the problematic .typ file for debugging
    if (fs.existsSync(typstFilePath)) {
      try {
        const typstContent = fs.readFileSync(typstFilePath, 'utf-8');
        const lines = typstContent.split('\n');

        // Log a few lines around the error for context
        if (error.stderr) {
          const lineMatch = error.stderr.match(/:(\d+):/);
          if (lineMatch) {
            const errorLine = parseInt(lineMatch[1]);
            const start = Math.max(0, errorLine - 3);
            const end = Math.min(lines.length, errorLine + 2);

            console.error('\n📄 Context around error:');
            for (let i = start; i < end; i++) {
              const marker = i === errorLine - 1 ? '>>> ' : '    ';
              console.error(`${marker}${i + 1}: ${lines[i]}`);
            }
          }
        }
      } catch (readError) {
        console.error('Could not read .typ file for debugging');
      }
    }

    throw new Error(`Typst compilation failed: ${detailedError}`);
  }
}

/**
 * Compiles Typst to PDF and returns as Buffer
 * Used for API responses
 *
 * @param typstFilePath - Path to the .typ file
 * @returns PDF as Buffer
 */
export async function compileTypstToPdfBuffer(
  typstFilePath: string
): Promise<Buffer> {
  try {
    // Generate temporary output path
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const tempPdfPath = path.join(tempDir, `resume_${timestamp}.pdf`);

    // Compile to PDF
    await compileTypstToPdf(typstFilePath, tempPdfPath);

    // Read PDF as buffer
    const pdfBuffer = fs.readFileSync(tempPdfPath);

    // Clean up temporary PDF
    fs.unlinkSync(tempPdfPath);

    console.log(`✅ PDF buffer generated successfully (${pdfBuffer.length} bytes)`);

    return pdfBuffer;

  } catch (error: any) {
    console.error('❌ Error generating PDF buffer:', error);
    throw new Error(`PDF buffer generation failed: ${error.message}`);
  }
}

/**
 * Cleans up temporary Typst and PDF files
 * Should be called after successful PDF generation
 *
 * @param typstFilePath - Path to the temporary .typ file
 */
export function cleanupTempFiles(typstFilePath: string): void {
  try {
    if (fs.existsSync(typstFilePath)) {
      fs.unlinkSync(typstFilePath);
      console.log(`🗑️  Cleaned up temp file: ${typstFilePath}`);
    }
  } catch (error: any) {
    console.warn(`⚠️  Failed to cleanup temp file ${typstFilePath}: ${error.message}`);
  }
}

/**
 * Validates Typst CLI installation
 * Returns true if Typst is available, false otherwise
 */
export async function validateTypstInstallation(): Promise<boolean> {
  try {
    const typstCliPath = path.join(process.cwd(), 'bin', 'typst', 'typst.exe');

    if (!fs.existsSync(typstCliPath)) {
      console.error('❌ Typst CLI not found');
      return false;
    }

    const { stdout } = await execAsync(`"${typstCliPath}" --version`);
    console.log(`✅ Typst CLI available: ${stdout.trim()}`);
    return true;

  } catch (error: any) {
    console.error('❌ Typst validation failed:', error.message);
    return false;
  }
}
