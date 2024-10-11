import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  EmptyState,
  ProductsGrid,
} from '@/components/pages/catalog/products-grid'
import { vendureFetch } from '@/libs/vendure'
import { SEARCH_PRODUCTS } from '@/libs/queries/products'
import { getLocale, getTranslations } from 'next-intl/server'
import { PageContainer } from '@/components/pages/page-container'
import { CatalogHeadings } from '@/components/pages/catalog/headings'
import { getSortOption } from '@/utils/get-sort-option'
import H1 from '@/components/shared/headings'
import Pagination from '@/components/shared/pagination'
const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 20

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
  const t = await getTranslations(`Errors`)
  const {
    sort,
    q: searchValue,
    page = '1',
  } = searchParams as { [key: string]: string }

  const currentPage = parseInt(page, 10)
  const dynamicFacets = Object.entries(searchParams).filter(
    ([key]) => key !== 'sort' && key !== 'q' && key !== 'page'
  )
  const facetValueFilters = dynamicFacets.flatMap(([facetKey, facetValues]) => {
    const valuesArray =
      typeof facetValues === 'string'
        ? facetValues.split(',')
        : facetValues || []
    return valuesArray.map((value: string) => ({
      and: value,
    }))
  })
  const sortOption = getSortOption(sort)
  const { data, error } = await vendureFetch({
    query: SEARCH_PRODUCTS,
    languageCode: locale,
    variables: {
      input: {
        term: searchValue,
        groupByProduct: true,
        collectionSlug: params.collection,
        facetValueFilters: facetValueFilters,
        sort: sortOption,
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (currentPage - 1),
      },
    },
  })
  if (error) {
    return (
      <PageContainer>
        <div className="py-10 text-center">
          <H1 className="mb-4">{t(`something-went-wrong`)}</H1>
          <p>{t(`catalog-troubles`)}</p>
          <p className="mt-2 text-sm text-gray-500">Error: {error}</p>
        </div>
      </PageContainer>
    )
  }

  if (!data || !data.search) {
    return (
      <PageContainer>
        <EmptyState />
      </PageContainer>
    )
  }

  const totalPages = Math.ceil(data.search.totalItems / ITEMS_PER_PAGE)

  return (
    <PageContainer>
      <CatalogHeadings totalItems={data.search.totalItems} />

      <ProductsGrid results={data.search} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/catalog/${params.collection}`}
      />
    </PageContainer>
  )
}
