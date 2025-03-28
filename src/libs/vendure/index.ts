import { TypedDocumentString } from '@/graphql/graphql'
import { VENDURE_GRAPHQL_API_ENDPOINT } from '../constants'
export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`

const domain = process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN || ''
const endpoint = `${domain}${VENDURE_GRAPHQL_API_ENDPOINT}`
type VendureFetchProps<TResult, TVariables> = {
  url?: string
  cache?: RequestCache
  headers?: HeadersInit
  query: TypedDocumentString<TResult, TVariables>
  tags?: string[]
  variables?: TVariables
  languageCode?: string
  revalidate?: number
}

export async function vendureFetch<TResult, TVariables>({
  cache = 'no-cache',
  headers,
  query,
  tags,
  variables,
  languageCode = 'es',
  revalidate,
}: VendureFetchProps<TResult, TVariables>): Promise<{
  data: TResult | null
  error?: string
}> {
  try {
    const endpointWithLanguage = `${endpoint}?languageCode=en`
    const response = await fetch(endpointWithLanguage, {
      method: 'POST',
      credentials: 'include',
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
      return {
        data: null,
        error: `Network response was not ok: ${response.statusText}`,
      }
    }

    const body = await response.json()

    if (body.errors) {
      return {
        data: null,
        error: body.errors[0].message,
      }
    }

    return {
      data: body.data,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
