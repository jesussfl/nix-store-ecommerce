import Header from '@/components/shared/header'
import { Navbar } from '@/components/shared/floating-nav'
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
import { MetricsSection } from '@/components/pages/homepage/metrics'
import { CollectionsSection } from '@/components/pages/homepage/collections'

const Home = async () => {
  return (
    <div className="w-full max-w-[90rem]">
      <Navbar />
      <Header />
      <WeOfferSection />
      <CategoriesSection />
      <LatestNews />
      <ImmediatelyAvailableProductsSection />
      <CustomMadeProductsSection />
      <BrandsSection />
      <MetricsSection />
      <CategoriesSection />
      <CustomizedProductsSection />
      <CollectionsSection />
      <FaqsSection />
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
