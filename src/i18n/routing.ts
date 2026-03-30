import { defineRouting } from 'next-intl/routing'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es'],
  localePrefix: 'as-needed',
  // Used when no locale matches
  defaultLocale: 'es',
  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    // If all locales use the same pathname, a single
    // external path can be used for all locales
    '/': '/',
    '/blog': '/blog',
    '/search': '/busqueda',
    collections: '/colecciones',
    // If locales use different paths, you can
    // specify each external path per locale
    '/catalog': '/catalogo',
    '/catalog/[collection]': '/catalogo/[collection]',
    '/catalog/details/[productSlug]': '/catalogo/detalles/[productSlug]',
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
