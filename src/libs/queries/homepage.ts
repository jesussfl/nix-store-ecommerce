import { graphql } from '@/graphql'

export const GET_STOREFRONT_NEWS = graphql(`
  query GetStorefrontNews {
    storefrontNews {
      id
      title
      summary
      ctaText
      ctaLink
      sortOrder
      isPublished
      imageAsset {
        id
        preview
        source
        name
      }
    }
  }
`)
