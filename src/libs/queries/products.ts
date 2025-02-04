import { graphql } from '@/graphql'

export const GET_PRODUCT_INFO = graphql(`
  query GetProductData($slug: String!) {
    product(slug: $slug) {
      __typename
      id
      name
      slug
      description
      facetValues {
        id
        name
        code
      }
      optionGroups {
        id
        code
        name
        options {
          id
          code
          name
          groupId
        }
      }
      featuredAsset {
        id
        preview
      }
      assets {
        id
        preview
      }
      variants {
        id
        sku
        priceWithTax
        stockLevel
        # facetValues {
        #   id
        #   name
        #   code
        #   facetId
        #   facet {
        #     id
        #     name
        #     code
        #   }
        # }
        price
        currencyCode
        assets {
          id
          preview
        }
        options {
          id
          code
          name
          groupId
        }
      }
    }
  }
`)

export const ALL_COLLECTIONS = graphql(`
  query GetAllCollections($options: CollectionListOptions) {
    collections(options: $options) {
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
          code
          facet {
            id
            name
            code
          }
        }
      }
      items {
        productName
        productId
        slug
        collectionIds
        facetIds
        facetValueIds
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
        productVariantId
        productVariantName
        currencyCode
      }
    }
  }
`)

export const GET_SEARCH_SUGGESTIONS = graphql(`
  query GetSearchSuggestions($input: SearchInput!) {
    search(input: $input) {
      items {
        productName
        slug
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
