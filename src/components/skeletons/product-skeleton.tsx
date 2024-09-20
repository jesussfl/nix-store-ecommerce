import React from 'react'
import { Skeleton } from './ui/skeleton'

const ProductSkeleton = ({
  extraClassname,
  numberProducts,
}: {
  extraClassname: string
  numberProducts: number
}) => {
  const productSkeletons = Array.from(
    { length: numberProducts },
    (_, index) => (
      <div
        key={index}
        className={`border-border-primary flex justify-between overflow-hidden rounded-md border border-solid ${extraClassname === 'cart-ord-mobile' ? 'flex-row sm:flex-col' : 'flex-col'}`}
      >
        <Skeleton className="aspect-[2/3] w-full rounded-b-none" />
        <div className="flex flex-col justify-between gap-2.5 p-3.5">
          <Skeleton className="full h-5" />
          <Skeleton className="h-5 w-[200px]" />
        </div>
      </div>
    )
  )

  return (
    <div
      className={`grid gap-x-3.5 gap-y-6 sm:gap-y-9 ${extraClassname === 'colums-mobile' ? 'grid-cols-auto-fill-110' : ''} ${extraClassname === 'cart-ord-mobile' ? 'grid-cols-1' : ''} sm:grid-cols-auto-fill-250`}
    >
      {productSkeletons}
    </div>
  )
}

export default ProductSkeleton
