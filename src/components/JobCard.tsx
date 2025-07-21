'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  description: string;
  department: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    interviews: number;
  };
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  const handleApply = () => {
    // Save selected job to cookies
    const selectedJob = {
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description
    };
    
    Cookies.set('selectedJob', JSON.stringify(selectedJob), { expires: 1 });
    
    // Navigate to welcome page
    router.push('/');
  };

  const getDepartmentColor = (department: string | null) => {
    switch (department?.toLowerCase()) {
      case 'tecnología':
        return 'bg-blue-100 text-blue-800';
      case 'diseño':
        return 'bg-purple-100 text-purple-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'ventas':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-shadow duration-300 p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          {job.department && (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(job.department)}`}>
              {job.department}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Location */}
      {job.location && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Publicado el {formatDate(job.createdAt)}</span>
            {job._count.interviews > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {job._count.interviews} aplicaciones
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Aplicar Ahora
          </span>
        </button>
      </div>
    </div>
  );
}
