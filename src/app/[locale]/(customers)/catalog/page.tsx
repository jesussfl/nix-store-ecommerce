import { CatalogHeadings } from '@/components/pages/catalog/headings'
import {
  EmptyState,
  ProductsGrid,
} from '@/components/pages/catalog/products-grid'
import { SEARCH_PRODUCTS } from '@/libs/queries/products'
import { vendureFetch } from '@/libs/vendure'
import { getLocale, getTranslations } from 'next-intl/server'
import { PageContainer } from '@/components/pages/page-container'
import H1 from '@/components/shared/headings'
import Pagination from '@/components/shared/pagination'
import { getSortOption } from '@/utils/get-sort-option'

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 20

export default async function CatalogPage({
  searchParams = {},
}: {
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
    cache: 'no-cache',
    query: SEARCH_PRODUCTS,
    languageCode: locale,
    variables: {
      input: {
        term: searchValue,
        groupByProduct: true,
        facetValueFilters: facetValueFilters,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        sort: sortOption,
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
        basePath="/catalog"
      />
    </PageContainer>
  )
}
