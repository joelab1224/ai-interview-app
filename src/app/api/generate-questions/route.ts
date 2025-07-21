import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize AWS Bedrock Runtime client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('Received request body:', JSON.stringify(requestBody, null, 2));
    
    let userData, jobData;
    
    // Check if the data is already nested properly
    if (requestBody.userData && requestBody.jobData) {
      userData = requestBody.userData;
      jobData = requestBody.jobData;
    } else {
      // Handle flattened structure - extract userData and jobData from the flat structure
      userData = {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        jobPosition: requestBody.jobPosition
      };
      
      jobData = {
        id: requestBody.id || requestBody.jobData?.id,
        title: requestBody.title || requestBody.jobData?.title,
        department: requestBody.department || requestBody.jobData?.department,
        location: requestBody.location || requestBody.jobData?.location,
        description: requestBody.description || requestBody.jobData?.description
      };
    }
    
    console.log('Processed userData:', userData);
    console.log('Processed jobData:', jobData);

    if (!userData || !userData.firstName || !userData.lastName || !userData.email) {
      return NextResponse.json(
        { error: 'User data (firstName, lastName, email) is required' },
        { status: 400 }
      );
    }
    
    if (!jobData || !jobData.title || !jobData.description) {
      return NextResponse.json(
        { error: 'Job data (title, description) is required' },
        { status: 400 }
      );
    }

    // Create the prompt for Claude Sonnet 3.5
    const prompt = `
You are an expert HR interviewer tasked with creating comprehensive interview questions for a job position. Based on the following information, generate exactly 5 holistic and comprehensive interview questions that will thoroughly evaluate the candidate's suitability for the role.

Job Information:
- Position: ${jobData.title}
- Department: ${jobData.department || 'Not specified'}
- Location: ${jobData.location || 'Not specified'}
- Job Description: ${jobData.description}

Candidate Information:
- Name: ${userData.firstName} ${userData.lastName}
- Email: ${userData.email}
- Applied Position: ${userData.jobPosition}

Please create 5 interview questions that:
1. Are specific to the role and department
2. Evaluate both technical and soft skills
3. Include behavioral questions
4. Test problem-solving abilities
5. Assess cultural fit and motivation

Format your response as a JSON array with each question as an object containing:
- "id": A unique identifier (1-5)
- "question": The interview question
- "type": The type of question (e.g., "technical", "behavioral", "situational", "motivation")
- "expectedDuration": Expected time to answer in minutes

Example format:
[
  {
    "id": 1,
    "question": "Your question here",
    "type": "technical",
    "expectedDuration": 3
  }
]

Return only the JSON array, no additional text.`;

    // Prepare the request body for Claude Sonnet 3.5
    const claudeRequestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 0.9
    };

    // Make the request to AWS Bedrock
    const command = new InvokeModelCommand({
      modelId: 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(claudeRequestBody)
    });

    const response = await bedrockClient.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedContent = responseBody.content[0].text;

    // Parse the JSON response from Claude
    let questions;
    try {
      questions = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse generated questions' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!Array.isArray(questions) || questions.length !== 5) {
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: questions,
      userData: userData,
      jobData: jobData
    });

  } catch (error) {
    console.error('Error generating interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview questions' },
      { status: 500 }
    );
  }
}
