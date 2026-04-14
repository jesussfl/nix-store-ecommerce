import { Description } from '@/components/pages/catalog/details/description'
import ProductDetails from '@/components/pages/catalog/details/product-details'
import { Gallery } from '@/components/pages/catalog/details/gallery'
import { vendureFetch } from '@/libs/vendure'
import { GET_PRODUCT_INFO } from '@/libs/queries/products'
import { GetBCVPrice } from '@/utils/get-bcv-price'

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
    cache: 'no-cache',
  })
  const bcvPrice = await GetBCVPrice()
  if (!data?.product) {
    return <div>Product not found</div>
  }
  const initialVariantId =
    (searchParams?.variant as string) || data.product.variants[0]?.id
  const currentVariant = data.product.variants.find(
    (variant) => variant.id === initialVariantId
  )

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,420px)] xl:items-start">
          {/* Left column: Gallery + Description (desktop only) */}
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <Gallery
              images={
                currentVariant?.assets.map((asset) => asset.preview) || []
              }
            />
            <div className="hidden xl:block">
              <Description content={data.product.description || ''} />
            </div>
          </div>

          {/* Mobile: Description between gallery and product card */}
          <div className="xl:hidden">
            <Description content={data.product.description || ''} />
          </div>

          {/* Right column: Product details card */}
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <ProductDetails
              bcvPrice={bcvPrice}
              product={data.product}
              initialVariantId={initialVariantId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
