import { SingleProduct } from '@/components/products/single-product'
import { graphql } from '@/graphql'
import { vendureFetch } from '@/libs/vendure'
import { getLocale } from 'next-intl/server'

const GET_PRODUCTS = graphql(`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        featuredAsset {
          preview
        }
      }
    }
  }
`)

const CatalogPage = async () => {
  const locale = await getLocale()
  const { data } = await vendureFetch({
    query: GET_PRODUCTS,
    variables: {
      options: {
        take: 10,
        skip: 0,
      },
    },

    languageCode: locale,
    revalidate: 900,
  })

  return (
    <div className="w-full max-w-[90rem]">
      <div className="grid grid-cols-4">
        {data.products.items.map((product) => {
          const { id, name, featuredAsset } = product
          const formattedProduct = {
            id,
            name,
            image: featuredAsset?.preview,
            priceInUSD: 0,
            lastPriceInUSD: 0,
            type: 'Disponibilidad inmediata',
          }
          return <SingleProduct key={product.id} product={formattedProduct} />
        })}
      </div>
    </div>
  )
}

export default CatalogPage
