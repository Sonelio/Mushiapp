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
  
  // Exclude problematic routes with empty brackets from the build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  experimental: {
    // This will force Next.js to only use properly named dynamic routes
    typedRoutes: true
  },
  // Explicitly exclude the problematic routes
  excludeRoute: (path) => {
    return path.includes('/template/[]') || path.includes('/account/[]');
  },
}

module.exports = nextConfig