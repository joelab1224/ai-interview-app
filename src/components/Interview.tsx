'use client';
import React, { useState, useEffect, useRef } from 'react';
import { UserData } from '../hooks/useAppState';
import { Question } from '../services/questionService';

interface InterviewProps {
  userData: UserData;
  questions: Question[];
}

const Interview = ({ userData, questions }: InterviewProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Initialize camera
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 }, 
            height: { ideal: 240 } 
          }, 
          audio: true 
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && currentQuestion) {
      // Save the response
      const newResponses = [...responses];
      newResponses[currentQuestionIndex] = message;
      setResponses(newResponses);
      
      console.log(`Response to question ${currentQuestionIndex + 1}:`, message);
      
      // Move to next question or finish interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Interview complete
        console.log('Interview completed. All responses:', newResponses);
        // TODO: Submit responses to backend
      }
      
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Video feed - positioned in top right corner */}
      <div className="absolute top-6 right-6 z-30">
        <div className="relative">
          <div className="w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {isRecording && (
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">REC</span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm rounded-full p-2">
            <button
              onClick={toggleRecording}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isRecording ? (
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              ) : (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 relative z-10">
        {/* Wave entity */}
        <div className="mb-8 relative">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Animated wave rings */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-300/30 animate-ping"></div>
            <div className="absolute inset-4 rounded-full border-2 border-blue-400/40 animate-ping delay-100"></div>
            <div className="absolute inset-8 rounded-full border-2 border-blue-500/50 animate-ping delay-200"></div>
            
            {/* Central wave entity */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-200 via-purple-300 to-pink-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question display */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-6">
            <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </span>
          </div>
          
          {currentQuestion ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {currentQuestion.question}
              </h1>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.type === 'technical' ? 'bg-blue-500/20 text-blue-300' :
                  currentQuestion.type === 'behavioral' ? 'bg-green-500/20 text-green-300' :
                  currentQuestion.type === 'situational' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-orange-500/20 text-orange-300'
                }`}>
                  {currentQuestion.type === 'technical' ? 'Técnica' :
                   currentQuestion.type === 'behavioral' ? 'Comportamental' :
                   currentQuestion.type === 'situational' ? 'Situacional' : 'Motivación'}
                </span>
                <span className="text-white/70 text-sm">
                  ~{currentQuestion.expectedDuration} minutos
                </span>
              </div>
              
              <p className="text-lg text-blue-100 leading-relaxed">
                Tómate tu tiempo para responder de manera completa y natural.
              </p>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                ¡Entrevista Completada!
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                Gracias por tu tiempo, {userData.firstName}. Tu entrevista ha sido procesada.
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + (currentQuestion ? 0 : 1)) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Status indicators */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">AI Lista</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">Grabando</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">Analizando</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat input section */}
      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            {/* Message input */}
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta aquí... (Presiona Enter para enviar)"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none min-h-[50px] max-h-24"
                rows={2}
              />
              <div className="absolute bottom-2 right-3 text-white/40 text-xs">
                {message.length}/500
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !currentQuestion}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>

            {/* Voice input button */}
            <button
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
