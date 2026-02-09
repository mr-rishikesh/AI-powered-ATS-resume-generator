# Smart Resume Analyzer & ATS Optimizer - API Documentation

## Overview

This application analyzes resumes and optimizes them for Applicant Tracking Systems (ATS). It extracts text from resume files, generates structured JSON data, and calculates ATS compatibility scores.

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js
- **AI Model**: Groq SDK with Llama 3.3 70B
- **File Processing**: unpdf (PDF), mammoth (DOCX)

### Key Features
1. ✅ Multi-format resume parsing (PDF, DOCX, DOC, TXT)
2. ✅ AI-powered text extraction and structuring
3. ✅ ATS score calculation with detailed breakdown
4. ✅ Resume optimization aligned with job descriptions
5. ✅ Comprehensive validation and error handling

---

## API Endpoint

### `POST /api/upload-resume`

Uploads a resume file, extracts content, generates ATS-optimized JSON, and calculates compatibility score.

#### Request Format

**Content-Type**: `multipart/form-data`

**Form Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Resume file (PDF, DOCX, DOC, or TXT) |
| `jobDescription` | String | No | Target job description for optimization and scoring |

#### Example Request (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('file', resumeFile); // File from <input type="file">
formData.append('jobDescription', 'Senior Full Stack Developer with 5+ years...');

