'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { UserData } from '../hooks/useAppState';

interface WelcomeProps {
  onSubmit: (userData: UserData) => void;
}

interface SelectedJob {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string;
}

const Welcome = ({ onSubmit }: WelcomeProps) => {
  const [selectedJob, setSelectedJob] = useState<SelectedJob | null>(null);
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    jobPosition: '',
  });

  useEffect(() => {
    // Read selected job from cookies
    const jobCookie = Cookies.get('selectedJob');
    if (jobCookie) {
      try {
        const job = JSON.parse(jobCookie);
        setSelectedJob(job);
        // Note: Job position field is intentionally left empty for user to fill
      } catch (error) {
        console.error('Error parsing job cookie:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col lg:flex-row justify-center items-center px-6 py-12 lg:px-12">
      {/* Left Side */}
      <div className="lg:w-1/2 lg:pr-16 mb-12 lg:mb-0 text-center lg:text-left max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
            ✨ Tecnología de Vanguardia
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            Bienvenido a la
            <span className="text-blue-600 block">
              Plataforma de Entrevistas AI
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
            Nuestra plataforma utiliza inteligencia artificial avanzada para ofrecer
            entrevistas precisas y efectivas, garantizando privacidad y seguridad
            en todo momento. Confíe en nosotros para mejorar su proceso de
            selección y contratación con tecnología de vanguardia.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Seguridad</h3>
              <p className="text-gray-600">Datos protegidos con encriptación</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Análisis IA</h3>
              <p className="text-gray-600">Evaluación inteligente automatizada</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resultados</h3>
              <p className="text-gray-600">Informes detallados y precisos</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side */}
      <div className="lg:w-1/2 max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {selectedJob ? 'Aplicar al Puesto' : 'Comenzar Entrevista'}
            </h2>
            <p className="text-blue-100 text-center mt-2">
              {selectedJob ? 'Complete sus datos para aplicar' : 'Complete sus datos para iniciar'}
            </p>
          </div>
          
          <div className="p-8">
            {selectedJob && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Aplicando para:</h3>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">{selectedJob.title}</p>
                  {selectedJob.department && (
                    <p className="text-blue-600">Departamento: {selectedJob.department}</p>
                  )}
                  {selectedJob.location && (
                    <p className="text-blue-600">Ubicación: {selectedJob.location}</p>
                  )}
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="Ingrese su nombre"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="Ingrese su apellido"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="jobPosition" className="block text-sm font-semibold text-gray-700 mb-2">
                  Posición de Trabajo *
                </label>
                <input
                  type="text"
                  id="jobPosition"
                  name="jobPosition"
                  value={formData.jobPosition}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 text-base bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400"
                  placeholder="Ej: Desarrollador Senior"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                → Iniciar Entrevista
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
              Al continuar, acepta nuestros 
              <a href="#" className="text-blue-600 hover:underline"> términos de servicio</a> y 
              <a href="#" className="text-blue-600 hover:underline"> política de privacidad</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

