import DynamicBreadcrumbs from '@/components/shared/breadcrumbs/dynamic-breadcrumbs'
import { getLocale } from 'next-intl/server'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <div className="flex flex-col items-center">
      <DynamicBreadcrumbs locale={locale} />
      {children}
    </div>
  )
}
