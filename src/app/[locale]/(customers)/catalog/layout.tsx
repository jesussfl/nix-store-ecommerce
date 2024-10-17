import DynamicBreadcrumbs from '@/components/shared/breadcrumbs/dynamic-breadcrumbs'
import { getLocale } from 'next-intl/server'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <div className="w-full">
      <DynamicBreadcrumbs locale={locale} />
      {children}
    </div>
  )
}
