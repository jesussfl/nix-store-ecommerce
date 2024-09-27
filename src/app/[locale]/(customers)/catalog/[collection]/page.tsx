import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProductsGrid } from '@/components/pages/catalog/products-grid'
import { vendureFetch } from '@/libs/vendure'
import { SEARCH_PRODUCTS } from '@/libs/queries/products'
import { getLocale } from 'next-intl/server'
import { PageContainer } from '@/components/pages/page-container'
import { CatalogHeadings } from '@/components/pages/catalog/headings'

export async function generateMetadata({
  params,
}: {
  params: { collection: string }
}): Promise<Metadata> {
  const collection = params.collection

  if (!collection) return notFound()

  return {
    title: collection,
    // description:
    //   collection.seo?.description || collection.description || `${collection.title} products`
  }
}

export default async function CollectionPage({
  params,
  searchParams = {},
}: {
  params: { collection: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const locale = await getLocale()
  const { sort, q: searchValue } = searchParams as { [key: string]: string }
  const dynamicFacets = Object.entries(searchParams).filter(
    ([key]) => key !== 'sort' && key !== 'q'
  )

  const facetValueFilters = dynamicFacets.flatMap(([facetKey, facetValues]) => {
    const valuesArray =
      typeof facetValues === 'string'
        ? facetValues.split(',')
        : facetValues || []
    return valuesArray.map((value: string) => ({
      and: value, // Use the facet id for the 'and' property
    }))
  })
  const { data } = await vendureFetch({
    query: SEARCH_PRODUCTS,
    languageCode: locale,
    variables: {
      input: {
        term: searchValue,
        groupByProduct: true,
        collectionSlug: params.collection,
        facetValueFilters: facetValueFilters,
      },
    },
  })

  return (
    <PageContainer>
      <CatalogHeadings totalItems={data.search.totalItems} />
      <ProductsGrid results={data.search} />
    </PageContainer>
  )
}
