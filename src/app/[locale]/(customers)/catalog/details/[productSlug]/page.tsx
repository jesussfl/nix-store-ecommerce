import { Description } from './description'
import { ProductDetails } from './product-details'
import { Gallery } from './gallery'
import { vendureFetch } from '@/libs/vendure'
import { GET_PRODUCT_INFO } from '@/libs/queries/products'

const productImages = [
  '/placeholder.svg?height=500&width=500',
  '/placeholder.svg?height=80&width=80',
  '/placeholder.svg?height=80&width=80',
  '/placeholder.svg?height=80&width=80',
]

const productColors = [
  { name: 'Black', image: '/placeholder.svg?height=60&width=60' },
  { name: 'Blue', image: '/placeholder.svg?height=60&width=60' },
]

const productSizes = ['XS', 'S', 'M']

export default async function ProductInfoPage({
  params: { productSlug },
}: {
  params: { productSlug: string }
}) {
  const { data, error } = await vendureFetch({
    query: GET_PRODUCT_INFO,
    variables: {
      slug: productSlug,
    },
  })
  const variants = data?.product?.variants
  console.log(data?.product?.assets)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Gallery
          images={data?.product?.assets.map((asset) => asset.preview) || []}
        />
        <ProductDetails
          title="Jeans casuales de pierna ancha para mujer"
          price={17.0}
          originalPrice={19.0}
          colors={productColors}
          sizes={productSizes}
        />
      </div>
      <div className="mt-8">
        <Description content="EZwear Plus Size Solid Color Street Style Tooling Pants With Hanging Belts" />
      </div>
    </div>
  )
}
