'use client';

import { useState, useEffect } from 'react';
import PdfUpload from '../components/PdfUpload';
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import type { ResumeJSON } from '@/utils/validateResumeJson';

export default function ResumeEditorPage() {
  const [resumeData, setResumeData] = useState<ResumeJSON | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem('resumeData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
      sessionStorage.removeItem('resumeData');
    }
  }, []);

  const handleResumeLoaded = (data: ResumeJSON) => {
    setResumeData(data);
  };

  const handleResumeUpdate = (updatedData: ResumeJSON) => {
    setResumeData(updatedData);
  };

  const handleDownloadPdf = async () => {
    if (!resumeData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizedResume: resumeData }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--background)' }}>
      {/* Header - Vercel Style */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'var(--border)'
              }}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg"
                 style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
              R
            </div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Resume Editor
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Download Button */}
            {resumeData && (
              <button
                onClick={handleDownloadPdf}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background: 'var(--foreground)',
                  color: 'var(--background)'
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {!resumeData ? (
          <div className="max-w-2xl mx-auto pt-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                Upload Your Resume
              </h2>
              <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                Get started by uploading your resume in PDF, DOCX, or TXT format
              </p>
            </div>
            <PdfUpload onResumeLoaded={handleResumeLoaded} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Editor and Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel: Editor */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md"
                     style={{
                       background: 'var(--card)',
                       borderColor: 'var(--border)'
                     }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--muted-foreground)' }}>
                      Editor
                    </h3>
                  </div>
                  <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <ResumeEditor
                      resumeData={resumeData}
                      onUpdate={handleResumeUpdate}
                    />
                  </div>
                </div>
              </div>

              {/* Right Panel: Preview */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md"
                     style={{
                       background: 'var(--card)',
                       borderColor: 'var(--border)'
                     }}>
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--muted-foreground)' }}>
                      Preview
                    </h3>
                  </div>
                  <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <ResumePreview resumeData={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
