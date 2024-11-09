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
    <Breadcrumb className="mt-6 flex justify-center px-4">
      <BreadcrumbList>
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
                  <BreadcrumbPage className="font-semibold text-primary">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  // Otherwise, it's a clickable link
                  <BreadcrumbLink
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'font-regular px-0 text-foreground'
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
