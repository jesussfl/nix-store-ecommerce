import Link from 'next/link'

import { Card, CardContent, CardTitle } from '@/components/shared/card/card'
import { Badge } from '@/components/shared/badge'
import { HoverImage } from './hover-image'

export type ProductCardInfo = {
  id: string
  name: string
  image: string | undefined
  priceInUSD: string
  lastPriceInUSD: number
  type: string
  slug: string
  variantId: string
  priceInBs: string
}

type Props = {
  product: ProductCardInfo
}

export const SingleProduct = ({ product }: Props) => {
  return (
    <Link href={`/catalog/details/${product.slug}`} passHref>
      <Card className="group flex h-full cursor-pointer flex-col gap-2 rounded-sm border border-border p-1 shadow-none transition-all duration-300 hover:shadow-md md:rounded-md md:p-2">
        <CardContent className="relative flex flex-col items-start gap-2 p-0">
          <HoverImage imageUrl={product.image} productName={product.name} />
          <Badge
            variant="secondary"
            className="right-2 top-2 z-10 rounded-full bg-black/80 px-2 py-1 text-white md:absolute md:inline"
          >
            <span className="line-clamp-1 text-[0.6rem] font-semibold">
              {product.type}
            </span>
          </Badge>
          <div className="flex w-full flex-col">
            <CardTitle className="line-clamp-2 text-sm font-medium text-gray-600 md:text-base">
              {product.name}
            </CardTitle>
            <div className="flex w-full flex-1 items-center justify-between">
              <p className="text-sm font-medium text-primary md:text-base">
                {product.priceInUSD}
              </p>
              {product.priceInBs && (
                <Badge
                  variant="success"
                  className="hidden bg-slate-600 text-xs md:block"
                >
                  {product.priceInBs}
                </Badge>
              )}
            </div>
            <Badge
              variant="success"
              className="mt-1 self-start bg-slate-600 md:hidden"
            >
              {product.priceInBs}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
