const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const imageHostCandidates = [
  process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN,
  process.env.VENDURE_ADMIN_DOMAIN,
  'https://nix-store-admin-production.up.railway.app',
  'http://localhost:3000',
]

const vendureImagePatterns = imageHostCandidates
  .filter(Boolean)
  .map((value) => {
    try {
      const url = new URL(value)

      return {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        port: url.port,
        pathname: '/assets/**',
      }
    } catch {
      return null
    }
  })
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      ...vendureImagePatterns,
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = withNextIntl(nextConfig)
