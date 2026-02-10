# PDF Generation from optimizedResume JSON

## Overview

The system now generates ATS-friendly PDF resumes from `optimizedResume` JSON using HTML/CSS + Puppeteer.
The layout replicates LaTeX resume formatting with single-column design, tight spacing, and section dividers.

## Architecture

```
optimizedResume JSON → HTML Template → Puppeteer → PDF
```

## Files Created

### 1. `templates/resume.html`
- HTML template with Mustache-style placeholders
- LaTeX-inspired CSS styling
- Single-column layout with two-column subheadings
- ATS-compliant (real text, no images, semantic HTML)
- Hidden keyword block for ATS optimization

### 2. `utils/generatePdfFromJson.ts`
- Template rendering engine (no external dependencies)
- Puppeteer PDF generation
- Two functions:
  - `generatePdfFromJson(resumeJson, outputPath)` - saves to file
  - `generatePdfBuffer(resumeJson)` - returns Buffer for API

### 3. `app/api/generate-pdf/route.ts`
- POST endpoint for PDF generation
- Accepts `optimizedResume` JSON in request body
- Returns PDF as binary download

## API Usage

### Endpoint: `POST /api/generate-pdf`

**Request:**
```json
{
  "optimizedResume": {
    "name": "John Doe",
    "profile_summary": "...",
    "contact": {...},
    "skills": {...},
    "education": [...],
    "experience": [...],
    "projects": [...],
    "certifications": [...],
    "achievements": [...]
  }
}
```

**Response:**
- Content-Type: `application/pdf`
- Binary PDF file download

**Example (JavaScript):**
```javascript
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ optimizedResume: resumeData })
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Download or display PDF
```

## LaTeX-to-HTML Mapping

| LaTeX Command | HTML/CSS Equivalent |
|---------------|---------------------|
| `\section{Title}` | `<div class="section-title">` with border-bottom |
| `\resumeSubheading` | Two-column flexbox with `.subheading` |
| `\begin{itemize}` | `<ul>` with custom spacing |
| `\item` | `<li>` |
| `\textbf{}` | `<strong>` or `.subheading-title` |
| `\textit{}` | `<em>` or `.subheading-subtitle` |
| `\href{}{}` | `<a href="">` |
| Tabular header | Flexbox `.header` with left/right alignment |

## CSS Features

- Font: Times New Roman (serif, ATS-standard)
- Size: 11pt body, 12pt sections, 18pt name
- Margins: 0.5in all sides
- Tight line-height: 1.3
- Section dividers: 1pt solid black underline
- Two-column subheadings via flexbox
- Hidden ATS keyword block (white text)

## ATS Compliance

✅ Real selectable text (no images)
✅ Semantic HTML structure
✅ Standard font (Times New Roman)
✅ Single-column layout
✅ Proper heading hierarchy
✅ No tables for layout
✅ No background colors/images
✅ Hidden keyword optimization block

## Testing

### Verify PDF Quality:
1. Text is selectable (copy/paste works)
2. Layout matches LaTeX spacing
3. No broken sections
4. Links are clickable
5. File size < 500KB

### Test with ATS:
1. Upload PDF to ATS parser
2. Verify all text extracted correctly
3. Check section recognition
4. Confirm no parsing errors

## Integration with Existing Flow

Current: `/api/upload-resume` → returns `optimizedResume` JSON
New: `/api/generate-pdf` → converts JSON → PDF

**Combined workflow:**
```javascript
// Step 1: Upload resume
const uploadResponse = await fetch('/api/upload-resume', {
  method: 'POST',
  body: formData
});
const { optimizedResume } = await uploadResponse.json();

// Step 2: Generate PDF
const pdfResponse = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ optimizedResume })
});
const pdfBlob = await pdfResponse.blob();
```

## Dependencies Added

```json
{
  "dependencies": {
    "puppeteer": "^latest"
  }
}
```

## Customization

### Modify Layout:
Edit `templates/resume.html` (CSS in `<style>` block)

### Add Sections:
Add conditional blocks in HTML:
```html
{{#custom_section.length}}
<div class="section">
  <div class="section-title">Custom Section</div>
  <!-- content -->
</div>
{{/custom_section.length}}
```

### Change Styling:
Modify CSS variables in template:
- Font: `font-family` in `body`
- Spacing: `margin-bottom` values
- Colors: `color` and `border-bottom`

## Notes

- JSON structure must match `ResumeJSON` interface
- All fields validated before PDF generation
- Puppeteer runs in headless mode
- PDF generation takes ~2-3 seconds
- Output is A4 format by default
