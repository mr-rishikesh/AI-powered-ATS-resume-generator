'use client';

import { useState } from 'react';
import PdfUpload from '../components/PdfUpload';
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import type { ResumeJSON } from '@/utils/validateResumeJson';

export default function ResumeEditorPage() {
  const [resumeData, setResumeData] = useState<ResumeJSON | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ATS Resume Editor</h1>
          {resumeData && (
            <button
              onClick={handleDownloadPdf}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Generating...' : 'Download Resume'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        {!resumeData ? (
          <div className="max-w-2xl mx-auto">
            <PdfUpload onResumeLoaded={handleResumeLoaded} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Panel: Editor */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                <ResumeEditor
                  resumeData={resumeData}
                  onUpdate={handleResumeUpdate}
                />
              </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
