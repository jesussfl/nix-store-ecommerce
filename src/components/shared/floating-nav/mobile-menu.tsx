'use client'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { RiMenu2Line, RiSearchLine } from '@remixicon/react'
import Search, { SearchSkeleton } from '../search'
import { Button, buttonVariants } from '../button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/shared/accordion'
import { GetTopLevelCollectionsQuery } from '@/graphql/graphql'
import { cn } from '@/libs/utils'
import { HorizontalDivider } from '../divider'

export type Menu = {
  title: string
  path: string
}

export default function MobileMenu({
  collections,
}: {
  collections: GetTopLevelCollectionsQuery['collections']['items']
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSearchSubmit = () => {
    setIsSearchOpen(false)
  }

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <RiSearchLine className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[30vh]">
          <div className="pt-8">
            <Suspense fallback={<SearchSkeleton />}>
              <Search onSearchSubmit={handleSearchSubmit} />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <RiMenu2Line className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] pt-16 sm:w-[400px]">
          <div className="mb-4 w-full">
            <Suspense fallback={<SearchSkeleton />}>
              <Search onSearchSubmit={handleSearchSubmit} />
            </Suspense>
          </div>
          <Link
            href={`/catalog`}
            className={cn(
              buttonVariants({ variant: 'link', size: 'lg' }),
              'w-full justify-start px-0 text-left text-base font-medium text-foreground'
            )}
          >
            {`Catálogo `}
          </Link>
          <HorizontalDivider />
          <Accordion type="multiple" className="w-full">
            <AccordionItem value={'collections'}>
              <AccordionTrigger className="">
                Colecciones ({collections.length})
              </AccordionTrigger>
              <AccordionContent className="flex w-full flex-col gap-4">
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/catalog/${collection.slug}`}
                    prefetch={true}
                    className={cn(
                      buttonVariants({ variant: 'link' }),
                      'justify-start text-left text-base font-normal text-foreground'
                    )}
                  >
                    {collection.name}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetContent>
      </Sheet>
    </div>
  )
}
