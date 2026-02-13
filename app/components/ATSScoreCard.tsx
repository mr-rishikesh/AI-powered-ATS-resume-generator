'use client';

import { useState } from 'react';

interface ATSScoreCardProps {
  beforeScore: number;
  afterScore: number;
  scoringFailed?: boolean;
  scoringError?: string;
  resumeTextBefore?: string;
  resumeTextAfter?: string;
  jobDescription?: string;
  onScoresUpdated?: (before: number, after: number) => void;
}

export default function ATSScoreCard({
  beforeScore,
  afterScore,
  scoringFailed = false,
  scoringError,
  resumeTextBefore,
  resumeTextAfter,
  jobDescription,
  onScoresUpdated
}: ATSScoreCardProps) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateError, setRecalculateError] = useState<string | null>(null);
  const [localBeforeScore, setLocalBeforeScore] = useState(beforeScore);
  const [localAfterScore, setLocalAfterScore] = useState(afterScore);

  const improvement = localAfterScore - localBeforeScore;
  const improvementPercentage = localBeforeScore > 0 ? Math.round((improvement / localBeforeScore) * 100) : 0;

  const handleRecalculate = async () => {
    if (!resumeTextBefore || !resumeTextAfter || !jobDescription) {
      setRecalculateError('Missing required data for recalculation');
      return;
    }

    setIsRecalculating(true);
    setRecalculateError(null);

    try {
      // Recalculate both before and after scores in parallel
      const [beforeResult, afterResult] = await Promise.all([
        fetch('/api/recalculate-ats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: resumeTextBefore,
            jobDescription
          })
        }),
        fetch('/api/recalculate-ats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: resumeTextAfter,
            jobDescription
          })
        })
      ]);

      const beforeData = await beforeResult.json();
      const afterData = await afterResult.json();

      if (beforeData.success && afterData.success) {
        setLocalBeforeScore(beforeData.score);
        setLocalAfterScore(afterData.score);
        if (onScoresUpdated) {
          onScoresUpdated(beforeData.score, afterData.score);
        }
      } else {
        throw new Error(beforeData.error || afterData.error || 'Failed to recalculate scores');
      }
    } catch (err: any) {
      console.error('Recalculation error:', err);
      setRecalculateError(err.message || 'Failed to recalculate. Please try again.');
    } finally {
      setIsRecalculating(false);
    }
  };

  // Show error state with recalculate button if scoring failed
  if (scoringFailed) {
    return (
      <div className="rounded-xl border p-6 space-y-4"
           style={{
             background: 'var(--card)',
             borderColor: 'var(--border)'
           }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
              ATS Score Calculation Failed
            </h3>
            <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
              {scoringError || 'Unable to calculate ATS score. This may be due to a temporary network issue.'}
            </p>
            {recalculateError && (
              <p className="text-sm mb-3" style={{ color: '#ef4444' }}>
                {recalculateError}
              </p>
            )}
            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: 'var(--foreground)',
                color: 'var(--background)'
              }}
            >
              {isRecalculating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Recalculating...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                  <span>Recalculate ATS Score</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't show the card if both scores are 0 and scoring didn't fail
  if (localBeforeScore === 0 && localAfterScore === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score === 0) return 'Not Scored';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="rounded-xl border p-6 space-y-6"
         style={{
           background: 'var(--card)',
           borderColor: 'var(--border)'
         }}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
          ATS Score Analysis
        </h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Your resume's compatibility with Applicant Tracking Systems
        </p>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {/* Before Score */}
        <div className="text-center p-4 rounded-lg"
             style={{ background: 'var(--muted)' }}>
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Before Optimization
          </div>
          <div className="text-4xl font-bold mb-1"
               style={{ color: getScoreColor(localBeforeScore) }}>
            {localBeforeScore}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {getScoreLabel(localBeforeScore)}
          </div>
        </div>

        {/* After Score */}
        <div className="text-center p-4 rounded-lg"
             style={{ background: 'var(--muted)' }}>
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
            After Optimization
          </div>
          <div className="text-4xl font-bold mb-1"
               style={{ color: getScoreColor(localAfterScore) }}>
            {localAfterScore}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {getScoreLabel(localAfterScore)}
          </div>
        </div>
      </div>

      {/* Improvement Badge */}
      {improvement > 0 && (
        <div className="text-center p-3 rounded-lg"
             style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
          <div className="flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span className="font-semibold" style={{ color: '#22c55e' }}>
              +{improvement} points ({improvementPercentage > 0 ? '+' : ''}{improvementPercentage}% improvement)
            </span>
          </div>
        </div>
      )}

      {/* Score Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span>Score Progress</span>
          <span>{localAfterScore}/100</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${localAfterScore}%`,
              background: getScoreColor(localAfterScore)
            }}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs space-y-1" style={{ color: 'var(--muted-foreground)' }}>
        <p>💡 <strong>Tip:</strong> Scores above 80 have the best chance of passing ATS filters</p>
        {localAfterScore < 80 && (
          <p>🎯 Keep editing to reach the {localAfterScore < 60 ? '60+' : '80+'} target score</p>
        )}
      </div>
    </div>
  );
}
