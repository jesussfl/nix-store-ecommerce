'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'

import { Card, CardContent } from '@/components/shared/card/card'
import Image from 'next/image'

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="aspect-square bg-gray-200 md:w-[50%] lg:h-[650px]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6 md:h-[550px] lg:h-[650px]">
                <Image
                  src="https://images.unsplash.com/photo-1719937206255-cc337bccfc7d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className=""
                  fill
                  style={{ objectFit: 'cover' }}
                  alt="Shoes"
                ></Image>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  )
}
