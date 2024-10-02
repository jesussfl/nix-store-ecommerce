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
            width={56}
            height={56}
            src={`/assets/brands/adidas-logo.png`}
            alt="Adidas"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Amazon-logo.png`}
            alt="Amazon"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Shein.png`}
            alt="Shein"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Ebay.png`}
            alt="Ebay"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={120}
            height={120}
            src={`/assets/brands/Aliexpress.png`}
            alt="Aliexpress"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={80}
            height={80}
            src={`/assets/brands/Nike.png`}
            alt="Aliexpress"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={100}
            height={100}
            src={`/assets/brands/Temu.png`}
            alt="Aliexpress"
            className="object-contain object-center"
          />
        </Li>
        <Li>
          <Image
            width={150}
            height={150}
            src={`/assets/brands/Walmart.png`}
            alt="Walmart"
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
      //   change md:w-[450px] to md:w-[60vw] , px-8 py-6 to p-16, border-slate-700 to border-slate-800
      className="relative flex h-[72px] w-[200px] scale-75 items-center justify-center rounded-md border p-5 md:scale-100"
      // change to idx cuz we have the same name
    >
      {children}
    </li>
  )
}
