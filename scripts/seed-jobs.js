const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleJobs = [
  {
    title: "Desarrollador Frontend React",
    description: "Buscamos un desarrollador frontend con experiencia en React, TypeScript y Tailwind CSS. Trabajarás en proyectos innovadores creando interfaces de usuario modernas y responsivas.",
    department: "Tecnología",
    location: "Madrid, España (Remoto disponible)",
    isActive: true
  },
  {
    title: "Diseñador UX/UI",
    description: "Únete a nuestro equipo de diseño para crear experiencias digitales excepcionales. Experiencia en Figma, prototipado y design systems es fundamental.",
    department: "Diseño",
    location: "Barcelona, España (Híbrido)",
    isActive: true
  },
  {
    title: "Especialista en Marketing Digital",
    description: "Gestiona campañas de marketing digital, SEO/SEM, redes sociales y analytics. Experiencia en Google Ads, Facebook Ads y herramientas de análisis.",
    department: "Marketing",
    location: "Valencia, España (Presencial)",
    isActive: true
  },
  {
    title: "Desarrollador Backend Node.js",
    description: "Desarrolla APIs robustas y escalables usando Node.js, PostgreSQL y AWS. Experiencia en microservicios y arquitecturas cloud es valorada.",
    department: "Tecnología",
    location: "Sevilla, España (Remoto disponible)",
    isActive: true
  },
  {
    title: "Gerente de Ventas",
    description: "Lidera el equipo de ventas para alcanzar objetivos comerciales. Experiencia en B2B, CRM y estrategias de crecimiento empresarial.",
    department: "Ventas",
    location: "Madrid, España (Presencial)",
    isActive: true
  }
];

async function seedJobs() {
  try {
    console.log('🌱 Starting to seed jobs table...');
    
    // Clear existing jobs (optional)
    await prisma.job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');
    
    // Create sample jobs
    const createdJobs = await prisma.job.createMany({
      data: sampleJobs
    });
    
    console.log(`✅ Successfully created ${createdJobs.count} sample jobs`);
    
    // Fetch and display created jobs
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n📋 Created jobs:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.department} (${job.location})`);
    });
    
    console.log('\n🎉 Job seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedJobs();
