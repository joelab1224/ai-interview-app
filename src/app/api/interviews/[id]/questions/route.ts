import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/interviews/[id]/questions - Create questions for interview
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = params.id;
    const body = await request.json();
    const { jobPosition, candidateName } = body;
    
    // Validate interview exists
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        job: true
      }
    });
    
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }
    
    // Business Logic: Generate AI-powered questions based on job position
    const questions = await generateInterviewQuestions(
      interview.job.title,
      interview.candidate.firstName + ' ' + interview.candidate.lastName
    );
    
    // Create questions in database
    const createdQuestions = await Promise.all(
      questions.map((question, index) =>
        prisma.interviewQuestion.create({
          data: {
            question,
            interviewId,
            order: index + 1
          }
        })
      )
    );
    
    // Business Logic: Update interview status to IN_PROGRESS
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });
    
    return NextResponse.json({
      questions: createdQuestions,
      message: 'Interview questions generated and interview started'
    });
  } catch (error) {
    console.error('Error creating interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to create interview questions' },
      { status: 500 }
    );
  }
}

// GET /api/interviews/[id]/questions - Get questions for interview
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = params.id;
    
    const questions = await prisma.interviewQuestion.findMany({
      where: { interviewId },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview questions' },
      { status: 500 }
    );
  }
}

// Business Logic: Generate interview questions based on job position
async function generateInterviewQuestions(jobTitle: string, candidateName: string): Promise<string[]> {
  // This is a simplified version - in production, you'd use OpenAI API or similar
  const baseQuestions = [
    `Hola ${candidateName}, cuéntame un poco sobre ti y tu experiencia profesional.`,
    `¿Qué te motiva a aplicar para la posición de ${jobTitle}?`,
    `Describe una situación desafiante que hayas enfrentado en tu trabajo anterior y cómo la resolviste.`,
    `¿Cuáles consideras que son tus principales fortalezas para este rol?`,
    `¿Dónde te ves profesionalmente en los próximos 5 años?`
  ];
  
  // Add job-specific questions based on position
  const jobSpecificQuestions = generateJobSpecificQuestions(jobTitle);
  
  return [...baseQuestions, ...jobSpecificQuestions];
}

// Generate job-specific questions based on position
function generateJobSpecificQuestions(jobTitle: string): string[] {
  const lowerJobTitle = jobTitle.toLowerCase();
  
  if (lowerJobTitle.includes('developer') || lowerJobTitle.includes('programador')) {
    return [
      '¿Cuáles son tus lenguajes de programación favoritos y por qué?',
      'Describe tu experiencia con metodologías ágiles como Scrum o Kanban.',
      '¿Cómo te mantienes actualizado con las nuevas tecnologías?'
    ];
  } else if (lowerJobTitle.includes('design') || lowerJobTitle.includes('diseñador')) {
    return [
      '¿Cuál es tu proceso de diseño desde la conceptualización hasta la implementación?',
      'Describe un proyecto de diseño del que te sientas especialmente orgulloso.',
      '¿Cómo incorporas la experiencia del usuario en tus diseños?'
    ];
  } else if (lowerJobTitle.includes('marketing')) {
    return [
      '¿Cuál ha sido tu campaña de marketing más exitosa?',
      '¿Cómo mides el éxito de una estrategia de marketing?',
      '¿Qué herramientas de marketing digital utilizas regularmente?'
    ];
  } else if (lowerJobTitle.includes('sales') || lowerJobTitle.includes('ventas')) {
    return [
      '¿Cuál es tu estrategia para generar nuevos clientes?',
      'Describe una venta difícil que hayas logrado cerrar.',
      '¿Cómo manejas las objeciones de los clientes?'
    ];
  }
  
  // Default questions for other positions
  return [
    '¿Qué habilidades técnicas consideras más importantes para este puesto?',
    '¿Cómo te adaptas a los cambios en el entorno de trabajo?',
    '¿Qué preguntas tienes sobre la empresa o el puesto?'
  ];
}
