'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect, ReactNode } from 'react'
const shouldHideNavbar = (pathname: string, locale: string) => {
  return (
    pathname === `/${locale}/checkout` ||
    pathname === `/${locale}/checkout/payment`
  )
}
export function NavbarScrollWrapper({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const locale = useLocale()
  useEffect(() => {
    if (shouldHideNavbar(pathname, locale)) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [pathname, locale])
  useEffect(() => {
    if (shouldHideNavbar(pathname, locale)) {
      setIsVisible(false)
      return
    }
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up
          setIsVisible(true)
        }

        setLastScrollY(currentScrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)

      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY, pathname, locale])

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-30 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-48'
      }`}
    >
      {children}
    </div>
  )
}
