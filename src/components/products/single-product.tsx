import { Card, CardContent, CardTitle } from '@/components/shared/card/card'
import Image from 'next/image'
import { Badge } from '@/components/shared/badge'
import { Button } from '@/components/shared/button'
import { RiEyeLine, RiShoppingCartLine } from '@remixicon/react'
import { AspectRatio } from '../shared/aspect-ratio'
type ProductCardInfo = {
  name: string
  image: string
  priceInUSD: number
  lastPriceInUSD: number
  type: string
}
type Props = {
  product: ProductCardInfo
}
export const SingleProduct = async ({ product }: Props) => {
  return (
    <Card className="flex cursor-pointer flex-col gap-2 rounded-sm border-0 p-1 shadow-none hover:border hover:border-primary md:rounded-md md:p-2">
      <CardContent className="relative flex flex-col items-start gap-2 p-0 md:gap-4">
        <HoverImage imageUrl={product.image} />
        <Badge
          variant={'secondary'}
          className="right-2 top-2 z-10 rounded-full px-2 py-1 text-white md:absolute md:inline"
        >
          <p className="line-clamp-1 text-[0.6rem] font-medium">
            {product.type}
          </p>
        </Badge>
        <div className="flex w-full flex-col">
          <CardTitle className="line-clamp-2 text-sm font-medium text-gray-600 md:text-base md:font-semibold">
            {product.name}
          </CardTitle>
          <div className="flex w-full flex-1 justify-between">
            <p className="text-base font-semibold text-primary">
              ${product.priceInUSD}
            </p>
            <p className="text-sm font-medium text-gray-400 line-through">
              ${product.lastPriceInUSD}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const HoverImage = async ({ imageUrl }: { imageUrl: string }) => {
  return (
    <AspectRatio
      className="group relative overflow-hidden rounded-sm"
      ratio={1 / 1}
    >
      {/* Image with blur and dark filter on hover */}
      <Image
        src={imageUrl}
        alt="Your image"
        fill
        className="h-full w-full object-cover transition duration-300 md:group-hover:scale-125 md:group-hover:brightness-50"
      />

      <div className="absolute inset-0 hidden flex-col gap-4 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex md:flex-row md:items-center md:justify-center">
        <Button variant="secondary" size={'lg'} className="md:w-[50%]">
          Ver más <RiEyeLine className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="secondary" size={'lg'} className="md:w-[50%]">
          Añadir
          <RiShoppingCartLine className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </AspectRatio>
  )
}
