import { Skeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="mb-56 space-y-8 bg-feature-texture">
      <div className="w-full">
        <Skeleton className="mx-auto h-[200px] max-w-[300px] rounded-xl" />
      </div>

      <div className="flex items-start md:px-4">
        <aside className="sticky left-0 top-40 hidden flex-col gap-4 md:flex md:w-[20%]">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
        </aside>
        <section className="grid w-screen grid-cols-2 gap-2 px-2 md:w-[80%] md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 25 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </section>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 rounded-md border p-2">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-auto" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
