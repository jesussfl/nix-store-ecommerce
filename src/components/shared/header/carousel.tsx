'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { AspectRatio } from '../aspect-ratio'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shared/carousel'

const slideshow = [
  { name: 'Collares', image: '/assets/slideshow/slideshow1.png' },
  { name: 'Pulseras', image: '/assets/slideshow/slideshow2.png' },
  { name: 'Franelas', image: '/assets/slideshow/slideshow3.jpg' },
]

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xl lg:max-w-none"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slideshow.map((slide, index) => (
          <CarouselItem key={index}>
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
