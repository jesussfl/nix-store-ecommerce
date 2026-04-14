import DynamicBreadcrumbs from '@/components/shared/breadcrumbs/dynamic-breadcrumbs'
import { getLocale } from 'next-intl/server'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <div className="w-full pt-8 sm:pt-4 lg:pt-0">
      <DynamicBreadcrumbs locale={locale} />
      {children}
    </div>
  )
}
