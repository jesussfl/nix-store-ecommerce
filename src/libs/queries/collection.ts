import { graphql } from '@/graphql'

export const GET_COLLECTION = graphql(`
  query GetCollection($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      parentId
      children {
        id
        slug
        name
        featuredAsset {
          id
          preview
        }
      }
      featuredAsset {
        id
        preview
      }
    }
  }
`)
