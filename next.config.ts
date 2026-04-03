import { withWorkflow } from 'workflow/next'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    qualities: [55, 58, 60, 66, 68, 70, 72, 75, 80, 86],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bgijdyqllsokplarolxz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
};

export default withWorkflow(nextConfig);
