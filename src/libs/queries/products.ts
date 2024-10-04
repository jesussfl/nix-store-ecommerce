import { graphql } from '@/graphql'

export const ALL_COLLECTIONS = graphql(`
  query GetAllCollections {
    collections {
      items {
        id
        slug
        name
        parentId
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`)
export const TOP_LEVEL_COLLECTIONS = graphql(`
  query GetTopLevelCollections {
    collections(options: { topLevelOnly: true }) {
      items {
        id
        slug
        name
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`)
export const SEARCH_PRODUCTS = graphql(`
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
      items {
        productName
        productId
        slug
        collectionIds
        productAsset {
          id
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            value
          }
          ... on PriceRange {
            min
            max
          }
        }

        currencyCode
      }
    }
  }
`)

export const GET_PRODUCTS = graphql(`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        featuredAsset {
          preview
        }
      }
    }
  }
`)