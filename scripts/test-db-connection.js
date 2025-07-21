const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database version:', result[0].version);
    
    // Test table creation by counting tables
    const candidates = await prisma.candidate.findMany();
    console.log(`✅ Candidates table accessible (${candidates.length} records)`);
    
    const jobs = await prisma.job.findMany();
    console.log(`✅ Jobs table accessible (${jobs.length} records)`);
    
    const interviews = await prisma.interview.findMany();
    console.log(`✅ Interviews table accessible (${interviews.length} records)`);
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
