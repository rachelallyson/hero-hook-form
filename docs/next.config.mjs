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
  output: 'export',
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
  turbopack: {
    root: __dirname,
  },
}

export default withNextra(nextConfig)