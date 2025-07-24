import type { NextConfig } from "next";

const nextConfig = {
  images: {
    // Allow images from Wasabi and other external domains
    domains: [
      'https://s3.us-central-1.wasabisys.com', // Replace with your actual Wasabi domain
      's3.wasabisys.com',
      'wasabisys.com',
      // Add other domains as needed
    ],
    // Alternative: Use remotePatterns for more flexible configuration
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.wasabisys.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.wasabisys.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Disable image optimization if needed (not recommended for production)
    unoptimized: false,
  },
  
  // Add headers for CORS if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
