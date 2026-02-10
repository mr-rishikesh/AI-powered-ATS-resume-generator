import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-xl text-gray-900">ATS Resume Optimizer</span>
          </div>
          <Link
            href="/resume-editor"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Optimize Your Resume for
            <span className="text-blue-600"> ATS Systems</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI analyze and optimize it for Applicant Tracking Systems.
            Get higher scores and land more interviews.
          </p>
          <div className="pt-6">
            <Link
              href="/resume-editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              <span>Analyze My Resume</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Advanced AI analyzes your resume content and provides intelligent suggestions for improvement.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Score Calculation</h3>
            <p className="text-gray-600">
              Get a detailed ATS compatibility score with specific recommendations to improve your chances.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Editor</h3>
            <p className="text-gray-600">
              Edit your resume in real-time with instant preview and download as a professional PDF.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
              <p className="text-gray-600 text-sm">Upload your existing resume in PDF, DOCX, or TXT format</p>
            </div>
            <div className="text-gray-300 text-3xl hidden md:block">→</div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">Our AI extracts and optimizes your resume content</p>
            </div>
            <div className="text-gray-300 text-3xl hidden md:block">→</div>
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Download PDF</h3>
              <p className="text-gray-600 text-sm">Edit and download your ATS-optimized resume</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Land More Interviews?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who have improved their resume with our AI-powered optimizer.
          </p>
          <Link
            href="/resume-editor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Start Optimizing Now
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>ATS Resume Analyzer & Optimizer - Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
