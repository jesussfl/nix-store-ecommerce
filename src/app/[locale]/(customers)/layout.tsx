import '@/utils/styles/globals.css'
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
import Footer from '@/components/shared/footer'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { Navbar } from '@/components/shared/floating-nav'
import { CartProvider } from '@/components/cart/cart-context'

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
    <html
      lang={locale}
      className={cn('bg-background font-sans antialiased', montserrat.variable)}
    >
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">
              {children}
            </main>
            <Toaster />
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
