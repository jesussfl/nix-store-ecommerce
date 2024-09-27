'use client'

import { cn } from '@/libs/utils'
import Link from 'next/link'
import { useRef } from 'react'
import { buttonVariants } from '../button'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import { GetTopLevelCollectionsQuery } from '@/graphql/graphql'

export const CollectionsBar = ({
  collections,
}: {
  collections: GetTopLevelCollectionsQuery['collections']['items']
}) => {
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
    <div className="relative flex w-full items-center">
      <div
        ref={scrollRef}
        className="scrollbar-thin flex w-full overflow-x-auto pb-2 md:pb-0"
      >
        {collections.map((collection) => {
          return (
            <Link
              key={collection.id}
              href={`/catalog/${collection.slug}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'whitespace-nowrap'
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
