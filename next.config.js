/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      // Add any other domains you load images from
    ],
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
        typedRoutes: true
      } 
    : {}
}

module.exports = nextConfig