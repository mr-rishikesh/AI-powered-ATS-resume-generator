'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { ResumeJSON } from '@/utils/validateResumeJson';

interface ResumePreviewProps {
  resumeData: ResumeJSON;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Track the current object URL for cleanup
  const currentUrlRef = useRef<string | null>(null);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Abort controller for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function for object URLs
  const cleanupUrl = useCallback(() => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  // Generate PDF preview
  const generatePdfPreview = useCallback(async (data: ResumeJSON) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/preview-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optimizedResume: data }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate PDF preview';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response might not be JSON
        }
        throw new Error(errorMessage);
      }

      // Get PDF blob
      const pdfBlob = await response.blob();

      // Validate blob
      if (pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      // Cleanup old URL before creating new one
      cleanupUrl();

      // Create new object URL
      const newUrl = URL.createObjectURL(pdfBlob);
      currentUrlRef.current = newUrl;
      setPdfUrl(newUrl);
      setRetryCount(0);

    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return;
      }

      console.error('❌ PDF preview error:', err);
      setError(err.message || 'Failed to generate PDF preview');

    } finally {
      setLoading(false);
    }
  }, [cleanupUrl]);

  // Debounced effect for generating preview
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounced timer (500ms delay)
    debounceTimerRef.current = setTimeout(() => {
      generatePdfPreview(resumeData);
    }, 500);

    // Cleanup on unmount or before next effect
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [resumeData, generatePdfPreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupUrl();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cleanupUrl]);

  // Retry handler
  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      generatePdfPreview(resumeData);
    }
  }, [retryCount, generatePdfPreview, resumeData]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '842px' }}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Generating preview...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center p-8" style={{ minHeight: '842px' }}>
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Error</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          {retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again ({3 - retryCount} attempts left)
            </button>
          )}
        </div>
      </div>
    );
  }

  // No PDF yet state
  if (!pdfUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '842px' }}>
        <div className="text-center p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Success state - show PDF
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium">Resume Preview</span>
        <span className="text-xs text-gray-400">PDF Document</span>
      </div>
      <div className="relative" style={{ height: '842px' }}>
        <iframe
          src={pdfUrl}
          title="Resume Preview"
          className="w-full h-full border-0"
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>
    </div>
  );
}
