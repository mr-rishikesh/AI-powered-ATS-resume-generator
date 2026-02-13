import type { ResumeJSON } from './validateResumeJson';

/**
 * Calculate ATS score for a resume
 * Scores based on various ATS-friendly factors
 */
export function calculateATSScore(resume: ResumeJSON, jobDescription?: string): number {
  let score = 0;
  const maxScore = 100;

  // 1. Contact Information (10 points)
  if (resume.contact?.email) score += 3;
  if (resume.contact?.phone) score += 3;
  if (resume.contact?.location) score += 2;
  if (resume.contact?.linkedin || resume.contact?.github) score += 2;

  // 2. Professional Summary (10 points)
  if (resume.profile_summary && resume.profile_summary.length > 50) {
    score += 10;
  } else if (resume.profile_summary) {
    score += 5;
  }

  // 3. Skills Section (20 points)
  const totalSkills =
    (resume.skills?.languages?.length || 0) +
    (resume.skills?.frameworks?.length || 0) +
    (resume.skills?.tools?.length || 0);

  if (totalSkills >= 10) score += 20;
  else if (totalSkills >= 5) score += 15;
  else if (totalSkills >= 3) score += 10;
  else if (totalSkills > 0) score += 5;

  // 4. Work Experience (25 points)
  const expCount = resume.experience?.length || 0;
  if (expCount >= 3) score += 15;
  else if (expCount >= 2) score += 12;
  else if (expCount >= 1) score += 8;

  // Check for bullet points in experience
  const hasBullets = resume.experience?.some(exp => exp.bullets && exp.bullets.length > 0);
  if (hasBullets) score += 10;

  // 5. Education (10 points)
  if (resume.education && resume.education.length > 0) {
    score += 10;
  }

  // 6. Projects (10 points)
  const projectCount = resume.projects?.length || 0;
  if (projectCount >= 2) score += 10;
  else if (projectCount === 1) score += 5;

  // 7. Certifications (5 points)
  if (resume.certifications && resume.certifications.length > 0) {
    score += 5;
  }

  // 8. Keyword Matching with Job Description (10 points)
  if (jobDescription) {
    const keywordScore = calculateKeywordMatch(resume, jobDescription);
    score += keywordScore;
  } else {
    score += 5; // Partial credit if no job description
  }

  // Ensure score doesn't exceed max
  return Math.min(score, maxScore);
}

/**
 * Calculate keyword match between resume and job description
 */
function calculateKeywordMatch(resume: ResumeJSON, jobDescription: string): number {
  const jdLower = jobDescription.toLowerCase();
  let matches = 0;
  const maxMatches = 10;

  // Extract all text from resume
  const resumeText = [
    resume.name,
    resume.profile_summary,
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || []),
    ...(resume.skills?.tools || []),
    ...(resume.experience?.flatMap(e => [e.company, e.title, ...(e.bullets || [])]) || []),
    ...(resume.education?.flatMap(e => [e.institution, e.degree]) || []),
  ].join(' ').toLowerCase();

  // Common important keywords to check
  const keywords = extractKeywords(jdLower);

  keywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matches++;
    }
  });

  // Calculate score (0-10 based on keyword matches)
  const score = Math.min((matches / keywords.length) * 10, maxMatches);
  return Math.round(score);
}

/**
 * Extract important keywords from job description
 */
function extractKeywords(text: string): string[] {
  // Remove common words
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'we', 'you', 'they', 'our', 'your', 'their'
  ]);

  // Split into words and filter
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word =>
      word.length > 3 &&
      !commonWords.has(word) &&
      !/^\d+$/.test(word)
    );

  // Get unique words
  const uniqueWords = Array.from(new Set(words));

  // Return top keywords (max 20)
  return uniqueWords.slice(0, 20);
}

/**
 * Get ATS score breakdown and recommendations
 */
export function getATSScoreBreakdown(resume: ResumeJSON, jobDescription?: string): {
  score: number;
  breakdown: { category: string; points: number; maxPoints: number; feedback: string }[];
  recommendations: string[];
} {
  const breakdown = [];
  const recommendations = [];

  // Contact Information
  let contactScore = 0;
  if (resume.contact?.email) contactScore += 3;
  if (resume.contact?.phone) contactScore += 3;
  if (resume.contact?.location) contactScore += 2;
  if (resume.contact?.linkedin || resume.contact?.github) contactScore += 2;

  breakdown.push({
    category: 'Contact Information',
    points: contactScore,
    maxPoints: 10,
    feedback: contactScore === 10 ? 'Complete' : 'Add missing contact details'
  });

  if (contactScore < 10) {
    if (!resume.contact?.email) recommendations.push('Add email address');
    if (!resume.contact?.phone) recommendations.push('Add phone number');
    if (!resume.contact?.linkedin && !resume.contact?.github) recommendations.push('Add LinkedIn or GitHub profile');
  }

  // Professional Summary
  let summaryScore = 0;
  if (resume.profile_summary && resume.profile_summary.length > 50) {
    summaryScore = 10;
  } else if (resume.profile_summary) {
    summaryScore = 5;
  }

  breakdown.push({
    category: 'Professional Summary',
    points: summaryScore,
    maxPoints: 10,
    feedback: summaryScore === 10 ? 'Strong summary' : 'Improve or add professional summary'
  });

  if (summaryScore < 10) {
    if (!resume.profile_summary) {
      recommendations.push('Add a professional summary highlighting your key achievements and expertise');
    } else {
      recommendations.push('Expand your professional summary to be more detailed (aim for 2-3 sentences)');
    }
  }

  const totalScore = calculateATSScore(resume, jobDescription);

  return {
    score: totalScore,
    breakdown,
    recommendations
  };
}
