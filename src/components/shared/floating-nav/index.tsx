// import CartModal from 'components/cart/modal'
// import LogoSquare from 'components/logo-square'
// import { getMenu } from 'lib/shopify';
// import { Menu } from 'lib/shopify/types';
import Link from 'next/link'
import { Suspense } from 'react'
import MobileMenu from './mobile-menu'
import Image from 'next/image'
import CartModal from '../cart/modal'
import { Button, buttonVariants } from '../button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { ScrollArea, ScrollBar } from '../scroll-area/scroll-area'
import { cn } from '@/libs/utils'
import { RiUser2Line, RiUser3Line } from '@remixicon/react'
import clsx from 'clsx'
// import Search, { SearchSkeleton } from './search';
export type Menu = {
  title: string
  path: string
}
// const { SITE_NAME } = process.env

export async function Navbar() {
  const menu = [
    {
      title: 'Catálogo',
      path: '/#about',
    },
    {
      title: 'Colecciones',
      path: '/#contact',
    },
  ]

  return (
    <nav className="fixed left-1/2 z-40 flex w-full max-w-[90rem] -translate-x-1/2 items-center justify-between rounded-sm bg-background p-4 shadow-md md:my-2 md:flex-col md:pb-0 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <Image
              src="/assets/logo/nix-logo-color-dark.svg"
              alt="Nix Logo"
              width={72}
              height={50}
              className="absolute left-1/2 -translate-x-1/2"
            />
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center md:gap-0">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className={cn(buttonVariants({ variant: 'ghost' }))}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          {/* <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense> */}
        </div>
        <div className="flex justify-end gap-2 md:w-1/3">
          <CartModal />

          <Button variant="outline" size={'icon'}>
            <RiUser3Line
              className={clsx('h-4 transition-all ease-in-out hover:scale-110')}
            />

            {/* {quantity ? (
        <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
          {quantity}
        </div>
      ) : null} */}
          </Button>
        </div>
      </div>

      <ScrollArea className="hidden w-full max-w-[90rem] whitespace-nowrap pt-1 md:inline">
        <div className="flex w-max space-x-4 pb-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <Button variant={'outline'} className="shrink-0" key={index}>
              Categoria
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  )
}
