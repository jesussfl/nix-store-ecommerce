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

export default function DynamicBreadcrumbs({ locale }: { locale: string }) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')
  const t = useTranslations('Navigation')
  // Remove the locale segment (if present) from the URL path
  const segmentsWithoutLocale =
    pathSegments[0] === locale ? pathSegments.slice(1) : pathSegments

  return (
    <Breadcrumb className="mt-4 w-full overflow-x-auto px-3 sm:mt-6 sm:px-4">
      <BreadcrumbList className="mx-auto flex-nowrap justify-start whitespace-nowrap sm:flex-wrap sm:justify-center sm:whitespace-normal">
        {/* Home Breadcrumb */}
        <BreadcrumbItem>
          <BreadcrumbLink
            className={cn(
              buttonVariants({ variant: 'link' }),
              'font-regular px-0 text-foreground'
            )}
            href={`/${locale}`}
          >
            {t(`home`)}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Breadcrumb Segments */}
        {segmentsWithoutLocale.map((segment, index) => {
          const href = `/${locale}/${segmentsWithoutLocale.slice(0, index + 1).join('/')}`

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* <BreadcrumbSeparator /> */}

                {index === segmentsWithoutLocale.length - 1 ? (
                  // If it's the last segment, show it as the current page
                  <BreadcrumbPage className="max-w-[12rem] truncate font-semibold text-primary sm:max-w-none">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  // Otherwise, it's a clickable link
                  <BreadcrumbLink
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'font-regular max-w-[9rem] truncate px-0 text-foreground sm:max-w-none'
                    )}
                    href={href}
                  >
                    {segment}
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
