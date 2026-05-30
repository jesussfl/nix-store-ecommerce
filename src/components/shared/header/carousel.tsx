'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { AspectRatio } from '../aspect-ratio'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { cn } from '@/libs/utils'

const slideshow = [
  { name: 'Internet a tus manos', image: '/assets/slideshow/1.jpg' },
  { name: 'Compra en SHEIN', image: '/assets/slideshow/2.jpg' },
  { name: 'Visita nuestro catalogo', image: '/assets/slideshow/3.jpg' },
]

export function CarouselPlugin() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(slideshow.length)
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    const updateSelectedSlide = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }

    setSlideCount(api.scrollSnapList().length)
    updateSelectedSlide()
    api.on('select', updateSelectedSlide)
    api.on('reInit', updateSelectedSlide)

    return () => {
      api.off('select', updateSelectedSlide)
      api.off('reInit', updateSelectedSlide)
    }
  }, [api])

  return (
    <div className="space-y-4">
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slideshow.map((slide, index) => (
            <CarouselItem key={slide.image} className="pl-0">
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-xl bg-white/5 shadow-2xl ring-1 ring-white/15 lg:rounded-2xl"
              >
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) calc(100vw - 2rem), 56vw"
                  className="object-cover"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 translate-x-0 border-white/20 bg-black/45 text-white shadow-lg backdrop-blur hover:bg-black/70 disabled:opacity-0 md:flex lg:left-4" />
        <CarouselNext className="right-3 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 translate-x-0 border-white/20 bg-black/45 text-white shadow-lg backdrop-blur hover:bg-black/70 disabled:opacity-0 md:flex lg:right-4" />
      </Carousel>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={selectedIndex === index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full bg-white/70 ring-1 ring-white/60 transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              selectedIndex === index
                ? 'w-7 bg-white'
                : 'w-2 shadow-[0_0_0_2px_rgba(255,255,255,0.18)]'
            )}
          />
        ))}
      </div>
    </div>
  )
}
