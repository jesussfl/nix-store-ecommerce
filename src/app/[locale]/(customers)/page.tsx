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

const Home = async () => {
  return (
    <div className="w-full max-w-[120rem]">
      <Header />
      <main>
        <WeOfferSection />
        <CategoriesSection />
        <LatestNews />
        <CoolSection />
        <ImmediatelyAvailableProductsSection />
        <CustomMadeProductsSection />
        <BrandsSection />
        {/* <MetricsSection /> */}
        <CustomizedProductsSection />
        <CollectionsSection />
        <FaqsSection />
      </main>
    </div>
  )
}

export default Home
