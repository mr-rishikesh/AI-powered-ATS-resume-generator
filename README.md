# 📄 Smart Resume Analyzer & ATS Optimizer

An intelligent resume optimization tool powered by AI that helps job seekers create ATS-friendly resumes and get detailed analysis of their resume's compatibility with Applicant Tracking Systems.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=flat-square)

## 🎯 What Does This Tool Do?

Getting past Applicant Tracking Systems (ATS) is one of the biggest challenges in modern job hunting. This tool helps you:

- **Optimize your resume** with AI to match specific job descriptions
- **Get detailed ATS scores** showing exactly how well your resume performs
- **Receive actionable suggestions** to improve your resume's compatibility
- **Edit and download** professionally formatted PDF resumes
- **Understand what recruiters see** when your resume goes through ATS filters

## ✨ Key Features

### 1. **AI-Powered Resume Optimization**
Upload your existing resume and paste a job description. Our AI (powered by Llama 3.3 70B) will automatically optimize your resume by:
- Matching keywords from the job description
- Restructuring content for better ATS readability
- Highlighting relevant skills and experiences
- Ensuring proper formatting and structure

### 2. **Comprehensive ATS Analysis**
Get a detailed breakdown of how well your resume performs across multiple dimensions:
- **Skills Match Score** - How well your skills align with job requirements
- **Experience Match Score** - Relevance of your work history
- **Education Match Score** - Academic qualifications alignment
- **Keyword Match Score** - Presence of important industry keywords
- **Certifications Score** - Value of your certifications
- **Job Title Alignment Score** - How well your titles match the role
- **Overall ATS Score** - Combined score out of 100

### 3. **Live Resume Editor**
- Real-time editing with instant preview
- Clean, professional interface
- Add/edit sections: Experience, Education, Skills, Projects, Certifications
- Download as professionally formatted PDF

