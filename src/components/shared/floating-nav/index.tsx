import Link from 'next/link'
import { Suspense } from 'react'
import MobileMenu from './mobile-menu'
import Image from 'next/image'
import CartModal from '../cart/modal'
import { Button, buttonVariants } from '../button'
import { RiUser3Line } from '@remixicon/react'
import clsx from 'clsx'
import Search, { SearchSkeleton } from '../search'
import { vendureFetch } from '@/libs/vendure'
import { TOP_LEVEL_COLLECTIONS } from '@/libs/queries/products'
import { CollectionsBar } from './collections-bar'
import { getLocale } from 'next-intl/server'
import { cn } from '@/libs/utils'
export type Menu = {
  title: string
  path: string
}

export async function Navbar() {
  const locale = await getLocale()
  const { data } = await vendureFetch({
    query: TOP_LEVEL_COLLECTIONS,
    languageCode: locale,
  })
  const menu = [
    {
      title: 'Catálogo',
      path: '/catalog',
    },
    {
      title: 'Colecciones',
      path: '/collections',
    },
  ]

  return (
    <nav className="fixed left-1/2 z-30 flex w-full -translate-x-1/2 flex-col items-center justify-between gap-2 rounded-sm border border-border bg-background pt-2 md:top-4 md:flex-col md:gap-0 md:py-0 lg:max-w-[90vw]">
      <div className="flex w-full px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center">
            <Link
              href="/"
              prefetch={true}
              className="mx-2 flex items-center justify-center md:w-auto lg:mr-6"
            >
              <Image
                src="/assets/logo/nix-logo-color-dark.svg"
                alt="Nix Logo"
                width={92}
                height={92}
                className="hidden md:block"
              />
              <Image
                src="/assets/logo/logo-iso-color.svg"
                alt="Nix Logo"
                width={36}
                height={36}
                className="inline md:hidden"
              />
            </Link>
            <div className="hidden md:block">
              {menu.length ? (
                <ul className="hidden gap-6 text-sm md:flex md:items-center md:gap-2">
                  {menu.map((item: Menu) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        prefetch={true}
                        className={cn(buttonVariants({ variant: 'outline' }))}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className="flex w-full justify-end gap-2">
            <Suspense
              fallback={<SearchSkeleton className="hidden md:inline" />}
            >
              <Search className="hidden md:inline" />
            </Suspense>
            <CartModal />

            <Button variant="outline" size={'icon'}>
              <RiUser3Line
                className={clsx(
                  'h-5 w-5 transition-all ease-in-out hover:scale-110'
                )}
              />
            </Button>
            <div className="block flex-none md:hidden">
              <MobileMenu collections={data.collections.items} />
            </div>
          </div>
        </div>
      </div>
      <CollectionsBar collections={data.collections.items} />
    </nav>
  )
}
