import Link from 'next/link'
import React, { Suspense } from 'react'
import MobileMenu from './mobile-menu'
import Image from 'next/image'
import CartModal from '../cart/modal'
import { Button, buttonVariants } from '../button'
import { RiUser3Line } from '@remixicon/react'
import clsx from 'clsx'
import Search from '../search'
import { vendureFetch } from '@/libs/vendure'
import { TOP_LEVEL_COLLECTIONS } from '@/libs/queries/products'
import { NavbarCollections } from './collections-bar'
import { getLocale } from 'next-intl/server'
import { cn } from '@/libs/utils'
import { NavbarProvider } from './navbar.context'
import { GetBCVPrice } from '@/utils/get-bcv-price'

export type Menu = {
  title: string
  path: string
}

function NavbarRoot({ children }: { children: React.ReactNode }) {
  return (
    <nav className="fixed left-1/2 z-30 flex w-full -translate-x-1/2 flex-col items-center justify-between gap-2 rounded-sm border border-border bg-background pt-2 md:top-2 md:flex-col md:gap-0 md:py-0 lg:max-w-[95vw]">
      {children}
    </nav>
  )
}

function NavbarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full px-4 md:px-6">
      <div className="flex w-full items-center justify-between">{children}</div>
    </div>
  )
}

function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center lg:mr-2">
      <Image
        src="/assets/logo/nix-logo-color-dark.svg"
        alt="Nix Logo"
        width={92}
        height={92}
        className="scale-75 md:scale-100"
      />
    </Link>
  )
}

function NavbarMenu() {
  const menu = [
    { title: 'Catálogo', path: '/catalog' },
    // { title: 'Colecciones', path: '/collections' },
  ]

  return (
    <div className="hidden md:block">
      {menu.length ? (
        <ul className="hidden gap-6 text-sm md:flex md:items-center md:gap-2">
          {menu.map((item: Menu) => (
            <li key={item.title}>
              <Link
                href={item.path}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

async function NavbarActions() {
  const bcvPrice = await GetBCVPrice()
  return (
    <div className="flex w-full justify-end gap-2">
      <Search className="hidden md:inline" />
      <CartModal bcvPrice={bcvPrice} />
      <Link
        href="/account/profile"
        className={buttonVariants({ variant: 'outline', size: 'icon' })}
      >
        <RiUser3Line
          className={clsx('h-5 w-5 transition-all ease-in-out hover:scale-110')}
        />
      </Link>
      <div className="block flex-none md:hidden">
        <MobileMenu />
      </div>
    </div>
  )
}

async function NavbarContent() {
  const locale = await getLocale()
  const { data, error } = await vendureFetch({
    query: TOP_LEVEL_COLLECTIONS,
    languageCode: locale,
  })

  const collections = data?.collections?.items || []

  return (
    <NavbarProvider value={{ collections, error }}>
      <NavbarRoot>
        <NavbarContainer>
          <div className="flex w-full items-center">
            <NavbarLogo />
            <NavbarMenu />
          </div>
          <NavbarActions />
        </NavbarContainer>
        {!error && <NavbarCollections />}
      </NavbarRoot>
    </NavbarProvider>
  )
}

export function Navbar() {
  return <NavbarContent />
}

Navbar.Root = NavbarRoot
Navbar.Container = NavbarContainer
Navbar.Logo = NavbarLogo
Navbar.Menu = NavbarMenu
Navbar.Actions = NavbarActions
Navbar.Collections = NavbarCollections
