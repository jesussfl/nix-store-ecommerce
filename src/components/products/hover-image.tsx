'use client'

import { AspectRatio } from '../shared/aspect-ratio'
import { ImageOff } from 'lucide-react'
import { optimizeImage } from '@/utils/optimizeImage'
import { ImageWithFallback } from '../shared/image-with-fallback/image-with-fallback'

export const HoverImage = ({
  imageUrl,
  productName,
}: {
  imageUrl: string | undefined
  productName: string
}) => {
  return (
    <AspectRatio
      className="group relative w-full overflow-hidden rounded-lg md:rounded-xl"
      ratio={4 / 5}
    >
      {imageUrl ? (
        <ImageWithFallback
          src={optimizeImage({ size: 'popup', src: imageUrl }) || ''}
          alt={`Product image of ${productName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-hover:brightness-90"
          fallbackClassName="h-full w-full rounded-lg md:rounded-xl"
          loading="lazy"
          showRetry={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg md:rounded-xl border border-border/40 bg-gray-50 bg-feature-texture bg-cover bg-no-repeat p-4 text-center shadow-sm">
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
