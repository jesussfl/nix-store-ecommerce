import { Section } from '@/components/shared/carousel/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { SingleProduct } from '@/components/products/single-product'

const products = [
  {
    name: 'Anillo de ojo morado',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product1.webp',
  },
  {
    name: 'Llaveros de Hello Kitty',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product2.webp',
  },
  {
    name: 'Pulseras de cuero negras',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product3.webp',
  },
  {
    name: 'Collar de corazón',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product4.webp',
  },
  {
    name: 'Cinturón de cuero de corazón',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product5.webp',
  },
  {
    name: 'Peluche de Hollow Knight',
    priceInUSD: 4.99,
    lastPriceInUSD: 5.99,
    type: 'Disponibilidad inmediata',
    image: '/assets/products/product6.webp',
  },
]

export const ImmediatelyAvailableProductsSection = () => {
  return (
    <Section title="Productos de disponibilidad inmediata">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-0">
          {products.map((product, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
            >
              <SingleProduct
                product={{
                  name: product.name,
                  priceInUSD: product.priceInUSD,
                  lastPriceInUSD: product.lastPriceInUSD,
                  type: product.type,
                  image: product.image,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}

export const CustomMadeProductsSection = () => {
  return (
    <Section title="Productos por encargo">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-0">
          {products.map((product, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
            >
              <SingleProduct
                product={{
                  name: product.name,
                  priceInUSD: product.priceInUSD,
                  lastPriceInUSD: product.lastPriceInUSD,
                  type: product.type,
                  image: product.image,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}

export const CustomizedProductsSection = () => {
  return (
    <Section title="Productos personalizados" variant={'dark'}>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-0">
          {products.map((product, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
            >
              <SingleProduct
                product={{
                  name: product.name,
                  priceInUSD: product.priceInUSD,
                  lastPriceInUSD: product.lastPriceInUSD,
                  type: product.type,
                  image: product.image,
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}
