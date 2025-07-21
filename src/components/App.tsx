'use client';
import React, { useState } from 'react';
import { useAppState, UserData } from '../hooks/useAppState';
import { Welcome } from './index';
import { Explanation } from './index';
import { Interview } from './index';
import { generateInterviewQuestions, Question } from '../services/questionService';

const App = () => {
  const { currentScreen, userData, saveUserData, navigateToScreen } = useAppState();
  const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const handleWelcomeSubmit = (formData: UserData) => {
    saveUserData(formData);
    navigateToScreen('explanation');
  };

  const handleExplanationContinue = async () => {
    setIsGeneratingQuestions(true);
    setQuestionError(null);
    
    try {
      const response = await generateInterviewQuestions();
      setInterviewQuestions(response.questions);
      navigateToScreen('interview');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      setQuestionError(error instanceof Error ? error.message : 'Failed to generate interview questions');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onSubmit={handleWelcomeSubmit} />;
      case 'explanation':
        return userData ? (
          <Explanation 
            userData={userData} 
            onContinue={handleExplanationContinue}
            isGeneratingQuestions={isGeneratingQuestions}
            questionError={questionError}
          />
        ) : (
          <Welcome onSubmit={handleWelcomeSubmit} />
        );
      case 'interview':
        return userData && interviewQuestions.length > 0 ? (
          <Interview userData={userData} questions={interviewQuestions} />
        ) : (
          <Welcome onSubmit={handleWelcomeSubmit} />
        );
      default:
        return <Welcome onSubmit={handleWelcomeSubmit} />;
    }
  };

  return <>{renderCurrentScreen()}</>;
};

export default App;
