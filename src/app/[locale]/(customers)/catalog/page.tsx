import { SingleProduct } from '@/components/products/single-product'
import { graphql } from '@/gql'
import { vendureFetch } from '@/libs/vendure'
import { getLocale } from 'next-intl/server'

const GET_PRODUCTS = graphql(`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        featuredAsset {
          preview
        }
        variants {
          currencyCode
          price
        }
      }
    }
  }
`)

const Catalog = async () => {
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

  console.log(data.products.items)
  return (
    <div className="w-full max-w-[90rem]">
      <div className="grid grid-cols-4">
        {data.products.items.map((product: any) => {
          const { id, name, slug, featuredAsset, variants } = product
          console.log(variants)
          const formattedProduct = {
            id,
            name,
            image: featuredAsset?.preview,
            priceInUSD: 0,
            lastPriceInUSD: 0,
            type: slug,
          }
          return <SingleProduct key={product.id} product={formattedProduct} />
        })}
      </div>
    </div>
  )
}

export default Catalog
