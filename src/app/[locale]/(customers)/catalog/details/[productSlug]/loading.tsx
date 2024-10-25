import { Skeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="space-y-8 px-4 py-8">
      <div className="flex flex-col gap-12 md:px-8 lg:flex-row lg:gap-8 lg:px-16 2xl:px-56">
        <div className="flex flex-1 flex-col gap-4">
          <GallerySkeleton />
          <div className="hidden lg:block">
            <DescriptionSkeleton />
          </div>
        </div>
        <ProductDetailsSkeleton />
        <div className="block lg:hidden">
          <DescriptionSkeleton />
        </div>
      </div>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="flex h-[500px] w-full flex-col-reverse items-center justify-center gap-4 rounded-lg border p-2 sm:h-[700px] md:p-6 xl:flex-row">
      <div className="hidden h-[500px] w-1/5 xl:block">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="mb-4 h-20 w-[80%] xl:hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="relative h-full w-full flex-1 overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="space-y-10 rounded-lg md:border md:p-6 lg:sticky lg:top-32 lg:w-[450px] lg:self-start">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

function DescriptionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}
