import nextra from 'nextra'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const withNextra = nextra({
  contentDirBasePath: '/content',
  search: { codeblocks: false }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds, not dev mode
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/hero-hook-form' : ''),
  experimental: {
    externalDir: true
  },
  transpilePackages: [
    '@rachelallyson/hero-hook-form',
    '@rachelallyson/heroui-font-picker'
  ],
  webpack: (config, { isServer }) => {
    // Resolve the local package for webpack (non-Turbopack builds)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@rachelallyson/hero-hook-form': path.resolve(__dirname, '../dist/index.js'),
      };
    }
    return config;
  },
  // Disable Turbopack for now due to file: dependency resolution issues
  // Use: npm run build (uses webpack) instead of next build --turbo
  // turbopack: {
  //   root: __dirname,
  // },
}

export default withNextra(nextConfig)
