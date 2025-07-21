import { prisma } from '@/lib/db';
import JobCard from '@/components/JobCard';
import Link from 'next/link';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getJobs() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { interviews: true }
      }
    }
  });
  return jobs;
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white shadow-soft border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Oportunidades de Empleo
              </h1>
              <p className="text-gray-600 mt-2">
                Descubre tu próxima oportunidad profesional
              </p>
            </div>
            <Link 
              href="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors duration-200 shadow-soft"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-12 shadow-soft max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay empleos disponibles
              </h3>
              <p className="text-gray-600">
                Vuelve más tarde para ver nuevas oportunidades
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
