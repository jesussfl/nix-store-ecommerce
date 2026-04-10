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
  { name: 'Internet a tus manos', image: '/assets/slideshow/header-slide-1.png' },
  { name: 'Compra en SHEIN', image: '/assets/slideshow/header-slide-2.png' },
  { name: 'Visita nuestro catalogo', image: '/assets/slideshow/header-slide-3.png' },
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
