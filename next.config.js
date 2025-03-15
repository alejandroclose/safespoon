/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Static HTML export for Cloudflare Pages
    
    // Enable server components for Cloudflare Pages
    experimental: {
      serverComponentsExternalPackages: [],
      serverActions: true,
    },
    
    // Handling of images
    images: {
      unoptimized: true, // Needed for static export
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.safe-spoon.com',
          pathname: '/**',
        },
      ],
      // In case you need to point to localhost during development
      domains: ['localhost'],
    },
    
    // Environment variables
    env: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://safe-spoon.com',
    },
  }
  
  module.exports = nextConfig