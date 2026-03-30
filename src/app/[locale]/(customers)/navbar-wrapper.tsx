'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect, ReactNode, useRef } from 'react'

const TOP_VISIBILITY_OFFSET = 8
const HIDE_NAVBAR_AFTER = 64

const shouldHideNavbar = (pathname: string, locale: string) => {
  return (
    pathname === `/${locale}/checkout` ||
    pathname === `/${locale}/checkout/payment`
  )
}
export function NavbarScrollWrapper({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    if (shouldHideNavbar(pathname, locale)) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
      lastScrollY.current = 0
    }
  }, [pathname, locale])

  useEffect(() => {
    if (shouldHideNavbar(pathname, locale)) {
      setIsVisible(false)
      lastScrollY.current = 0
      return
    }

    const controlNavbar = () => {
      if (typeof window === 'undefined') {
        return
      }

      const currentScrollY = Math.max(window.scrollY, 0)

      if (currentScrollY <= TOP_VISIBILITY_OFFSET) {
        setIsVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > HIDE_NAVBAR_AFTER
      ) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    if (typeof window === 'undefined') {
      return
    }

    lastScrollY.current = Math.max(window.scrollY, 0)
    controlNavbar()
    window.addEventListener('scroll', controlNavbar, { passive: true })

    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [pathname, locale])

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
