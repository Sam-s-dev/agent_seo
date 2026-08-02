/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers are handled in middleware.ts
  // Enable strict mode for catching bugs
  reactStrictMode: true,
  
  // Image optimization whitelist
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pollinations.ai' },
    ],
  },
  
  // Minimize bundle size in production
  poweredByHeader: false,
};

module.exports = nextConfig;
