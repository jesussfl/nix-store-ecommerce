import { Suspense } from 'react'
import ProductSkeleton from '@/components/skeletons/product-skeleton'
import { getTranslations } from 'next-intl/server'
const Home = async ({ params: { lng } }: { params: { lng: string } }) => {
  const t = await getTranslations('homepage')
  return (
    <section className="pt-14">
      <h1>{t('hero-h1')}</h1>
      <Suspense
        fallback={<ProductSkeleton extraClassname="" numberProducts={18} />}
      >
        <AllProducts />
      </Suspense>
    </section>
  )
}

const AllProducts = async () => {
  return <p>Products</p>
}

export default Home
