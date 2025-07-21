import React from 'react';
import { UserData } from '../hooks/useAppState';

interface ExplanationProps {
  userData: UserData;
  onContinue: () => void;
  isGeneratingQuestions?: boolean;
  questionError?: string | null;
}

const Explanation = ({ userData, onContinue, isGeneratingQuestions = false, questionError = null }: ExplanationProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col lg:flex-row justify-center items-center px-6 lg:px-12 py-12">
      {/* Left Side */}
      <div className="lg:w-1/2 lg:pr-16 mb-12 lg:mb-0 text-center lg:text-left max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
            📋 Guía de Preparación
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Hola {userData.firstName},
            <span className="text-blue-600 block">
              Preparación para la Entrevista AI
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
            Como candidato para la posición de <span className="font-semibold text-blue-700">{userData.jobPosition}</span>, siga estos pasos para tener una experiencia óptima durante su entrevista
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Conexión Estable</h3>
              <p className="text-gray-600">Asegúrese de tener una conexión a Internet estable y confiable para evitar interrupciones.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ambiente Tranquilo</h3>
              <p className="text-gray-600">Prepare un ambiente tranquilo y sin distracciones para poder concentrarse completamente.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Autenticidad</h3>
              <p className="text-gray-600">Sea usted mismo y responda con sinceridad. La autenticidad es valorada en el proceso.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Grabación de Video</h3>
              <p className="text-gray-600">Su video será grabado para análisis más detallado y evaluación posterior por nuestro sistema AI.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          {questionError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">Error al generar preguntas</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{questionError}</p>
            </div>
          )}
          
          <button 
            onClick={onContinue}
            disabled={isGeneratingQuestions}
            className={`relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              isGeneratingQuestions ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isGeneratingQuestions ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando preguntas...
              </>
            ) : (
              '→ Continuar'
            )}
          </button>
        </div>
      </div>
      
      {/* Right Side - Video Interface Mockup */}
      <div className="lg:w-1/2 max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-white text-sm font-medium">Entrevista AI - En Vivo</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-xs font-medium">REC</span>
              </div>
            </div>
          </div>
          
          {/* Video Area */}
          <div className="relative bg-gray-900 aspect-video">
            {/* Simulated video feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-80"></div>
            
            {/* Person silhouette */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-40 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-full opacity-60"></div>
            </div>
            
            {/* Video controls overlay */}
            <div className="absolute top-4 left-4">
              <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                00:45
              </div>
            </div>
            
            {/* AI Analysis indicators */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-green-500 bg-opacity-80 px-2 py-1 rounded text-white text-xs">
                ✓ Audio Claro
              </div>
              <div className="bg-blue-500 bg-opacity-80 px-2 py-1 rounded text-white text-xs">
                ✓ Video Óptimo
              </div>
              <div className="bg-purple-500 bg-opacity-80 px-2 py-1 rounded text-white text-xs">
                ⚡ Analizando...
              </div>
            </div>
          </div>
          
          {/* Bottom Controls */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600">Su video está siendo grabado</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Privacidad Garantizada</h4>
              <p className="text-blue-700 text-sm">Sus datos y grabaciones están protegidos con encriptación de extremo a extremo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explanation;

