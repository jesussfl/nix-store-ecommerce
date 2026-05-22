'use client'

import { cn } from '@/libs/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export const InfiniteMovingCards = ({
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    addAnimation()
  }, [])
  const [start, setStart] = useState(false)
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        )
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        )
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '30s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      }
    }
  }
  return (
    <div
      ref={containerRef}
      className={cn(
        // max-w-7xl to w-screen
        'scroller relative z-20 w-[99vw] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // change gap-16
          'flex w-max min-w-full shrink-0 flex-nowrap -space-x-8 py-4 md:gap-8 md:-space-x-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Amazon-logo.png`}
            alt="Amazon"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Shein.png`}
            alt="Shein"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Ebay.png`}
            alt="Ebay"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={120}
            height={120}
            src={`/assets/brands/Aliexpress.png`}
            alt="Aliexpress"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Nike.png`}
            alt="Nike"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={100}
            height={100}
            src={`/assets/brands/Temu.png`}
            alt="Temu"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={150}
            height={150}
            src={`/assets/brands/Walmart.png`}
            alt="Walmart"
            style={{ width: 'auto' }}
            className="object-contain object-center"
          />
        </Li>
      </ul>
    </div>
  )
}

const Li = ({ children }: { children: React.ReactNode }) => {
  return (
    <li
      className="relative flex h-[72px] w-[200px] scale-75 items-center justify-center rounded-2xl border border-border/40 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:scale-100"
    >
      {children}
    </li>
  )
}
