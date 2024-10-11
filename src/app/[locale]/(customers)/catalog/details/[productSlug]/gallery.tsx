'use client'
import Image from 'next/image'
import { useState } from 'react'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="flex gap-4">
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
          className="h-auto w-full rounded-lg"
        />
      </div>
    </div>
  )
}
