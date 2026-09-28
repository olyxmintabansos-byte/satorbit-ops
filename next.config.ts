import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/satorbit-ops',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
