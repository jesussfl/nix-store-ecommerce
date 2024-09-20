import { defineRouting } from 'next-intl/routing'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],
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

    // If locales use different paths, you can
    // specify each external path per locale
    '/catalog': {
      en: '/catalog',
      es: '/catalogo',
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
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing)