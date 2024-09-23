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
    <Card className="flex flex-col gap-2 border-0 p-2 pt-1 shadow-none">
      <CardHeader className="relative aspect-square overflow-hidden rounded-sm p-0">
        <Badge
          variant={'secondary'}
          className="absolute right-2 top-2 z-10 rounded-full px-4 py-2 text-white"
        >
          {product.type}
        </Badge>
        <HoverImage />
      </CardHeader>
      <CardContent className="flex flex-col items-start p-0">
        <CardTitle className="line-clamp-2 text-base font-semibold text-gray-600">
          {product.name}
        </CardTitle>
        <CardFooter className="flex w-full justify-between p-0">
          <p className="text-xl font-semibold text-primary">
            ${product.priceInUSD} USD
          </p>
          <p className="text-sm font-medium text-gray-600">
            ${product.lastPriceInUSD} USD
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

const HoverImage = async () => {
  return (
    <div className="group relative h-full w-full flex-1">
      {/* Image with blur and dark filter on hover */}
      <Image
        src="https://images.unsplash.com/photo-1719937206255-cc337bccfc7d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Your image"
        fill
        className="h-full w-full rounded-sm object-cover transition duration-300 group-hover:scale-125 group-hover:brightness-50"
      />
      {/* <div className="transition duration-300 group-hover:blur-[2px] group-hover:brightness-75">
        </div> */}

      {/* Buttons that appear on hover */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button variant="secondary" size={'lg'} className="w-[50%]">
          Ver más <RiEyeLine className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="secondary" size={'lg'} className="w-[50%]">
          Añadir
          <RiShoppingCartLine className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
