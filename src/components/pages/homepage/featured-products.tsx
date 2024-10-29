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
import { SearchProductsQuery } from '@/graphql/graphql'

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

  return data.search.items
}

// Utility to format product data
function formatProductData(
  product: SearchProductsQuery['search']['items'][0],
  type: string
) {
  const {
    productId,
    productName,
    priceWithTax,
    currencyCode,
    productAsset,
    slug,
    productVariantId,
  } = product
  const priceValue =
    'value' in priceWithTax
      ? priceFormatter(priceWithTax.value, currencyCode)
      : priceWithTax.min === priceWithTax.max
        ? priceFormatter(priceWithTax.min, currencyCode)
        : `${priceFormatter(priceWithTax.min, currencyCode)} - ${priceFormatter(priceWithTax.max, currencyCode)}`

  return {
    id: productId,
    name: productName,
    image: productAsset?.preview,
    priceInUSD: priceValue,
    lastPriceInUSD: 0,
    type,
    slug,
    variantId: productVariantId,
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
  if (!productsData) return null

  const t = await getTranslations('homepage')
  const products = productsData.map((product) =>
    formatProductData(product, 'Disponibilidad inmediata')
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

  const t = await getTranslations('homepage')
  const products = productsData.map((product) =>
    formatProductData(product, 'Por encargo')
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

  const t = await getTranslations('homepage')
  const products = productsData.map((product) =>
    formatProductData(product, 'Personalizados')
  )
  return (
    <ProductCarousel
      products={products}
      title={t('customized-products-title')}
      variant={'dark'}
    />
  )
}
