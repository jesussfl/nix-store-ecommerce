import '@/utils/styles/globals.css'
import localFont from 'next/font/local'
import { cn } from '@/libs/utils'
import { Toaster } from '@/components/shared/toast/toaster'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { Montserrat } from 'next/font/google'
import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'

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
