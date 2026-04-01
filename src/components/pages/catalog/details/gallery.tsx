'use client'

import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { ImageWithFallback } from '@/components/shared/image-with-fallback/image-with-fallback'
import { Button } from '@/components/shared/button'
import { cn } from '@/libs/utils'

interface GalleryProps {
  images: string[]
}

const DEFAULT_ZOOM_POSITION = { x: 50, y: 50 }

export function Gallery({ images }: GalleryProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState(DEFAULT_ZOOM_POSITION)
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedImage = images[activeIndex] ?? ''

  useEffect(() => {
    setActiveIndex(0)
    setZoomLevel(1)
    setZoomPosition(DEFAULT_ZOOM_POSITION)
  }, [images])

  const selectImage = (index: number) => {
    if (images.length === 0) return

    const normalizedIndex = (index + images.length) % images.length
    setActiveIndex(normalizedIndex)
    setZoomLevel(1)
    setZoomPosition(DEFAULT_ZOOM_POSITION)
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel === 1) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const toggleZoom = () => {
    if (zoomLevel > 1) {
      setZoomPosition(DEFAULT_ZOOM_POSITION)
    }
    setZoomLevel((prev) => (prev === 1 ? 2 : 1))
  }

  const handlePrevious = () => {
    selectImage(activeIndex - 1)
  }

  const handleNext = () => {
    selectImage(activeIndex + 1)
  }

  if (images.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-2.5 shadow-sm sm:rounded-[1.75rem] sm:p-4">
        <div className="flex aspect-square min-h-[220px] flex-col items-center justify-center gap-3 rounded-[1.25rem] bg-slate-100 px-4 text-center sm:aspect-[4/3] sm:min-h-[420px] sm:gap-4 sm:rounded-[1.5rem] sm:px-6">
          <div className="rounded-full bg-white p-3 text-slate-500 shadow-sm sm:p-4">
            <ImageOff className="h-8 w-8 sm:h-12 sm:w-12" />
          </div>
          <p className="max-w-[15rem] text-sm font-medium text-slate-600 sm:max-w-sm sm:text-base">
            Este producto no tiene imágenes disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-2.5 shadow-sm sm:rounded-[1.75rem] sm:p-4">
      <div
        className={cn(
          'grid gap-3 sm:gap-4',
          images.length > 1 && 'xl:grid-cols-[88px_minmax(0,1fr)]'
        )}
      >
        {images.length > 1 && (
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:max-h-[36rem] xl:flex-col xl:gap-3 xl:overflow-y-auto xl:pb-0 xl:pr-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={cn(
                  'relative h-16 w-16 flex-none overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-20 sm:w-20 sm:rounded-2xl',
                  activeIndex === index
                    ? 'border-primary shadow-sm ring-2 ring-primary/15'
                    : 'hover:border-slate-300 hover:bg-slate-100'
                )}
                onMouseEnter={() => selectImage(index)}
                onFocus={() => selectImage(index)}
                onClick={() => selectImage(index)}
                aria-pressed={activeIndex === index}
                aria-label={`Mostrar imagen ${index + 1}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[0.85rem] bg-white">
                  <ImageWithFallback
                    src={image}
                    alt={`Miniatura del producto ${index + 1}`}
                    fill
                    sizes="88px"
                    className="object-cover"
                    fallbackClassName="h-full w-full rounded-[0.85rem]"
                    showRetry={false}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="relative order-1 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50 xl:order-2">
          <div
            className="relative aspect-square min-h-[240px] w-full sm:aspect-[4/3] sm:min-h-[420px]"
            onMouseMove={handleZoom}
          >
            <ImageWithFallback
              src={selectedImage}
              alt={`Imagen del producto ${activeIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 85vw, 900px"
              className="object-contain transition-transform duration-300 ease-out"
              fallbackClassName="h-full w-full rounded-[1.5rem]"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>
          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/95 shadow-sm sm:left-3 sm:h-10 sm:w-10"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Imagen anterior</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/95 shadow-sm sm:right-3 sm:h-10 sm:w-10"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Siguiente imagen</span>
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/95 shadow-sm sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
            onClick={toggleZoom}
          >
            {zoomLevel === 1 ? (
              <ZoomIn className="h-4 w-4" />
            ) : (
              <ZoomOut className="h-4 w-4" />
            )}
            <span className="sr-only">
              {zoomLevel === 1 ? 'Acercar imagen' : 'Restablecer zoom'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
