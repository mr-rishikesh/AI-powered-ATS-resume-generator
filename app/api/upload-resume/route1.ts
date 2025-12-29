import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Log content-type for debugging
  console.log('content-type:', req.headers.get('content-type'));

  // Quick check for multipart
  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error('formData parse error:', err);
    return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 });
  }

  const file = formData.get('resume') as File | null;
  console.log('formData.get("resume") ->', !!file, file && { name: file.name, size: file.size, type: file.type });

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded under field "resume"' }, { status: 400 });
  }

  // Convert to Buffer and write to disk
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate basic mime (client-provided) and size
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: pdf, doc, docx' }, { status: 400 });
    }

    // optional size limit: reject > 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 });
    }

    const safeName = (file.name ?? 'file').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.promises.writeFile(filePath, buffer);

    //
    //


    





    //

    return NextResponse.json({
      message: 'Upload successful',
      file: { filename, originalName: file.name, size: buffer.length, mimeType: file.type, path: `/uploads/${filename}` },
    }, { status: 200 });
  } catch (err) {
    console.error('Write error:', err);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
