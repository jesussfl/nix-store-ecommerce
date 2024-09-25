'use client'

import { cn } from '@/libs/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export const NixAnimation = ({
  direction = 'left',
  speed = 'fast',
  pauseOnHover = false,
  className,
  isDark = false,
}: {
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
  isDark?: boolean
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
        'scroller relative z-20 w-screen overflow-hidden border-2 border-border bg-dark [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          // change gap-16
          'flex w-max min-w-full shrink-0 flex-nowrap -space-x-2 py-2 md:space-x-16 md:py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
          />
        </Li>
        <Li>
          <Image
            width={56}
            height={56}
            src={`/assets/logo/nix-logo-v2-white.svg`}
            alt="Nix Logo"
            className={`${isDark ? 'invert' : ''} object-contain object-center`}
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
      className="relative flex h-[72px] w-[200px] scale-[300%] items-center justify-center md:scale-[400%]"
      // change to idx cuz we have the same name
    >
      {children}
    </li>
  )
}
