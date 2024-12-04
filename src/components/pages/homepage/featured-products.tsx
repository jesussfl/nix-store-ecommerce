import { Section } from '@/components/shared/carousel/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shared/carousel'
import {
  ProductCardInfo,
  SingleProduct,
} from '@/components/products/single-product'
import { getTranslations } from 'next-intl/server'
import { vendureFetch } from '@/libs/vendure'
import { SEARCH_PRODUCTS } from '@/libs/queries/products'
import { priceFormatter } from '@/utils/price-formatter'
import { CurrencyCode, SearchProductsQuery } from '@/graphql/graphql'
import { GetBCVPrice } from '@/utils/get-bcv-price'

// Utility to fetch and handle product data
async function fetchProducts(collectionSlug: string) {
  const { data, error } = await vendureFetch({
    query: SEARCH_PRODUCTS,
    variables: {
      input: {
        term: '',
        collectionSlug,
        groupByProduct: true,
        take: 20,
      },
    },
  })

  if (error || !data?.search?.items) {
    console.error('Error fetching products:', error)
    return null
  }

  return data.search
}

// Utility to format product data
function formatProductData(
  product: SearchProductsQuery['search']['items'][0],
  facetValues: SearchProductsQuery['search']['facetValues'],
  bcvPrice: number
) {
  const specialBadges = [
    'disponibilidad-inmediata',
    'por-encargo',
    'personalizado',
  ]
  const currentFacetValueIds = product.facetValueIds

  const facetValueNames = facetValues
    .filter((facet) => currentFacetValueIds.includes(facet.facetValue.id))
    .map((facet) => {
      return {
        name: facet.facetValue.name,
        code: facet.facetValue.code,
      }
    })

  const facets =
    facetValueNames.filter((facet) => specialBadges.includes(facet.code)) || []

  const { productId, productName, priceWithTax, currencyCode, productAsset } =
    product
  const priceValue =
    'value' in priceWithTax
      ? `${priceFormatter(priceWithTax.value, currencyCode)}`
      : priceWithTax.min === priceWithTax.max
        ? `${priceFormatter(priceWithTax.min, currencyCode)}`
        : `Desde ${priceFormatter(priceWithTax.min, currencyCode)}`

  const priceValueInBs =
    'value' in priceWithTax
      ? priceFormatter(priceWithTax.value * bcvPrice, CurrencyCode.VES)
      : priceWithTax.min === priceWithTax.max
        ? priceFormatter(priceWithTax.min * bcvPrice, CurrencyCode.VES)
        : priceFormatter(priceWithTax.min * bcvPrice, CurrencyCode.VES)
  return {
    id: productId,
    name: productName,
    image: productAsset?.preview,
    priceInUSD: priceValue,
    lastPriceInUSD: 0,
    type: facets[0]?.name || 'Por encargo',
    slug: product.slug,
    variantId: product.productVariantId,
    priceInBs: priceValueInBs,
  }
}

// Reusable ProductCarousel component
const ProductCarousel = ({
  products,
  title,
  variant = 'default',
}: {
  products: ProductCardInfo[]
  title: string
  variant?: 'dark' | 'default'
}) => (
  <Section title={title} variant={variant}>
    <Carousel opts={{ align: 'start' }} className="w-full">
      <CarouselContent className="-ml-2 md:-ml-0">
        {products.map((product, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 pl-2 md:basis-1/3 md:pl-6 lg:basis-1/4 lg:pl-9"
          >
            <SingleProduct product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </Section>
)

// Carousel sections with unique slugs and titles
export const ImmediatelyAvailableProductsSection = async () => {
  const productsData = await fetchProducts('carrusel-disponibilidad-inmediata')
  const bcvPrice = await GetBCVPrice()
  if (!productsData) return null

  const t = await getTranslations('homepage')
  const products = productsData.items.map((product) =>
    formatProductData(product, productsData.facetValues, bcvPrice)
  )
  return (
    <ProductCarousel
      products={products}
      title={t('immediately-available-products-title')}
    />
  )
}

export const CustomMadeProductsSection = async () => {
  const productsData = await fetchProducts('carrusel-por-encargo')
  if (!productsData) return null
  const bcvPrice = await GetBCVPrice()

  const t = await getTranslations('homepage')
  const products = productsData.items.map((product) =>
    formatProductData(product, productsData.facetValues, bcvPrice)
  )
  return (
    <ProductCarousel
      products={products}
      title={t('custom-made-products-title')}
    />
  )
}

export const CustomizedProductsSection = async () => {
  const productsData = await fetchProducts('carrusel-personalizados')
  if (!productsData) return null
  const bcvPrice = await GetBCVPrice()
  const t = await getTranslations('homepage')
  const products = productsData.items.map((product) =>
    formatProductData(product, productsData.facetValues, bcvPrice)
  )
  return (
    <ProductCarousel
      products={products}
      title={t('customized-products-title')}
      variant={'dark'}
    />
  )
}
