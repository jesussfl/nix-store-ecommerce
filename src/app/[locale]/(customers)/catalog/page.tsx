import { CatalogHeadings } from '@/components/pages/catalog/headings'
import { ProductsGrid } from '@/components/pages/catalog/products-grid'
import { SEARCH_PRODUCTS } from '@/libs/queries/products'
import { vendureFetch } from '@/libs/vendure'
import { getLocale } from 'next-intl/server'
import { PageContainer } from '@/components/pages/page-container'

const CatalogPage = async ({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
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
    revalidate: 900,
    query: SEARCH_PRODUCTS,
    languageCode: locale,
    variables: {
      input: {
        term: searchValue || undefined,
        groupByProduct: true,
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

export default CatalogPage
