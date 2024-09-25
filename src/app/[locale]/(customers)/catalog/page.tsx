import { SingleProduct } from '@/components/products/single-product'

const GET_PRODUCTS = /*GraphQL*/ `
    query GetProducts($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                featuredAsset {
                    preview
                }
            }
        }
    }
`
const AUTH_TOKEN_KEY = 'auth_token'

const API_URL = 'http://localhost:3000/shop-api'

let languageCode: string | undefined
let channelToken: string | undefined

export function setLanguageCode(value: string | undefined) {
  languageCode = value
}

export function setChannelToken(value: string | undefined) {
  channelToken = value
}
export async function query(
  document: string,
  variables: Record<string, any> = {}
) {
  // const authToken = localStorage.getItem(AUTH_TOKEN_KEY)
  const headers = new Headers({
    'content-type': 'application/json',
  })
  // if (authToken) {
  //   headers.append('authorization', `Bearer ${authToken}`)
  // }
  if (channelToken) {
    headers.append('vendure-token', channelToken)
  }
  let endpoint = API_URL
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`
  }
  return fetch(endpoint, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      query: document,
      variables,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`An error ocurred, HTTP status: ${res.status}`)
    }
    const newAuthToken = res.headers.get('vendure-auth-token')
    if (newAuthToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newAuthToken)
    }
    return res.json()
  })
}
const Catalog = async () => {
  const { data } = await query(GET_PRODUCTS, {
    take: 4,
    // groupByProduct: true,
    // sort: { price: SortOrder.ASC },
  })

  console.log(data.products.items)

  return (
    <div className="w-full max-w-[90rem]">
      <div className="grid grid-cols-4">
        {data.products.items.map((product: any) => {
          const { id, name, slug, featuredAsset } = product
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
