/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      // Add any other domains you load images from
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Specify the source directory
  distDir: '.next',
  
  // Add cache headers for static assets
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Add redirect from root to login page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
  
  // Configuration for pages and routes
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Only enable typedRoutes in production (for Vercel)
  experimental: process.env.NODE_ENV === 'production' 
    ? {
        // This will force Next.js to only use properly named dynamic routes
        typedRoutes: true,
        // Enable server actions
        serverActions: true,
        // Enable optimistic updates
        optimisticClientCache: true,
        // Enable modern JavaScript features
        modernBuild: true,
      } 
    : {},
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Compress responses
  compress: true,
  
  // Increase build cache size for faster builds
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig