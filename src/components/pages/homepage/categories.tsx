import { Section } from '@/components/shared/carousel/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { Card, CardContent, CardTitle } from '@/components/shared/card/card'
import Image from 'next/image'
import { AspectRatio } from '@/components/shared/aspect-ratio'
import { getTranslations } from 'next-intl/server'
import { ALL_COLLECTIONS } from '@/libs/queries/products'
import { vendureFetch } from '@/libs/vendure'
import Link from 'next/link'

async function fetchCollections() {
  const { data, error } = await vendureFetch({
    query: ALL_COLLECTIONS,
    variables: {
      options: {
        topLevelOnly: true,
        take: 20,
      },
    },
  })

  if (error || !data?.collections.items) {
    console.error('Error fetching collections:', error)
    return null
  }

  return data.collections.items
}
export const CategoriesSection = async () => {
  const collections = await fetchCollections()
  if (!collections) return null

  const t = await getTranslations('homepage.categories-section')
  return (
    <Section title={t('title')}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6 lg:-ml-8">
          {collections.map((collection, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 pl-3 sm:basis-[28%] md:basis-1/5 md:pl-6 lg:basis-1/6 lg:pl-8"
            >
              <Link href={`/catalog/${collection.slug}`} className="block h-full">
                <Card className="flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border/40 p-2 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md md:rounded-2xl md:p-3">
                  <CardContent className="relative flex flex-1 flex-col items-start gap-3 p-0 md:gap-4">
                    <HoverImage
                      imageUrl={collection.featuredAsset?.preview || ''}
                    />

                    <CardTitle className="px-1 text-sm font-semibold leading-tight text-gray-800 md:text-base break-words text-center w-full">
                      {collection.name}
                    </CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}

const HoverImage = async ({ imageUrl }: { imageUrl: string }) => {
  return (
    <AspectRatio
      className="group relative w-full overflow-hidden rounded-lg md:rounded-xl"
      ratio={1 / 1}
    >
      <Image
        src={imageUrl}
        alt="Your image"
        fill
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
      />
    </AspectRatio>
  )
}
