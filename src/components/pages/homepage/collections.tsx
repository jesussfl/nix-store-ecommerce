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
const categories = [
  {
    name: 'Collares',
    image: '/assets/brands/one-piece.png',
  },
  {
    name: 'Pulseras',
    image: '/assets/brands/Pokemon.png',
  },
  {
    name: 'Franelas',
    image: '/assets/brands/Naruto.png',
  },
  {
    name: 'Zapatos',
    image: '/assets/brands/Hatsune.png',
  },
  {
    name: 'Anillos',
    image: '/assets/brands/Frieren.png',
  },

  {
    name: 'Collares',
    image: '/assets/brands/one-piece.png',
  },
  {
    name: 'Pulseras',
    image: '/assets/brands/Pokemon.png',
  },
  {
    name: 'Franelas',
    image: '/assets/brands/Naruto.png',
  },
  {
    name: 'Zapatos',
    image: '/assets/brands/Hatsune.png',
  },
  {
    name: 'Anillos',
    image: '/assets/brands/Frieren.png',
  },
]
export const CollectionsSection = async () => {
  const t = await getTranslations('homepage')
  return (
    <Section title={`Colecciones de Productos`}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-0">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="basis-1/4 pl-2 md:basis-1/6 md:pl-6 lg:basis-1/6 lg:pl-9"
            >
              <Card className="flex cursor-pointer flex-col gap-2 rounded-sm border-0 p-1 shadow-none hover:border hover:border-primary md:rounded-md md:p-2">
                <CardContent className="relative flex flex-col items-start gap-2 p-0 md:gap-4">
                  <HoverImage imageUrl={category.image} />

                  {/* <CardTitle className="line-clamp-2 text-sm font-medium text-gray-600 md:text-base md:font-semibold">
                    {category.name}
                  </CardTitle> */}
                </CardContent>
              </Card>
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
