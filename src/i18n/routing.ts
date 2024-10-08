import { defineRouting } from 'next-intl/routing'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],
  localePrefix: 'always',
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
    '/search': {
      en: '/search',
      es: '/busqueda',
    },
    collections: {
      en: '/collections',
      es: '/colecciones',
    },
    // If locales use different paths, you can
    // specify each external path per locale
    '/catalog': {
      en: '/catalog',
      es: '/catalogo',
    },
    '/catalog/[collection]': {
      en: '/catalog/[collection]',
      es: '/catalogo/[collection]',
    },
    // Dynamic params are supported via square brackets
    // '/news/[articleSlug]-[articleId]': {
    //   en: '/news/[articleSlug]-[articleId]',
    //   es: '/neuigkeiten/[articleSlug]-[articleId]'
    // },

    // Static pathnames that overlap with dynamic segments
    // will be prioritized over the dynamic segment
    // '/news/just-in': {
    //   en: '/news/just-in',
    //   es: '/neuigkeiten/aktuell'
    // },

    // Also (optional) catch-all segments are supported
    // '/categories/[...slug]': {
    //   en: '/categories/[...slug]',
    //   es: '/kategorien/[...slug]'
    // }
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)
