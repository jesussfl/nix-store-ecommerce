import '@/utils/styles/globals.css'
import localFont from 'next/font/local'
import { cn } from '@/libs/utils'
import { Toaster } from '@/modules/common/components/toast/toaster'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

// export const fontSans = FontSans({
//   weight: ['400', '500', '700'],
//   subsets: ['latin-ext'],
//   variable: '--font-sans',
// })
const fontSans = localFont({
  src: [
    {
      path: '../../../public/fonts/Poppins-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../../public/fonts/Poppins-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../../public/fonts/Poppins-SemiBold.ttf',
      weight: '600',
    },
    {
      path: '../../../public/fonts/Poppins-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-sans',
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
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
