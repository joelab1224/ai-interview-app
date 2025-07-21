import { PrismaClient } from '@prisma/client';

// Global prisma instance to prevent multiple connections in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single instance of Prisma Client
export const prisma = globalThis.prisma ?? new PrismaClient();

// In development, save the instance to global to prevent multiple connections
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
