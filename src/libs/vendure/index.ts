import { TypedDocumentString } from '@/graphql/graphql'
import { getVendureDomain } from './config'

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`

const getErrorMessage = async (response: Response) => {
  const responseText = await response.text()

  if (!responseText) {
    return `Vendure request failed with ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`
  }

  try {
    const body = JSON.parse(responseText) as {
      errors?: Array<{ message?: string }>
      message?: string
    }

    return (
      body.errors?.[0]?.message ||
      body.message ||
      `Vendure request failed with ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`
    )
  } catch {
    return responseText
  }
}

const serializeQuery = <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables> | string
) => {
  if (typeof query === 'string') {
    return query
  }

  if (typeof query.toString === 'function') {
    return query.toString()
  }

  return String(query)
}

/**
 * Determine the GraphQL endpoint.
 * - In the browser: use /api/vendure (same-origin proxy) to avoid CORS.
 * - On the server: call the Vendure backend directly (no CORS restriction).
 */
const getEndpoint = () => {
  if (typeof window !== 'undefined') {
    // Browser — route through the Next.js proxy to avoid CORS
    return '/api/vendure'
  }
  // Server-side fallback (prefer vendureFetchSSR for server components)
  return `${getVendureDomain()}/shop-api`
}

type VendureFetchProps<TResult, TVariables> = {
  url?: string
  cache?: RequestCache
  headers?: HeadersInit
  query: TypedDocumentString<TResult, TVariables> | string
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
    const endpoint = getEndpoint()
    const endpointWithLanguage = `${endpoint}?languageCode=${languageCode}`
    const serializedQuery = serializeQuery(query)
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
        query: serializedQuery,
        variables,
      }),
      cache: !revalidate ? cache : undefined,
      ...(tags && { next: { tags } }),
      ...(revalidate && { next: { revalidate } }),
    })

    if (!response.ok) {
      return {
        data: null,
        error: await getErrorMessage(response),
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
