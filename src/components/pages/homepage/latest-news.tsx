import { Section } from '@/components/shared/carousel/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { AspectRatio } from '@/components/shared/aspect-ratio'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
const slideshow = [
  {
    name: 'Collares',
    image: '/assets/slideshow/slideshow1.png',
  },
  {
    name: 'Pulseras',
    image: '/assets/slideshow/slideshow2.png',
  },
  {
    name: 'Franelas',
    image: '/assets/slideshow/slideshow3.jpg',
  },
]
export const LatestNews = async () => {
  const t = await getTranslations('homepage')
  return (
    <Section title={t('latest-news-title')}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {slideshow.map((slide, index) => (
            <CarouselItem key={index} className="">
              <AspectRatio
                className="group relative basis-1/3 overflow-hidden rounded-sm"
                ratio={16 / 9}
              >
                <Image
                  src={slide.image}
                  alt="Your image"
                  fill
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}
