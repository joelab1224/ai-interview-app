import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/interviews/[id]/save - Save interview data after completion
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = params.id;
    const body = await request.json();
    const { answers, videoUrl, duration } = body;
    
    // Validate interview exists
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        job: true,
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // Business Logic: Validate answers array matches questions
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be provided as an array' },
        { status: 400 }
      );
    }
    
    if (answers.length !== interview.questions.length) {
      return NextResponse.json(
        { error: 'Number of answers must match number of questions' },
        { status: 400 }
      );
    }
    
    // Business Logic: Update questions with answers
    await Promise.all(
      answers.map((answer, index) => {
        const question = interview.questions[index];
        if (question) {
          return prisma.interviewQuestion.update({
            where: { id: question.id },
            data: { answer: answer || '' }
          });
        }
      })
    );
    
    // Business Logic: Calculate preliminary score based on answers
    const preliminaryScore = calculatePreliminaryScore(answers, interview.job.title);
    
    // Business Logic: Update interview status and completion data
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        videoUrl: videoUrl || null,
        score: preliminaryScore,
        feedback: generateInitialFeedback(answers, interview.job.title)
      },
      include: {
        candidate: true,
        job: true,
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    // Business Logic: Log interview completion for analytics
    await logInterviewCompletion(interviewId, duration, preliminaryScore);
    
    return NextResponse.json({
      interview: updatedInterview,
      message: 'Interview saved successfully',
      preliminaryScore,
      nextStep: 'summary_generation'
    });
  } catch (error) {
    console.error('Error saving interview:', error);
    return NextResponse.json(
      { error: 'Failed to save interview' },
      { status: 500 }
    );
  }
}

// Business Logic: Calculate preliminary score based on answers
function calculatePreliminaryScore(answers: string[], jobTitle: string): number {
  let score = 0;
  let totalPossibleScore = 0;
  
  answers.forEach((answer, index) => {
    if (answer && answer.trim().length > 0) {
      // Basic scoring logic - in production, use AI/ML for better scoring
      const wordCount = answer.trim().split(' ').length;
      const answerScore = Math.min(wordCount / 20, 1) * 10; // Max 10 points per answer
      
      // Apply different weights based on question type
      if (index === 0) { // Introduction question
        score += answerScore * 0.8;
      } else if (index === 1) { // Motivation question
        score += answerScore * 1.2;
      } else if (index === 2) { // Problem-solving question
        score += answerScore * 1.5;
      } else {
        score += answerScore;
      }
    }
    totalPossibleScore += 10;
  });
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min((score / totalPossibleScore) * 100, 100);
  
  // Apply job-specific adjustments
  return applyJobSpecificScoring(normalizedScore, jobTitle, answers);
}

// Apply job-specific scoring adjustments
function applyJobSpecificScoring(baseScore: number, jobTitle: string, answers: string[]): number {
  const lowerJobTitle = jobTitle.toLowerCase();
  let adjustedScore = baseScore;
  
  // Look for job-specific keywords in answers
  const allAnswers = answers.join(' ').toLowerCase();
  
  if (lowerJobTitle.includes('developer') || lowerJobTitle.includes('programador')) {
    // Look for technical keywords
    const techKeywords = ['javascript', 'python', 'react', 'node', 'database', 'api', 'git', 'agile'];
    const techMentions = techKeywords.filter(keyword => allAnswers.includes(keyword)).length;
    adjustedScore += techMentions * 2;
  } else if (lowerJobTitle.includes('design') || lowerJobTitle.includes('diseñador')) {
    // Look for design keywords
    const designKeywords = ['user experience', 'ux', 'ui', 'figma', 'sketch', 'photoshop', 'prototype'];
    const designMentions = designKeywords.filter(keyword => allAnswers.includes(keyword)).length;
    adjustedScore += designMentions * 2;
  } else if (lowerJobTitle.includes('marketing')) {
    // Look for marketing keywords
    const marketingKeywords = ['campaign', 'social media', 'analytics', 'conversion', 'brand', 'strategy'];
    const marketingMentions = marketingKeywords.filter(keyword => allAnswers.includes(keyword)).length;
    adjustedScore += marketingMentions * 2;
  }
  
  return Math.min(adjustedScore, 100);
}

// Generate initial feedback based on answers
function generateInitialFeedback(answers: string[], jobTitle: string): string {
  const answerLengths = answers.map(answer => answer?.trim().split(' ').length || 0);
  const avgAnswerLength = answerLengths.reduce((a, b) => a + b, 0) / answerLengths.length;
  
  let feedback = 'Entrevista completada exitosamente. ';\n  
  if (avgAnswerLength > 30) {\n    feedback += 'Las respuestas fueron detalladas y bien estructuradas. ';\n  } else if (avgAnswerLength > 15) {\n    feedback += 'Las respuestas fueron adecuadas con un buen nivel de detalle. ';\n  } else {\n    feedback += 'Las respuestas podrían haberse beneficiado de más detalle. ';\n  }\n  \n  // Add job-specific feedback\n  const lowerJobTitle = jobTitle.toLowerCase();\n  if (lowerJobTitle.includes('developer')) {\n    feedback += 'Se recomienda revisar las competencias técnicas mencionadas. ';\n  } else if (lowerJobTitle.includes('design')) {\n    feedback += 'Se valoró la experiencia en diseño y herramientas mencionadas. ';\n  }\n  \n  feedback += 'Un análisis más detallado será generado próximamente.';\n  return feedback;\n}\n\n// Log interview completion for analytics\nasync function logInterviewCompletion(interviewId: string, duration: number, score: number) {\n  // In production, you might want to log this to a separate analytics service\n  console.log(`Interview ${interviewId} completed:`, {\n    duration: duration || 'unknown',\n    score: score.toFixed(2),\n    timestamp: new Date().toISOString()\n  });\n  \n  // Could integrate with analytics services like Mixpanel, Amplitude, etc.\n}
