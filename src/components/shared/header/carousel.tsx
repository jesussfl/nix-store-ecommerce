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
import { AspectRatio } from '../aspect-ratio'
const slideshow = [
  {
    name: 'Collares',
    image: '/assets/slideshow/slideshow1.png',
  },
  {
    name: 'Pulseras',
    image: '/assets/slideshow/slideshow2.png',
  },
  {
    name: 'Franelas',
    image: '/assets/slideshow/slideshow3.jpg',
  },
]
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
        {slideshow.map((slide, index) => (
          <CarouselItem key={index}>
            <AspectRatio>
              <Image
                src={slide.image}
                alt="Your image"
                fill
                className="object-cover"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