### 4. **Smart Parsing**
Automatically extracts and structures information from:
- PDF files
- DOCX/DOC files
- Plain text files

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Groq API Key** (get it free from [Groq Console](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GROQ_APIKEY=your_groq_api_key_here
   ```

4. **Install Typst** (for PDF generation)

   - **Windows**: Download from [Typst Releases](https://github.com/typst/typst/releases)
   - **macOS**: `brew install typst`
   - **Linux**: `sudo snap install typst`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Option 1: Optimize Your Resume

Perfect for when you're applying to a specific job and want your resume tailored for it.

1. **Upload your resume** (PDF, DOCX, or TXT format)
2. **Paste the job description** you're applying for
3. **Click "Optimize Resume"**
4. You'll be redirected to the editor where you can:
   - Review the AI-optimized content
   - Make manual edits if needed
   - Preview your resume in real-time
   - Download as PDF when satisfied

### Option 2: Get ATS Analysis

Perfect for understanding how well your resume performs against ATS systems.

1. **Upload your resume**
2. **Paste the job description** you want to target
3. **Click "ATS Analyze by AI"**
4. You'll see a detailed analysis including:
   - Overall ATS score (0-100)
   - Breakdown by category (skills, experience, etc.)
   - Detailed explanation of your scores
   - Specific improvement suggestions
   - Visual score charts and progress bars

### Option 3: Direct Resume Editing

If you just want to use the editor without AI optimization:

1. Click **"Get Started"** in the header
2. Upload your resume
3. Edit directly in the resume editor
4. Download as PDF

## 🏗️ Project Structure

```
resume-analyzer/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Landing page with upload section
│   ├── resume-editor/            # Resume editing interface
│   │   └── page.tsx
│   ├── ats-analysis/             # ATS analysis results page
│   │   └── page.tsx
│   ├── components/               # React components
│   │   ├── PdfUpload.tsx         # File upload component
│   │   ├── ResumeEditor.tsx      # Resume editing component
│   │   ├── ResumePreview.tsx     # Live preview component
│   │   └── ATSScoreCard.tsx      # ATS score display (legacy)
│   └── api/                      # API routes
│       ├── upload-resume/        # Resume upload & optimization
│       ├── recalculate-ats/      # ATS score calculation
│       ├── generate-pdf/         # PDF generation
│       └── preview-pdf/          # PDF preview
├── utils/                        # Utility functions
│   ├── main.ts                   # Main resume generation logic
│   ├── calculateAts.ts           # ATS scoring with AI
│   ├── generateTypstFromJson.ts  # Convert JSON to Typst markup
│   ├── extractJsonFromModel.ts   # Parse AI responses
│   ├── validateResumeJson.ts     # Resume data validation
│   └── prompts.ts                # AI prompts
├── templates/
│   └── resume.typ                # Typst template for PDF
└── public/                       # Static assets
```

## 🧠 How It Works Behind the Scenes

### 1. Resume Upload & Text Extraction
When you upload a file:
- **PDF**: Uses `unpdf` library to extract text while preserving structure
- **DOCX/DOC**: Uses `mammoth` to convert to plain text
- **TXT**: Reads directly

### 2. AI Processing (Groq + Llama 3.3 70B)
The extracted text is sent to Groq's API with Llama 3.3 70B model:
- **Prompt engineering** guides the AI to understand resume structure
- **JSON parsing** extracts structured data (name, contact, experience, skills, etc.)
- **Job description context** (if provided) helps optimize content with relevant keywords

### 3. Resume Optimization
If a job description is provided:
- AI identifies key requirements and skills from the job posting
- Rephrases bullet points to highlight relevant experience
- Adds important keywords naturally throughout the resume
- Adjusts summary/objective to match the role

### 4. ATS Scoring
The AI analyzes your resume against the job description:
- Compares skills, experience, education, and certifications
- Calculates keyword density and relevance
- Evaluates job title alignment
- Provides weighted scores for each category
- Generates an overall compatibility score (0-100)

### 5. PDF Generation
Uses Typst (a modern typesetting system):
- Converts JSON resume data to Typst markup
- Applies professional formatting with minimal spacing
- Generates high-quality, ATS-friendly PDF
- Optimized to fit content on one page

## 🎨 Design Principles

This tool follows a clean, Vercel-inspired design system:
- **Minimalist UI** - No clutter, focus on content
- **Professional aesthetics** - Clean fonts (Geist Sans)
- **Responsive design** - Works on all screen sizes
- **Instant feedback** - Loading states and error messages
- **Accessible** - High contrast, readable fonts

## 🔧 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### Backend
- **Next.js API Routes** - Serverless functions
- **Groq SDK** - AI model access
- **Llama 3.3 70B Versatile** - Large language model

### Document Processing
- **unpdf** - PDF text extraction
- **mammoth** - DOCX conversion
- **Typst** - Professional PDF generation

## 📊 Understanding ATS Scores

Your ATS score is calculated based on multiple factors:

- **80-100**: Excellent - Your resume is highly optimized for ATS
- **60-79**: Good - Resume will likely pass ATS with some improvements
- **40-59**: Fair - Needs optimization to improve chances
- **0-39**: Needs Improvement - Significant changes required

### Score Breakdown

Each category is scored independently:

1. **Skills Match (30% weight)** - Programming languages, frameworks, tools mentioned
2. **Experience Match (30% weight)** - Relevance of job history and accomplishments
3. **Keyword Match (20% weight)** - Industry terms and job-specific keywords
4. **Education Match (10% weight)** - Degree requirements and academic background
5. **Certifications (5% weight)** - Professional certifications and licenses
6. **Job Title Alignment (5% weight)** - How well your titles match target role

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Known Issues & Limitations

- **PDF Image Content**: Cannot extract text from image-based PDFs (use text-searchable PDFs)
- **File Size Limit**: Maximum 10MB per upload
- **Language Support**: Currently optimized for English resumes
- **AI Variability**: AI responses may vary slightly between runs
- **Rate Limits**: Groq API has rate limits on free tier

## 💡 Tips for Best Results

1. **Use clear, text-based resumes** - Avoid fancy graphics or images
2. **Provide detailed job descriptions** - More context = better optimization
3. **Review AI suggestions** - AI is smart but not perfect, always review changes
4. **Keep formatting simple** - ATS systems prefer clean, straightforward layouts
5. **Use standard section headers** - "Experience", "Education", "Skills" are universally recognized
6. **Include relevant keywords** - But don't stuff - keep it natural
7. **Quantify achievements** - Use numbers and metrics where possible

## 🔮 Future Enhancements

Planned features for upcoming releases:
- Multi-language support
- Resume templates with different styles
- Browser extension for quick optimization
- LinkedIn profile import
- Cover letter generation
- Batch resume processing
- Resume version comparison
- Job posting scraper integration

## 📞 Support

Having issues? Here's how to get help:

1. Check the **Known Issues** section above
2. Search existing GitHub issues
3. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

## 🙏 Acknowledgments

- **Groq** for providing fast and reliable AI inference
- **Meta** for the Llama 3.3 model
- **Typst** team for the excellent typesetting system
- **Next.js** team for the amazing framework
- **Vercel** for design inspiration

---

**Built with ❤️ to help job seekers land their dream jobs**

*Remember: This tool helps optimize your resume, but your skills, experience, and personality are what truly make you stand out. Good luck with your job search! 🚀*
