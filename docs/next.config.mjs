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
  // Disable Turbopack due to file: dependency resolution issues
  // Force webpack usage by setting environment variable or using --no-turbo flag
  // In CI, we'll use NEXT_PRIVATE_SKIP_TURBO=1
}

export default withNextra(nextConfig)
