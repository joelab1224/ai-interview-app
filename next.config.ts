import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server components (updated for Next.js 15)
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Remove standalone output that may cause issues
  // output: 'standalone',
};

export default nextConfig;
