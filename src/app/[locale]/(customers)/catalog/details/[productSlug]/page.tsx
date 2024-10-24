import { Description } from '@/components/pages/catalog/details/description'
import ProductDetails from '@/components/pages/catalog/details/product-details'
import { Gallery } from '@/components/pages/catalog/details/gallery'
import { vendureFetch } from '@/libs/vendure'
import { GET_PRODUCT_INFO } from '@/libs/queries/products'

export default async function ProductInfoPage({
  params: { productSlug },
  searchParams,
}: {
  params: { productSlug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { data } = await vendureFetch({
    query: GET_PRODUCT_INFO,
    variables: {
      slug: productSlug,
    },
  })

  if (!data?.product) {
    return <div>Product not found</div>
  }
  const initialVariantId =
    (searchParams?.variant as string) || data.product.variants[0]?.id
  const currentVariant = data.product.variants.find(
    (variant) => variant.id === initialVariantId
  )
  return (
    <div className="space-y-8 px-4 py-8">
      <div className="flex flex-col gap-12 md:px-8 lg:flex-row lg:gap-8 lg:px-16 2xl:px-56">
        <div className="flex flex-1 flex-col gap-4">
          <Gallery
            images={currentVariant?.assets.map((asset) => asset.preview) || []}
          />
          <div className="hidden md:block">
            <Description content={data.product.description || ''} />
          </div>
        </div>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <ProductDetails
            product={data.product}
            initialVariantId={initialVariantId}
          />
        </div>

        <div className="block md:hidden">
          <Description content={data.product.description || ''} />
        </div>
      </div>
    </div>
  )
}
