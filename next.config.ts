import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'serpapi.com',
        port: '',
        pathname: '/searches/**',
      },
      {
        protocol: 'https',
        hostname: '*.serpapi.com',
        port: '',
        pathname: '/**',
      },
      // Add other image domains that might be returned by SerpAPI
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wikipedia.org',
        port: '',
        pathname: '/**',
      },
      // Add common image hosting domains
      {
        protocol: 'https',
        hostname: '*.h-cdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.h-cdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Allow all domains for now (for testing)
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
