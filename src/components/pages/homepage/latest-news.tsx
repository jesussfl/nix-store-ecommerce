'use client'

import { useState } from 'react'
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
import { useTranslations } from 'next-intl'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shared/alert-dialog'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import { Button } from '@/components/shared/button'
import type { GetStorefrontNewsQuery } from '@/graphql/graphql'

const fallbackSlides = [
  {
    id: 'fallback-collares',
    title: 'Collares',
    image: '/assets/slideshow/slideshow1.png',
    summary: 'Nuevos diseños de collares elegantes y modernos.',
    ctaText: 'Ver más',
    ctaLink: null,
  },
  {
    id: 'fallback-pulseras',
    title: 'Pulseras',
    image: '/assets/slideshow/slideshow2.png',
    summary: 'Pulseras artesanales con materiales sostenibles.',
    ctaText: 'Ver más',
    ctaLink: null,
  },
  {
    id: 'fallback-franelas',
    title: 'Franelas',
    image: '/assets/slideshow/slideshow3.jpg',
    summary: 'Colección de franelas con estampados únicos y coloridos.',
    ctaText: 'Ver más',
    ctaLink: null,
  },
]

type LatestNewsItem = {
  id: string
  title: string
  image: string
  summary: string
  ctaText?: string | null
}

type LatestNewsProps = {
  items?: GetStorefrontNewsQuery['storefrontNews']
}

const vendureAssetBaseUrl =
  process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN ||
  'http://localhost:3000'

const resolveNewsImage = (image?: string | null) => {
  if (!image) return '/assets/slideshow/slideshow1.png'
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/')) return `${vendureAssetBaseUrl}${image}`

  return `${vendureAssetBaseUrl}/${image}`
}

export const LatestNews = ({ items = [] }: LatestNewsProps) => {
  const t = useTranslations('homepage.latest-news-section')
  const [openDialog, setOpenDialog] = useState<number | null>(null)
  const slides: LatestNewsItem[] =
    items.length > 0
        ? items.map((item) => ({
            id: item.id,
            title: item.title,
            image: resolveNewsImage(item.imageAsset?.preview),
            summary: item.summary,
            ctaText: item.ctaText,
          }))
      : fallbackSlides

  return (
    <Section title={t('title')}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3 pl-3 sm:pl-4 md:pl-6">
              <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-md md:rounded-2xl">
                <CardHeader className="p-0">
                  <AlertDialog
                    open={openDialog === index}
                    onOpenChange={(open) =>
                      setOpenDialog(open ? index : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <AspectRatio
                        ratio={16 / 9}
                        className="cursor-pointer overflow-hidden"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </AspectRatio>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-h-[90vh] max-w-4xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{slide.title}</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AspectRatio
                        ratio={16 / 9}
                        className="overflow-hidden rounded-md"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                      <p className="text-sm text-muted-foreground">
                        {slide.summary}
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-start p-4 md:p-5">
                  <CardTitle className="mb-2 text-lg font-bold leading-tight text-gray-800 md:mb-3 md:text-xl">{slide.title}</CardTitle>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {slide.summary}
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 md:px-5 md:pb-5">
                  <Button
                    variant="outline"
                    className="rounded-full px-5 font-semibold md:px-6"
                    onClick={() => setOpenDialog(index)}
                  >
                    {slide.ctaText || 'Ver más'}
                  </Button>
                </CardFooter>
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
