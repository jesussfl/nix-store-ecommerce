import { Suspense } from 'react'
import ProductSkeleton from '@/components/skeletons/product-skeleton'
import { getTranslations } from 'next-intl/server'
import { SSGQuery } from '@/graphql/client'
import { ProductSearchSelector } from '@/graphql/selectors'
import { SortOrder } from '@/zeus'
import Header from '@/components/shared/header'
import { Section } from '@/components/shared/carousel/section'
import * as motion from 'framer-motion/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import { SingleProduct } from '@/components/products/single-product'
const Home = async ({ params: { lng } }: { params: { lng: string } }) => {
  // const api = SSGQuery({ locale: lng })

  // const products = await api({
  //   search: [
  //     {
  //       input: {
  //         take: 4,
  //         groupByProduct: true,
  //         sort: { price: SortOrder.ASC },
  //       },
  //     },
  //     { items: ProductSearchSelector },
  //   ],
  // })

  // console.log(products.search.items.length)
  return (
    <>
      <Header />
      <Section title="Disponibilidad inmediata">
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
              >
                <SingleProduct
                  product={{
                    name: 'Shoes',
                    priceInUSD: 200,

                    lastPriceInUSD: 300,
                    type: 'Disponibilidad inmediata',
                    image:
                      'https://images.unsplash.com/photo-1600185365483-26d7a4cc4a30?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>
      <Section title="Productos por encargo">
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
              >
                <SingleProduct
                  product={{
                    name: 'Shoes',
                    priceInUSD: 100,
                    lastPriceInUSD: 200,
                    type: 'Por encargo',
                    image:
                      'https://images.unsplash.com/photo-1600185365483-26d7a4cc4a30?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>
      <Section title="Productos personalizados" variant={'dark'}>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
              >
                <SingleProduct
                  product={{
                    name: 'Shoes',
                    priceInUSD: 100,
                    lastPriceInUSD: 200,
                    type: 'Personalizados',
                    image:
                      'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Section>
    </>
  )
}
// <section className="pt-14">

/* <Suspense
        fallback={<ProductSkeleton extraClassname="" numberProducts={18} />}
      >
        <AllProducts />
      </Suspense> */

/* </section> */

const AllProducts = async () => {
  return <p>Here will be all products</p>
}

export default Home
