'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ATSScore {
  skills_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  keyword_match_score: number;
  certifications_score: number;
  job_title_alignment_score: number;
  overall_ats_score: number;
  explanation: string;
  improvement_suggestions: string;
}

export default function ATSAnalysisPage() {
  const router = useRouter();
  const [atsData, setAtsData] = useState<ATSScore | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('atsAnalysis');
    if (data) {
      setAtsData(JSON.parse(data));
    } else {
      setShowError(true);
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (showError || !atsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Data</h1>
          <p className="text-gray-600 mb-6">Please upload a resume from the home page first.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const scores = [
    { label: 'Skills Match', value: atsData.skills_match_score, icon: '💼' },
    { label: 'Experience Match', value: atsData.experience_match_score, icon: '📊' },
    { label: 'Education Match', value: atsData.education_match_score, icon: '🎓' },
    { label: 'Keyword Match', value: atsData.keyword_match_score, icon: '🔑' },
    { label: 'Certifications', value: atsData.certifications_score, icon: '🏆' },
    { label: 'Job Title Alignment', value: atsData.job_title_alignment_score, icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <span className="font-bold text-xl text-gray-900">ATS Resume Optimizer</span>
          </Link>
          <Link href="/" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">ATS Analysis Results</h1>
          <p className="text-lg text-gray-600">Detailed breakdown of your resume compatibility</p>
        </div>

        {/* Overall Score */}
        <div className={`max-w-2xl mx-auto mb-12 rounded-3xl shadow-xl p-8 border-2 bg-linear-to-r ${getScoreGradient(atsData.overall_ats_score)}`}>
          <div className="text-center text-white">
            <p className="text-lg font-medium mb-2 opacity-90">Overall ATS Score</p>
            <div className="text-7xl font-bold mb-2">{atsData.overall_ats_score}</div>
            <p className="text-2xl font-semibold">out of 100</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {scores.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className={`text-3xl font-bold ${item.value >= 80 ? 'text-green-600' : item.value >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {item.value}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.label}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-linear-to-r ${getScoreGradient(item.value)}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">📝</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Explanation</h2>
              <p className="text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">{atsData.explanation}</p>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100 p-8">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Improvement Suggestions</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{atsData.improvement_suggestions}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105">
            Analyze Another Resume
          </Link>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
          >
            Print Report
          </button>
        </div>
      </main>
    </div>
  );
}
