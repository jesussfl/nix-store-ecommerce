'use client'

import { cn } from '@/libs/utils'
import Link from 'next/link'
import React, { useRef } from 'react'
import { buttonVariants } from '../button'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import { useNavbar } from './navbar.context'

export const NavbarCollections = () => {
  const { collections } = useNavbar()

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative flex w-full items-center overflow-hidden">
      <div
        ref={scrollRef}
        className="scrollbar-thin flex w-full gap-1 overflow-x-auto px-2 pb-2 md:gap-0 md:px-0 md:pb-0"
      >
        {collections.map((collection) => {
          return (
            <Link
              key={collection.id}
              href={`/catalog/${collection.slug}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'flex-none whitespace-nowrap'
              )}
            >
              {collection.name}
            </Link>
          )
        })}
      </div>

      <div className="hidden gap-2 bg-background p-2 md:flex">
        <button onClick={scrollLeft} className="" aria-label="Scroll Left">
          <RiArrowLeftSLine className="h-5 w-5" />
        </button>
        <button onClick={scrollRight} className="" aria-label="Scroll Right">
          <RiArrowRightSLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
