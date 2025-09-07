// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'storage.example.com' },
    ],
  },
};

export default nextConfig;
