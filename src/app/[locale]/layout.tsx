import { cn } from '@/libs/utils'
import { Toaster } from '@/components/shared/toast/toaster'

import { NextIntlClientProvider } from 'next-intl'
import {
  getFormatter,
  getMessages,
  getNow,
  getTimeZone,
  getTranslations,
} from 'next-intl/server'

import { Montserrat } from 'next/font/google'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { Metadata } from 'next'
import { ReactNode } from 'react'
type Props = {
  children: ReactNode
  params: { locale: string }
}
export async function generateMetadata({
  params: { locale },
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'LocaleLayout' })
  const formatter = await getFormatter({ locale })
  const now = await getNow({ locale })
  const timeZone = await getTimeZone({ locale })

  return {
    metadataBase: new URL('http://localhost:3000'),
    title: t('title'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone: timeZone || 'N/A',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'http://localhost:3000',
      siteName: 'Nix Store',
      images: [
        {
          url: '/nix-logo-iso-white.png',
          width: 800,
          height: 600,
        },
        {
          url: '/nix-logo-iso-white.png',
          width: 1800,
          height: 1600,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  }
}

// If loading a variable font, you don't need to specify the font weight
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})
export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={cn(
          'bg-background font-sans antialiased',
          montserrat.variable
        )}
      >
        <Header />
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
        <Footer />
      </body>
    </html>
  )
}
