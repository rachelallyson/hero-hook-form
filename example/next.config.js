/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@rachelallyson/hero-hook-form"],
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.BASE_PATH || '',
};

module.exports = nextConfig;