const response = await fetch('/api/upload-resume', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
```

#### Example Request (cURL)

```bash
curl -X POST http://localhost:3000/api/upload-resume \
  -F "file=@resume.pdf" \
  -F "jobDescription=Looking for a Senior Software Engineer with Python and React experience..."
```

---

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "optimizedResume": {
    "name": "John Doe",
    "profile_summary": "Experienced Full Stack Developer with 5+ years building scalable web applications using React, Node.js, and Python. Proven track record of delivering high-impact features for Fortune 500 companies.",
    "contact": {
      "email": "john.doe@email.com",
      "phone": "+1-234-567-8900",
      "location": "San Francisco, CA",
      "github": "github.com/johndoe",
      "linkedin": "linkedin.com/in/johndoe",
      "website": "johndoe.dev"
    },
    "skills": {
      "languages": ["JavaScript", "Python", "TypeScript", "SQL"],
      "frameworks": ["React", "Node.js", "Express", "Django", "Next.js"],
      "tools": ["Git", "Docker", "AWS", "PostgreSQL", "MongoDB"],
      "soft_skills": ["Team Leadership", "Agile Methodology", "Problem Solving"]
    },
    "education": [
      {
        "institution": "University of California, Berkeley",
        "location": "Berkeley, CA",
        "degree": "Bachelor of Science in Computer Science",
        "start": "2015",
        "end": "2019",
        "details": ["GPA: 3.8/4.0", "Dean's List"]
      }
    ],
    "experience": [
      {
        "company": "Tech Corp",
        "title": "Senior Software Engineer",
        "location": "San Francisco, CA",
        "start": "Jan 2021",
        "end": "Present",
        "bullets": [
          "Led development of microservices architecture serving 2M+ users",
          "Improved application performance by 40% through code optimization",
          "Mentored team of 5 junior developers"
        ]
      }
    ],
    "projects": [
      {
        "name": "E-commerce Platform",
        "role": "Lead Developer",
        "start": "2022",
        "end": "2023",
        "url": "github.com/johndoe/ecommerce",
        "bullets": [
          "Built full-stack e-commerce platform using React and Node.js",
          "Implemented payment processing with Stripe API"
        ]
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "year": "2022"
      }
    ],
    "achievements": [
      "Winner of company hackathon 2022",
      "Published article on React optimization with 10K+ views"
    ]
  },
  "atsScore": {
    "skills_match_score": 85,
    "experience_match_score": 90,
    "education_match_score": 80,
    "keyword_match_score": 88,
    "certifications_score": 75,
    "job_title_alignment_score": 95,
    "overall_ats_score": 87,
    "explanation": "The resume demonstrates strong alignment with the job requirements. The candidate has extensive experience with the required tech stack (React, Node.js, Python) and shows progressive career growth. Key strengths include quantifiable achievements and relevant certifications.",
    "improvement_suggestions": "To improve ATS score: 1) Add more industry-specific keywords from the job description, 2) Include metrics for all major achievements, 3) Add any missing technical skills mentioned in the job posting, 4) Ensure profile summary directly addresses key job requirements."
  },
  "extractedText": "John Doe\nSenior Software Engineer\n...",
  "meta": {
    "fileName": "resume.pdf",
    "textLength": 2847,
    "hasJobDescription": true,
    "timestamp": "2026-02-09T10:30:00.000Z"
  },
  "message": "Resume successfully processed and optimized for ATS"
}
```

### Error Responses

#### 400 - No File Uploaded
```json
{
  "success": false,
  "error": "No file uploaded. Please provide a resume file."
}
```

#### 400 - Insufficient Text Extracted
```json
{
  "success": false,
  "error": "Could not extract sufficient text from the resume. The file may be image-based or corrupted.",
  "extractedText": "",
  "meta": {
    "fileName": "resume.pdf",
    "textLength": 12,
    "isImageOnly": true
  }
}
```

#### 500 - Processing Error
```json
{
  "success": false,
  "error": "Failed to generate optimized resume",
  "warning": "Validation failed: missing critical fields",
  "extractedText": "...",
  "meta": {
    "fileName": "resume.pdf",
    "textLength": 1234
  }
}
```

---

## Data Schema

### ResumeJSON Structure

```typescript
interface ResumeJSON {
  name: string;
  profile_summary: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    website: string;
  };
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    soft_skills: string[];
  };
  education: Array<{
    institution: string;
    location: string;
    degree: string;
    start: string;
    end: string;
    details: string[];
  }>;
  experience: Array<{
    company: string;
    title: string;
    location: string;
    start: string;
    end: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    role: string;
    start: string;
    end: string;
    url: string;
    bullets: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  achievements: string[];
}
```

### ATS Score Structure

```typescript
interface ATSScore {
  skills_match_score: number; // 0-100
  experience_match_score: number; // 0-100
  education_match_score: number; // 0-100
  keyword_match_score: number; // 0-100
  certifications_score: number; // 0-100
  job_title_alignment_score: number; // 0-100
  overall_ats_score: number; // 0-100 (weighted average)
  explanation: string;
  improvement_suggestions: string;
}
```

---

## Processing Flow

```
1. File Upload
   ↓
2. Text Extraction (PDF/DOCX/DOC/TXT)
   ↓
3. Validation (minimum 50 characters)
   ↓
4. AI Processing (Groq/Llama 3.3 70B)
   ├── Generate optimized JSON structure
   └── Calculate ATS score (if job description provided)
   ↓
5. JSON Validation & Sanitization
   ↓
6. Response Generation
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
GROQ_APIKEY=your_groq_api_key_here
```

### Getting a Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Generate a new API key
5. Add it to your `.env` file

---

## Usage Examples

### Frontend Integration (React)

```jsx
import { useState } from 'react';

function ResumeUploader() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept=".pdf,.docx,.doc,.txt" required />
      <textarea name="jobDescription" placeholder="Paste job description (optional)" />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Upload Resume'}
      </button>

      {result?.success && (
        <div>
          <h2>ATS Score: {result.atsScore?.overall_ats_score}/100</h2>
          <pre>{JSON.stringify(result.optimizedResume, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}
```

---

## Key Improvements Made

### 1. **Enhanced Prompt Engineering**
- More specific instructions for JSON generation
- Added ATS optimization strategies
- Included validation checklist

### 2. **Robust Error Handling**
- Input validation at every step
- Detailed error messages for debugging
- Graceful fallbacks

### 3. **JSON Validation & Sanitization**
- Schema validation using TypeScript interfaces
- Automatic type coercion for missing fields
- Empty array/string defaults

### 4. **Improved AI Configuration**
- Lower temperature (0.3) for consistent structured output
- Increased max_tokens (4000) for complex resumes
- Better system prompts for reliability

### 5. **ATS Scoring Integration**
- Now properly integrated in the API flow
- Detailed scoring breakdown with explanations
- Actionable improvement suggestions

### 6. **Comprehensive Logging**
- Console logs for debugging
- Progress tracking at each step
- Error context preservation

---

## Testing the API

### Run Development Server

```bash
npm run dev
```

### Test with Sample Resume

```bash
curl -X POST http://localhost:3000/api/upload-resume \
  -F "file=@sample_resume.pdf" \
  -F "jobDescription=We are seeking a Full Stack Developer with experience in React and Node.js"
```

---

## Troubleshooting

### Issue: "Could not extract sufficient text"
- **Cause**: Image-based PDF or corrupted file
- **Solution**: Use text-based PDFs or DOCX files

### Issue: "Model returned empty content"
- **Cause**: Groq API key missing or invalid
- **Solution**: Check `.env` file and verify API key

### Issue: "Failed to extract valid JSON"
- **Cause**: AI model returned malformed JSON
- **Solution**: Check console logs for raw response, may need to adjust prompt

### Issue: Low ATS scores
- **Cause**: Resume doesn't match job description keywords
- **Solution**: Review `improvement_suggestions` field in response

---

## Files Modified/Created

| File | Status | Purpose |
|------|--------|---------|
| `utils/prompts.ts` | ✅ Enhanced | Improved prompt engineering with detailed instructions |
| `utils/generateResumetext.ts` | ✅ Enhanced | Better error handling, validation, and AI configuration |
| `utils/extractJsonFromModel.ts` | ✅ Enhanced | Improved logging and error messages |
| `utils/calculateAts.ts` | ✅ Enhanced | Better scoring logic and validation |
| `utils/validateResumeJson.ts` | ✅ Created | Schema validation and sanitization |
| `utils/main.ts` | ✅ Enhanced | Integrated validation pipeline |
| `app/api/upload-resume/route.ts` | ✅ Enhanced | Complete rewrite with ATS scoring integration |
| `API_DOCUMENTATION.md` | ✅ Created | This documentation file |

---

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
