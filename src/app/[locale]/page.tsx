import Header from '@/components/shared/header'
import { Navbar } from '@/components/shared/floating-nav'
import {
  CustomizedProductsSection,
  CustomMadeProductsSection,
  ImmediatelyAvailableProductsSection,
} from '@/components/pages/homepage/featured-products'
import { CategoriesSection } from '@/components/pages/homepage/categories'
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
import { WeOfferSection } from '@/components/pages/homepage/we-offer'
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
const Home = async () => {
  return (
    <div className="w-full max-w-[90rem]">
      <Navbar />
      <Header />
      <CategoriesSection />
      <WeOfferSection />
      <Section title={`Lo último`}>
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
      <ImmediatelyAvailableProductsSection />
      <CustomMadeProductsSection />
      <CustomizedProductsSection />
    </div>
  )
}

export default Home

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
