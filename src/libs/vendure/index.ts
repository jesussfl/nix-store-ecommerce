import { TypedDocumentString } from '@/graphql/graphql'
import { VENDURE_GRAPHQL_API_ENDPOINT } from '../constants'

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`

const domain = process.env.VENDURE_ADMIN_DOMAIN
//   ? ensureStartsWith(process.env.VENDURE_ADMIN_DOMAIN, 'https://')
//   : ''
const endpoint = `${domain}${VENDURE_GRAPHQL_API_ENDPOINT}`
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

type VendureFetchProps<TResult, TVariables> = {
  cache?: RequestCache
  headers?: HeadersInit
  query: TypedDocumentString<TResult, TVariables>
  tags?: string[]
  variables?: TVariables
  languageCode?: string
  revalidate?: number
}

export async function vendureFetch<TResult, TVariables>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
  languageCode = 'es',
  revalidate,
}: VendureFetchProps<TResult, TVariables>): Promise<{
  status: number
  data: TResult
}> {
  try {
    const endpointWithLanguage = `${endpoint}?languageCode=${languageCode}`
    const response = await fetch(endpointWithLanguage, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/graphql-response+json',
        'vendure-token': languageCode,
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: !revalidate ? cache : undefined,
      ...(tags && { next: { tags } }),
      ...(revalidate && { next: { revalidate } }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const body = await response.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: response.status,
      data: body.data,
    } as { status: number; data: TResult }
  } catch (error) {
    throw {
      error,
      query,
    }
  }
}
