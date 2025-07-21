import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/candidates - List all candidates
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        interviews: {
          include: {
            job: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST /api/candidates - Create new candidate with business logic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, jobPosition } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !jobPosition) {
      return NextResponse.json(
        { error: 'firstName, lastName, email, and jobPosition are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Business Logic: Check if candidate already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });
    
    if (existingCandidate) {
      // Return existing candidate instead of error for better UX
      return NextResponse.json({
        candidate: existingCandidate,
        message: 'Candidate already exists'
      }, { status: 200 });
    }
    
    // Business Logic: Find or create job based on jobPosition
    let job = await prisma.job.findFirst({
      where: {
        title: {
          contains: jobPosition,
          mode: 'insensitive'
        },
        isActive: true
      }
    });
    
    if (!job) {
      // Create new job if it doesn't exist
      job = await prisma.job.create({
        data: {
          title: jobPosition,
          description: `Position for ${jobPosition}`,
          isActive: true
        }
      });
    }
    
    // Create candidate
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email
      }
    });
    
    // Business Logic: Create initial interview session
    const interview = await prisma.interview.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        status: 'PENDING',
        scheduledAt: new Date()
      }
    });
    
    return NextResponse.json({
      candidate,
      job,
      interview,
      message: 'Candidate created successfully and interview session initiated'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}
