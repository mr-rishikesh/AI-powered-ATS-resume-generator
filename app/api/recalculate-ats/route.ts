import '../../../envConfig';
import { NextResponse } from 'next/server';
import { generateATSScore } from '@/utils/calculateAts';

/**
 * POST /api/recalculate-ats
 *
 * Recalculates ATS score using AI when initial calculation failed
 *
 * Expected JSON body:
 * - resumeText: Resume text (before or after optimization)
 * - jobDescription: Job description for comparison
 */
export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    // Validate inputs
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid resume text provided'
        },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description is required for ATS scoring'
        },
        { status: 400 }
      );
    }

    console.log('🔄 Recalculating ATS score...');

    // Calculate ATS score using AI
    const scoreResult = await generateATSScore(resumeText, jobDescription);

    if (scoreResult.success && scoreResult.parsed?.overall_ats_score) {
      console.log(`✅ ATS Score recalculated: ${scoreResult.parsed.overall_ats_score}`);
      return NextResponse.json({
        success: true,
        score: scoreResult.parsed.overall_ats_score,
        atsScore: scoreResult.parsed,
        message: 'ATS score calculated successfully'
      });
    } else {
      throw new Error(scoreResult.error || 'Failed to calculate ATS score');
    }

  } catch (err: any) {
    console.error('❌ ATS recalculation error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Failed to calculate ATS score. Please try again.',
        details: err?.message
      },
      { status: 500 }
    );
  }
}
