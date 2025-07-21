import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/jobs - List all jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        interviews: {
          include: {
            candidate: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, department, location, isActive = true } = body;
    
    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }
    
    const job = await prisma.job.create({
      data: {
        title,
        description,
        department,
        location,
        isActive
      }
    });
    
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
