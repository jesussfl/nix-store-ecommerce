'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shared/breadcrumbs'
import { useTranslations } from 'next-intl'
import { cn } from '@/libs/utils'
import { buttonVariants } from '../button'
import React from 'react'

/** Convert a URL slug to a readable label with each word capitalized */
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/** Segments that are routing folders only — no real page exists at their URL */
const SKIP_SEGMENTS = ['details']

export default function DynamicBreadcrumbs({ locale }: { locale: string }) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const t = useTranslations('Navigation')
  // Remove the locale segment (if present) from the URL path
  const allSegments =
    pathSegments[0] === locale ? pathSegments.slice(1) : pathSegments
  // Filter out routing-only ghost segments that have no real page
  const segmentsWithoutLocale = allSegments.filter(
    (segment) => !SKIP_SEGMENTS.includes(segment)
  )

  return (
    <Breadcrumb className="mt-4 w-full overflow-x-auto px-3 sm:mt-6 sm:px-4">
      <BreadcrumbList className="mx-auto flex-nowrap justify-start whitespace-nowrap sm:flex-wrap sm:justify-center sm:whitespace-normal">
        {/* Home Breadcrumb */}
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            className={cn(
              buttonVariants({ variant: 'link' }),
              'px-0 font-medium text-foreground/70 transition-colors hover:text-foreground'
            )}
            href={`/${locale}`}
          >
            {t(`home`)}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Breadcrumb Segments */}
        {segmentsWithoutLocale.map((segment, index) => {
          const href = `/${locale}/${segmentsWithoutLocale.slice(0, index + 1).join('/')}`
          const label = slugToLabel(segment)
          const isLast = index === segmentsWithoutLocale.length - 1

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="shrink-0" />
              <BreadcrumbItem
                className={cn(
                  'min-w-0',
                  isLast
                    ? 'max-w-[12rem] sm:max-w-none'
                    : 'max-w-[9rem] sm:max-w-none'
                )}
              >
                {isLast ? (
                  // Current page — truncate long product names
                  <BreadcrumbPage
                    className="block truncate font-semibold text-primary"
                    title={label}
                  >
                    {label}
                  </BreadcrumbPage>
                ) : (
                  // Clickable link — also truncate
                  <BreadcrumbLink
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'block max-w-full truncate px-0 font-medium text-foreground/70 transition-colors hover:text-foreground'
                    )}
                    href={href}
                    title={label}
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
