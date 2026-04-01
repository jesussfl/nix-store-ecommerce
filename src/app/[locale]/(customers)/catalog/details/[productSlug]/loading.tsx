import { Skeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,420px)] xl:items-start">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <GallerySkeleton />
            <div className="hidden xl:block">
              <DescriptionSkeleton />
            </div>
          </div>
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <ProductDetailsSkeleton />
            <div className="xl:hidden">
              <DescriptionSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GallerySkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-2.5 shadow-sm sm:rounded-[1.75rem] sm:p-4">
      <div className="grid gap-4 xl:grid-cols-[88px_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:flex-col xl:overflow-visible xl:pb-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-16 w-16 flex-none rounded-xl border border-slate-200 sm:h-20 sm:w-20 sm:rounded-2xl"
            />
          ))}
        </div>
        <Skeleton className="order-1 aspect-square w-full rounded-[1.25rem] sm:aspect-[4/3] sm:rounded-[1.5rem] xl:order-2" />
      </div>
    </div>
  )
}

function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:rounded-[1.75rem] sm:p-6 xl:sticky xl:top-28">
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-20 rounded-full" />
          <Skeleton className="h-11 w-24 rounded-full" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="grid max-w-xs grid-cols-[48px_minmax(0,1fr)_48px] gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}

function DescriptionSkeleton() {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}
