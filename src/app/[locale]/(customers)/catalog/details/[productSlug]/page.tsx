import { Description } from './description'
import { ProductDetails } from './product-details'
import { Gallery } from './gallery'
import { vendureFetch } from '@/libs/vendure'
import { GET_PRODUCT_INFO } from '@/libs/queries/products'

export default async function ProductInfoPage({
  params: { productSlug },
  searchParams,
}: {
  params: { productSlug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { data, error } = await vendureFetch({
    query: GET_PRODUCT_INFO,
    variables: {
      slug: productSlug,
    },
  })

  if (!data?.product) {
    return <div>Product not found</div>
  }

  const { variants, optionGroups } = data.product
  const initialVariantId = (searchParams?.variant as string) || variants[0]?.id
  const currentVariant = variants.find(
    (variant) => variant.id === initialVariantId
  )
  console.log(data.product)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Gallery
          images={currentVariant?.assets.map((asset) => asset.preview) || []}
        />
        <ProductDetails
          title={data.product.name}
          variants={variants}
          optionGroups={optionGroups}
          initialVariantId={initialVariantId}
        />
      </div>
      <div className="mt-8">
        <Description content={data.product.description || ''} />
      </div>
    </div>
  )
}
