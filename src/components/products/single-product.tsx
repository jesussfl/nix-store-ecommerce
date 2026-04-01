import Link from 'next/link'

import { Card, CardContent, CardTitle } from '@/components/shared/card/card'
import { Badge } from '@/components/shared/badge'
import { HoverImage } from './hover-image'

export type ProductCardInfo = {
  id: string
  name: string
  image: string | undefined
  priceInEUR: string
  lastPriceInEUR: number
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
    <Link href={`/catalog/details/${product.slug}`} passHref className="block h-full">
      <Card className="group flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border/40 p-2 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md md:rounded-2xl md:p-3">
        <CardContent className="relative flex flex-1 flex-col items-start gap-3 p-0">
          <HoverImage imageUrl={product.image} productName={product.name} />
          <Badge
            variant="secondary"
            className="right-2 top-2 z-10 rounded-full bg-black/80 px-2 py-1 text-white md:absolute md:inline"
          >
            <span className="line-clamp-1 text-[0.6rem] font-semibold">
              {product.type}
            </span>
          </Badge>
          <div className="flex w-full flex-1 flex-col gap-1 px-1">
            <CardTitle className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800 md:text-base">
              {product.name}
            </CardTitle>
            <div className="mt-1 flex w-full flex-1 items-end justify-between gap-2">
              <p className="whitespace-nowrap text-xs font-bold leading-none text-primary sm:text-sm">
                {product.priceInEUR}
              </p>
              {product.priceInBs && (
                <Badge
                  variant="success"
                  className="hidden shrink-0 bg-slate-600 text-[11px] md:block"
                >
                  {product.priceInBs}
                </Badge>
              )}
            </div>
            <Badge
              variant="success"
              className="mt-1 self-start bg-slate-600 text-[11px] md:hidden"
            >
              {product.priceInBs}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
