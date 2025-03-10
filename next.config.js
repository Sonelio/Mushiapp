/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: [
        'firebasestorage.googleapis.com',
        // Add any other domains you load images from
      ],
    },
  }
  
  module.exports = nextConfig