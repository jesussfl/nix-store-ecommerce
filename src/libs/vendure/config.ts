const PROD_VENDURE_BACKEND = 'https://p01--nix-store--9c67vmxtxbrm.code.run'
const DEV_VENDURE_BACKEND = 'http://localhost:3000'

export const getVendureDomain = () =>
  process.env.VENDURE_ADMIN_DOMAIN ||
  process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN ||
  (process.env.NODE_ENV === 'production' ||
  process.env.RAILWAY_ENVIRONMENT === 'production' ||
  process.env.VERCEL_ENV === 'production'
    ? PROD_VENDURE_BACKEND
    : DEV_VENDURE_BACKEND)

export const getVendureEndpoint = () => `${getVendureDomain()}/shop-api`
