'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '')

  if (images.length === 0) {
    return (
      <div className="h-auto flex-1 rounded-lg border-2 p-4">
        <div className="flex h-[500px] flex-col items-center justify-center rounded-lg bg-slate-100">
          <ImageOff className="mb-4 h-16 w-16" />
          <p className="text-center text-lg font-medium">
            Este producto no tiene imágenes disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse items-center justify-center gap-4 rounded-lg md:border-2 md:p-6 lg:flex-1 lg:flex-row">
      <div className="flex flex-col gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className="h-20 w-20 overflow-hidden rounded-md border border-gray-200"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="flex-1">
        <Image
          src={selectedImage}
          alt="Selected product image"
          width={500}
          height={500}
          className="h-auto w-full rounded-sm"
        />
      </div>
    </div>
  )
}
