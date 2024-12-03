'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ImageOff, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel/carousel-native'
import { Card, CardContent } from '@/components/shared/card/card'
import { Button } from '@/components/shared/button'
import { cn } from '@/libs/utils'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setSelectedImage(images[0] || '')
    setActiveIndex(0)
  }, [images])

  const handleImageSelect = useCallback((image: string, index: number) => {
    setSelectedImage(image)
    setActiveIndex(index)
  }, [])

  const handleZoom = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }, [])

  const toggleZoom = useCallback(() => {
    setZoomLevel((prev) => (prev === 1 ? 2 : 1))
  }, [])

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    setSelectedImage(
      images[activeIndex > 0 ? activeIndex - 1 : images.length - 1]
    )
  }, [activeIndex, images])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    setSelectedImage(
      images[activeIndex < images.length - 1 ? activeIndex + 1 : 0]
    )
  }, [activeIndex, images])

  if (images.length === 0) {
    return (
      <div className="h-[500px] w-full rounded-lg border p-4">
        <div className="flex h-full flex-col items-center justify-center rounded-lg bg-slate-100">
          <ImageOff className="mb-4 h-16 w-16" />
          <p className="text-center text-lg font-medium">
            Este producto no tiene imágenes disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[500px] w-full flex-col-reverse items-center justify-center gap-4 rounded-lg border p-2 sm:h-[700px] md:p-6 xl:flex-row">
      <Carousel
        orientation="vertical"
        opts={{
          align: 'start',
        }}
        className="hidden xl:block"
      >
        <CarouselContent className="-mt-1 h-[500px]">
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-1/5 pt-1">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-full w-full p-0',
                        activeIndex === index && 'ring-2 ring-primary'
                      )}
                      onMouseEnter={() => handleImageSelect(image, index)}
                      onClick={() => handleImageSelect(image, index)}
                    >
                      <Image
                        src={image}
                        alt={`Product thumbnail ${index + 1}`}
                        width={60}
                        height={60}
                        className="h-full w-full rounded-sm object-cover"
                      />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Carousel className="w-[70%] xl:hidden">
        <CarouselContent className="">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 sm:basis-1/5 lg:basis-1/4"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <Button
                      variant="ghost"
                      className={cn(
                        'h-full w-full p-0',
                        activeIndex === index && 'ring-2 ring-primary'
                      )}
                      onMouseEnter={() => handleImageSelect(image, index)}
                      onClick={() => handleImageSelect(image, index)}
                    >
                      <Image
                        src={image}
                        alt={`Product thumbnail ${index + 1}`}
                        width={60}
                        height={60}
                        className="h-full w-full rounded-sm object-cover"
                      />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="relative h-full w-full flex-1 overflow-hidden rounded-md bg-slate-100">
        <div
          className="relative h-full w-full cursor-zoom-in"
          onClick={toggleZoom}
          onMouseMove={handleZoom}
        >
          <Image
            src={selectedImage}
            alt="Selected product image"
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-300 ease-in-out"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
          {zoomLevel === 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-white p-2">
              <ZoomIn className="h-6 w-6" />
            </div>
          )}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous image</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next image</span>
        </Button>
      </div>
    </div>
  )
}
