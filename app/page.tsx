'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleOptimize = async () => {
    if (!selectedFile) {
      setError('Please upload a resume');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('jobDescription', jobDescription);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('resumeData', JSON.stringify(data.optimizedResume));
        router.push('/resume-editor');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to process resume');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleATSAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload a resume');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please add job description for ATS analysis');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        setError(uploadData.error);
        return;
      }

      const atsRes = await fetch('/api/recalculate-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: uploadData.extractedText,
          jobDescription
        })
      });

      const atsData = await atsRes.json();
      if (atsData.success) {
        sessionStorage.setItem('atsAnalysis', JSON.stringify(atsData.atsScore));
        router.push('/ats-analysis');
      } else {
        setError(atsData.error);
      }
    } catch (err) {
      setError('Failed to analyze resume');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-xl text-gray-900">ATS Resume Optimizer</span>
          </div>
          <Link href="/resume-editor" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Optimize Your Resume for <span className="text-blue-600">ATS Systems</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let our AI analyze and optimize it for Applicant Tracking Systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">Advanced AI analyzes your resume content and provides intelligent suggestions.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Score Calculation</h3>
            <p className="text-gray-600">Get a detailed ATS compatibility score with specific recommendations.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Editor</h3>
            <p className="text-gray-600">Edit your resume in real-time with instant preview and PDF download.</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upload Your Resume</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-all"
            >
              {selectedFile ? (
                <div>
                  <p className="text-lg font-semibold text-green-600">✓ {selectedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-2">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-700">Drop resume or click to upload</p>
                  <p className="text-sm text-gray-500 mt-2">PDF, DOCX, DOC, TXT (Max 10MB)</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to optimize your resume..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">Adding a job description helps optimize your resume with relevant keywords</p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleOptimize}
                disabled={isProcessing}
                className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : '🚀 Optimize Resume'}
              </button>
              <button
                onClick={handleATSAnalyze}
                disabled={isProcessing}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : '📊 ATS Analyze by AI'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>ATS Resume Analyzer & Optimizer - Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
