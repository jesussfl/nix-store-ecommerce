import { Card, CardContent, CardTitle } from '@/components/shared/card/card'
import Image from 'next/image'
import { Badge } from '@/components/shared/badge'
import { Button } from '@/components/shared/button'
import { RiEyeLine, RiShoppingCartLine } from '@remixicon/react'
import { AspectRatio } from '../shared/aspect-ratio'
import { optimizeImage } from '@/utils/optimizeImage'

export type ProductCardInfo = {
  id: string
  name: string
  image: string | undefined
  priceInUSD: string
  lastPriceInUSD: number
  type: string
}

type Props = {
  product: ProductCardInfo
}

export const SingleProduct = async ({ product }: Props) => {
  return (
    <Card className="flex h-full cursor-pointer flex-col gap-2 rounded-sm border border-border p-1 shadow-none hover:border hover:border-primary md:rounded-md md:p-2">
      <CardContent className="relative flex flex-col items-start gap-2 p-0">
        <HoverImage imageUrl={product.image} />
        <Badge
          variant={'secondary'}
          className="right-2 top-2 z-10 rounded-full bg-black/80 px-2 py-1 text-white md:absolute md:inline"
        >
          <p className="line-clamp-1 text-[0.6rem] font-semibold">
            {product.type}
          </p>
        </Badge>
        <div className="flex w-full flex-col">
          <CardTitle className="line-clamp-2 text-sm font-medium text-gray-600 md:text-base">
            {product.name}
          </CardTitle>
          <div className="flex w-full flex-1 justify-between">
            <p className="text-sm font-medium text-primary md:text-base">
              {product.priceInUSD}
            </p>
            {/* <p className="text-sm font-medium text-gray-400 line-through">
              ${product.lastPriceInUSD}
            </p> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const HoverImage = async ({ imageUrl }: { imageUrl: string | undefined }) => {
  return (
    <AspectRatio
      className="group relative overflow-hidden rounded-sm"
      ratio={4 / 5}
    >
      {imageUrl === undefined ? (
        <div className="h-full w-full rounded-sm border border-border bg-gray-50 bg-feature-texture bg-cover bg-no-repeat p-1 md:p-4" />
      ) : (
        <Image
          src={optimizeImage({ size: 'popup', src: imageUrl }) || ''}
          loading="lazy"
          alt="Product image"
          fill
          className="h-full w-full object-cover transition duration-300 md:group-hover:scale-[110%] md:group-hover:brightness-50"
        />
      )}

      <div className="absolute inset-0 hidden flex-col gap-4 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex md:items-center md:justify-end">
        <Button variant="secondary" size={'sm'} className="w-full">
          Ver más <RiEyeLine className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="secondary" size={'sm'} className="w-full">
          Añadir
          <RiShoppingCartLine className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </AspectRatio>
  )
}
