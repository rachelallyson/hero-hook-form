/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@rachelallyson/hero-hook-form"],
};

module.exports = nextConfig;
