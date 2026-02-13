'use client';

import { useState, useRef } from 'react';
import type { ResumeJSON } from '@/utils/validateResumeJson';

interface PdfUploadProps {
  onResumeLoaded: (data: ResumeJSON) => void;
}

// Supported file types
const SUPPORTED_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
  'text/plain': '.txt',
};

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

export default function PdfUpload({ onResumeLoaded }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File): boolean => {
    // Check MIME type
    if (Object.keys(SUPPORTED_TYPES).includes(file.type)) {
      return true;
    }

    // Check extension as fallback
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(extension);
  };

  const getFileExtension = (file: File): string => {
    return '.' + file.name.split('.').pop()?.toLowerCase();
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!isValidFile(file)) {
      setError(`Unsupported file type. Please upload: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a resume file');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('jobDescription', jobDescription);

      setUploadProgress('Processing resume with AI...');

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed. Please try again.');
      }

      if (!data.optimizedResume) {
        throw new Error('No resume data returned. Please try a different file.');
      }

      setUploadProgress('Resume optimized successfully!');

      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500));

      onResumeLoaded(data.optimizedResume);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process resume. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* File Upload */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : selectedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-70 cursor-wait pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            {isUploading ? (
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <div className="text-6xl">
                {isDragging ? '📥' : '📄'}
              </div>
            )}
          </div>

          {/* Text */}
          {isUploading ? (
            <div>
              <p className="text-lg font-semibold text-blue-600">{uploadProgress}</p>
              <p className="text-sm text-gray-500 mt-2">Please wait, this may take a moment...</p>
            </div>
          ) : selectedFile ? (
            <div>
              <p className="text-lg font-semibold text-green-600">✓ {selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                File ready. Add job description below to optimize.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isDragging ? 'Drop your file here!' : 'Drop your resume here or click to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: <span className="font-medium">PDF, DOCX, DOC, TXT</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Job Description Input */}
      {selectedFile && !isUploading && (
        <div className="space-y-3">
          <label htmlFor="jobDescription" className="block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            Job Description (Optional but Recommended)
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to optimize your resume for this specific role..."
            className="w-full h-40 px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all"
            style={{
              background: 'var(--input)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          />
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Adding a job description helps optimize your resume with relevant keywords and skills
          </p>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full px-6 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--foreground)',
              color: 'var(--background)'
            }}
          >
            {isUploading ? 'Processing...' : 'Analyze & Optimize Resume'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-red-700">Upload Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Your resume will be processed by AI to extract and optimize the content
        </p>
      </div>
    </div>
  );
}
