const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
module.exports = withNextIntl(nextConfig)
