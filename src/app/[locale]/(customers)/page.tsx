import Header from '@/components/pages/homepage/header'
import {
  CustomizedProductsSection,
  CustomMadeProductsSection,
  ImmediatelyAvailableProductsSection,
} from '@/components/pages/homepage/featured-products'
import { CategoriesSection } from '@/components/pages/homepage/categories'
import { WeOfferSection } from '@/components/pages/homepage/we-offer'
import { LatestNews } from '@/components/pages/homepage/latest-news'
import { FaqsSection } from '@/components/pages/homepage/faqs'
import BrandsSection from '@/components/pages/homepage/brands'
import { CollectionsSection } from '@/components/pages/homepage/collections'
import CoolSection from '@/components/pages/homepage/cool-section'
import { MetricsSection } from '@/components/pages/homepage/metrics'
import StepsCtaSection from '@/components/pages/homepage/steps-cta'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'
import { GET_STOREFRONT_NEWS } from '@/libs/queries/homepage'

const Home = async () => {
  const { data } = await vendureFetchSSR({
    query: GET_STOREFRONT_NEWS,
    tags: ['storefront-news'],
    revalidate: 60,
  })

  return (
    <div className="w-full">
      <Header />
      <main className="space-y-16 sm:space-y-24">
        <WeOfferSection />
        <CategoriesSection />
        <LatestNews items={data?.storefrontNews ?? []} />
        <CoolSection />
        <ImmediatelyAvailableProductsSection />
        <CustomMadeProductsSection />
        <StepsCtaSection />
        <BrandsSection />
        <MetricsSection />
        <CustomizedProductsSection />
        <CollectionsSection />
        <FaqsSection />
      </main>
    </div>
  )
}

export default Home
