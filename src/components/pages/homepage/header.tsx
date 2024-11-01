import { Suspense } from 'react'
import Hero from './hero'
import { CarouselPlugin } from '../../shared/header/carousel'

const Header = () => {
  return (
    <header className="mx-auto my-20 max-w-[100rem] px-4 sm:px-6 md:my-8 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-dark bg-hero-texture bg-cover bg-no-repeat shadow-xl lg:rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <div className="flex-1 px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
            <Suspense fallback={<HeroSkeleton />}>
              <Hero />
            </Suspense>
          </div>
          <div className="flex-1 px-6 pb-8 sm:px-10 sm:pb-12 lg:px-0 lg:pb-0 lg:pr-8">
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
