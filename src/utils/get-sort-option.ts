import { SearchResultSortParameter, SortOrder } from '@/graphql/graphql'

export const getSortOption = (sortValue: string): SearchResultSortParameter => {
  switch (sortValue) {
    case 'price-asc':
      return { price: SortOrder.ASC }
    case 'price-desc':
      return { price: SortOrder.DESC }
    case 'name-asc':
      return { name: SortOrder.ASC }
    case 'name-desc':
      return { name: SortOrder.DESC }
    default:
      return {}
  }
}
