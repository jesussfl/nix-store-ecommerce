import { Suspense } from 'react'
import ProductSkeleton from '@/components/skeletons/product-skeleton'
import { getTranslations } from 'next-intl/server'
import { SSGQuery } from '@/graphql/client'
import { ProductSearchSelector } from '@/graphql/selectors'
import { SortOrder } from '@/zeus'

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
