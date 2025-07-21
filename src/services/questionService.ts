import Cookies from 'js-cookie';

export interface Question {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'motivation';
  expectedDuration: number;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  questions: Question[];
  userData: Record<string, string>;
  jobData: Record<string, string>;
}

export const generateInterviewQuestions = async (): Promise<GenerateQuestionsResponse> => {
  try {
    // Get user data from cookies (stored by useAppState)
    const userDataString = Cookies.get('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    // Get job data from cookies
    const jobDataString = Cookies.get('selectedJob');
    const jobData = jobDataString ? JSON.parse(jobDataString) : null;

    // Debug logging
    console.log('User data from cookies:', userDataString);
    console.log('Parsed user data:', userData);
    console.log('Job data from cookies:', jobDataString);
    console.log('Parsed job data:', jobData);

    if (!userData) {
      throw new Error('No user data found. Please complete the welcome form first.');
    }

    if (!jobData) {
      throw new Error('No job data found. Please select a job position first.');
    }

    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData,
        jobData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate questions');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw error;
  }
};
