import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
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
export const SingleProduct = async ({
  product,
}: {
  product: ProductCardInfo
}) => {
  return (
    <Card className="flex flex-col gap-2 rounded-sm border-0 p-1 shadow-none md:rounded-md md:p-2">
      <CardContent className="flex flex-col items-start gap-2 p-0 md:gap-4">
        <Badge
          variant={'secondary'}
          className="absolute top-3 z-10 line-clamp-1 hidden rounded-full px-2 py-1 text-white md:right-2"
        >
          {product.type}
        </Badge>
        <HoverImage />
        <Badge
          variant={'secondary'}
          className="line-clamp-1 rounded-full text-white md:right-2 md:hidden"
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

const HoverImage = async () => {
  return (
    <AspectRatio
      className="group relative overflow-hidden rounded-sm"
      ratio={1 / 1}
    >
      {/* Image with blur and dark filter on hover */}
      <Image
        src="https://images.unsplash.com/photo-1719937206255-cc337bccfc7d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
