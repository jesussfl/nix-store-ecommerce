'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageOff, ChevronUp, ChevronDown } from 'lucide-react'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '')

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
    <div className="flex w-full flex-col-reverse items-center justify-center gap-4 rounded-lg border p-2 md:h-[700px] md:p-6 lg:flex-row">
      <div className="flex flex-row gap-2 overflow-x-auto lg:max-h-[500px] lg:flex-col lg:overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={index}
            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="h-full w-full rounded-sm object-cover"
            />
          </button>
        ))}
      </div>
      <div className="h-full w-full flex-1 rounded-md bg-slate-100">
        <Image
          src={selectedImage}
          alt="Selected product image"
          width={500}
          height={500}
          className="h-full w-full rounded-sm object-contain"
        />
      </div>
    </div>
  )
}
