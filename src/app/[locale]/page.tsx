import { Suspense } from 'react'
import ProductSkeleton from '@/components/skeletons/product-skeleton'
import { getTranslations } from 'next-intl/server'
import { SSGQuery } from '@/graphql/client'
import { ProductSearchSelector } from '@/graphql/selectors'
import { SortOrder } from '@/zeus'

import Hero from '@/components/shared/hero'

const Home = async ({ params: { lng } }: { params: { lng: string } }) => {
  const api = SSGQuery({ locale: lng })

  const products = await api({
    search: [
      {
        input: {
          take: 4,
          groupByProduct: true,
          sort: { price: SortOrder.ASC },
        },
      },
      { items: ProductSearchSelector },
    ],
  })

  console.log(products.search.items.length)
  return (
    <section className="pt-14">
      <Header />
      <Suspense
        fallback={<ProductSkeleton extraClassname="" numberProducts={18} />}
      >
        <AllProducts />
      </Suspense>
    </section>
  )
}

const AllProducts = async () => {
  return <p>Here will be all products</p>
}

export default Home

const Header = async () => {
  const t = await getTranslations('homepage')

  return (
    <header className="mx-2 flex flex-col overflow-hidden rounded-3xl md:mx-8 md:flex-row">
      <Hero />
      <div className="flex h-[550px] items-center justify-center bg-gray-200 md:w-[50%] lg:h-[650px]">
        <p>Image</p>
      </div>
    </header>
  )
}
