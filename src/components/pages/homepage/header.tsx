import { Suspense } from 'react'
import Hero from './hero'
import { CarouselPlugin } from '../../shared/header/carousel'

const Header = () => {
  return (
    <header className="mx-auto my-8 max-w-[110rem] px-4 sm:px-6 md:my-12 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 lg:rounded-[2rem]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="grid items-center gap-2 lg:grid-cols-[0.92fr_1.08fr] lg:gap-0">
          <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
            <Suspense fallback={<HeroSkeleton />}>
              <Hero />
            </Suspense>
          </div>
          <div className="px-4 pb-5 sm:px-6 sm:pb-7 lg:p-6 lg:pl-0 xl:p-8 xl:pl-0">
            <CarouselPlugin />
          </div>
        </div>
      </div>
    </header>
  )
}

const HeroSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
    <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />
    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
    <div className="h-12 w-48 animate-pulse rounded bg-gray-200" />
  </div>
)

export default Header
