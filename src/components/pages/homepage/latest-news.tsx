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

const slideshow = [
  {
    name: 'Collares',
    image: '/assets/slideshow/slideshow1.png',
    description: 'Nuevos diseños de collares elegantes y modernos.',
  },
  {
    name: 'Pulseras',
    image: '/assets/slideshow/slideshow2.png',
    description: 'Pulseras artesanales con materiales sostenibles.',
  },
  {
    name: 'Franelas',
    image: '/assets/slideshow/slideshow3.jpg',
    description: 'Colección de franelas con estampados únicos y coloridos.',
  },
]

export const LatestNews = () => {
  const t = useTranslations('homepage.latest-news-section')
  const [openDialog, setOpenDialog] = useState<number | null>(null)

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
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
                <CardHeader className="p-0">
                  <AlertDialog
                    open={openDialog === index}
                    onOpenChange={() => setOpenDialog(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <AspectRatio
                        ratio={16 / 9}
                        className="cursor-pointer overflow-hidden"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </AspectRatio>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-h-[90vh] max-w-4xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{slide.name}</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AspectRatio
                        ratio={16 / 9}
                        className="overflow-hidden rounded-md"
                      >
                        <Image
                          src={slide.image}
                          alt={slide.name}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="mb-2 text-lg">{slide.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {slide.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenDialog(index)}
                  >
                    Ver más
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
