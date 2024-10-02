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

const CatalogPage = async ({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const locale = await getLocale()
  const t = await getTranslations(`Errors`)
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

  const { data, error } = await vendureFetch({
    revalidate: 900,
    query: SEARCH_PRODUCTS,
    languageCode: locale,
    variables: {
      input: {
        term: searchValue,
        groupByProduct: true,
        facetValueFilters: facetValueFilters,
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

  return (
    <PageContainer>
      <CatalogHeadings totalItems={data.search.totalItems} />
      <ProductsGrid results={data.search} />
    </PageContainer>
  )
}

export default CatalogPage
