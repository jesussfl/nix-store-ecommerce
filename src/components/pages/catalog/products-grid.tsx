import { SingleProduct } from '@/components/products/single-product'
import { Button } from '@/components/shared/button'
import { H2 } from '@/components/shared/headings'
import { SearchProductsQuery } from '@/graphql/graphql'
import { priceFormatter } from '@/utils/price-formatter'
import { RiEmotionSadLine, RiWhatsappLine } from '@remixicon/react'
import { Filters } from './filter-card'

export const ProductsGrid = async ({
  results,
}: {
  results: SearchProductsQuery['search']
}) => {
  return (
    <div className="flex flex-col items-start md:flex-row md:px-4">
      <Filters results={results.facetValues} />

      <ProductGrid>
        {results.items.map((product) => {
          const {
            productId,
            productName,
            priceWithTax,
            currencyCode,
            productAsset,
          } = product
          const priceValue =
            'value' in priceWithTax
              ? priceFormatter(priceWithTax.value, currencyCode)
              : priceWithTax.min === priceWithTax.max
                ? priceFormatter(priceWithTax.min, currencyCode)
                : `${priceFormatter(priceWithTax.min, currencyCode)} - ${priceFormatter(
                    priceWithTax.max,
                    currencyCode
                  )}`

          const formattedProduct = {
            id: productId,
            name: productName,
            image: productAsset?.preview,
            priceInUSD: priceValue,
            lastPriceInUSD: 0,
            type: 'Disponibilidad inmediata',
            slug: product.slug,
            variantId: product.productVariantId,
          }
          return <SingleProduct key={productId} product={formattedProduct} />
        })}
      </ProductGrid>
    </div>
  )
}

const ProductGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grid w-full grid-cols-2 gap-2 gap-y-6 px-2 md:w-[90%] md:grid-cols-3 md:gap-4 lg:grid-cols-4 2xl:grid-cols-5">
      {children}
    </section>
  )
}
export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="bg-feature-texture bg-cover bg-no-repeat p-1">
        <RiEmotionSadLine className="h-12 w-12 text-primary" />
      </div>
      <H2 className="text-center lg:w-[30%] lg:text-xl">{`Lo sentimos, parece que no hay resultados o productos disponibles`}</H2>
      <p className="text-base">{`Pero aún puedes contactarnos para hacer algún encargo personalizado`}</p>
      <Button variant="default" size={'xl'}>
        Contactar
        <RiWhatsappLine className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
