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
  async rewrites() {
    // Dev proxy: делает все запросы на /api/* одноисточниковыми (localhost:3000)
    // чтобы refreshToken httpOnly-кука отправлялась с sameSite=lax
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
