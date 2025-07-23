import { PrismaClient } from '@prisma/client';

// Global prisma instance to prevent multiple connections in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single instance of Prisma Client with optimized settings for Vercel
export const prisma = globalThis.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// In development, save the instance to global to prevent multiple connections
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
