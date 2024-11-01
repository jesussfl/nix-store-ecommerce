'use client'

import Image from 'next/image'
import { AspectRatio } from '../shared/aspect-ratio'
import { Eye, ImageOff, ShoppingCart } from 'lucide-react'
import { Button } from '../shared/button'
import { optimizeImage } from '@/utils/optimizeImage'

export const HoverImage = ({
  imageUrl,
  productName,
}: {
  imageUrl: string | undefined
  productName: string
}) => {
  return (
    <AspectRatio
      className="group relative overflow-hidden rounded-sm"
      ratio={4 / 5}
    >
      {imageUrl ? (
        <Image
          src={optimizeImage({ size: 'popup', src: imageUrl }) || ''}
          alt={`Product image of ${productName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg'
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-sm border border-border bg-gray-50 bg-feature-texture bg-cover bg-no-repeat p-4 text-center">
          <ImageOff
            className="mb-2 h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-gray-500 md:text-base">
            No image available
          </p>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* <Button variant="secondary" size="sm" className="w-full">
          View details <Eye className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" className="w-full">
          Add to cart <ShoppingCart className="ml-2 h-4 w-4" />
        </Button> */}
      </div>
    </AspectRatio>
  )
}
