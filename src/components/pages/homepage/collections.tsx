import { Section } from '@/components/shared/carousel/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { Card, CardContent } from '@/components/shared/card/card'
import Image from 'next/image'
import { AspectRatio } from '@/components/shared/aspect-ratio'
import { getTranslations } from 'next-intl/server'
import { vendureFetch } from '@/libs/vendure'
import { GET_COLLECTION } from '@/libs/queries/collection'
import Link from 'next/link'

async function fetchCollections() {
  const { data, error } = await vendureFetch({
    cache: 'no-cache',
    query: GET_COLLECTION,
    variables: {
      slug: 'colecciones-especiales',
    },
  })
  if (error || !data?.collection) {
    console.error('Error fetching collections:', error)
    return null
  }

  return data.collection
}
export const CollectionsSection = async () => {
  const collections = await fetchCollections()
  if (!collections) return null
  const subCollections = collections.children

  const t = await getTranslations('homepage.collections-section')
  return (
    <Section title={t('title')}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-0">
          {subCollections?.map((collection, index) => (
            <CarouselItem
              key={index}
              className="basis-1/4 pl-2 md:basis-1/6 md:pl-6 lg:basis-1/6 lg:pl-9"
            >
              <Link href={`/catalog/${collection.slug}`}>
                <Card className="flex cursor-pointer flex-col gap-2 rounded-sm border-0 p-1 shadow-none hover:border hover:border-primary md:rounded-md md:p-2">
                  <CardContent className="relative flex flex-col items-start gap-2 p-0 md:gap-4">
                    <HoverImage
                      imageUrl={collection.featuredAsset?.preview || ''}
                    />
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
      className="group relative overflow-hidden rounded-sm"
      ratio={1 / 1}
    >
      <Image
        src={imageUrl}
        alt="Your image"
        fill
        className="h-full w-full rounded-sm border border-border object-contain object-center transition duration-300 md:group-hover:scale-125"
      />
    </AspectRatio>
  )
}
