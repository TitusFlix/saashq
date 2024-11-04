const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'uploadthing.com',
      'avatars.githubusercontent.com',
      'utfs.io',
    ],
  },
  webpack: (config) => {
    config.module.noParse = [require.resolve('typescript/lib/typescript.js')];
    return config;
  },
  experimental: {
    serverActions: true,
  },
  functions: {
    maxDuration: 60,
  },
  serverRuntimeConfig: {
    maxDuration: 60,
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/[locale]/workflows/:path*',
          destination: '/api/workflows/:path*',
          has: [
            {
              type: 'query',
              key: 'maxDuration',
              value: '60'
            }
          ]
        }
      ]
    }
  }
};

module.exports = withNextIntl(nextConfig);
