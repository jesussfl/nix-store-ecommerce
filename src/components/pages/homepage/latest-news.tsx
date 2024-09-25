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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shared/alert-dialog'
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
  const t = await getTranslations('homepage.latest-news-section')
  return (
    <Section title={t('title')}>
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
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
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
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[90vh] max-w-7xl p-2">
                  <AlertDialogHeader>
                    <AspectRatio
                      className="relative h-auto w-[100%] overflow-hidden rounded-sm"
                      ratio={16 / 9}
                    >
                      <Image
                        src={slide.image}
                        alt="Your image"
                        width={600}
                        height={800}
                        className="h-full w-full object-cover"
                      />
                    </AspectRatio>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}
