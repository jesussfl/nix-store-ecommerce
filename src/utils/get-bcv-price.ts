import { BcvRate } from '@/libs/bcv/types'

/**
 * Client-safe accessors for the bolívar conversion rate used across the
 * storefront.
 *
 * The rate itself now comes from `@/libs/bcv/rate.server` (`getBcvRate`):
 * primarily bcv.org.ve, falling back to the official BCV USD rate from
 * `ve.dolarapi.com/v1/dolares/oficial`, selected by the candidate whose
 * "Fecha Valor" is the latest date not in the future (see that module for
 * the full selection rule). That module touches `node:https` and must never
 * be imported here or from any other client-importable file.
 *
 * These functions only fetch `/api/bcv-rate`, so they are safe to call from
 * Client Components. Server Components must import `getBcvRate` from
 * `@/libs/bcv/rate.server` directly instead of calling these (never
 * HTTP-calling the app's own API from a Server Component).
 *
 * `GetBCVRateInfo` returns `null` when the fetch itself fails (network
 * error, bad response). `GetBCVPrice` collapses that, and a `rate: 0`
 * response, to `0` for backwards compatibility. Callers must treat `0` as
 * "rate unavailable" and never divide by it.
 */
export const GetBCVRateInfo = async (): Promise<BcvRate | null> => {
  if (typeof window === 'undefined') {
    console.error(
      'GetBCVRateInfo() was called outside the browser. Server components ' +
        'must import getBcvRate from @/libs/bcv/rate.server instead.'
    )
    return null
  }

  try {
    const response = await fetch('/api/bcv-rate', { cache: 'no-store' })
    if (!response.ok) return null

    return (await response.json()) as BcvRate
  } catch (error) {
    console.error('Error fetching BCV rate info:', error)
    return null
  }
}

export const GetBCVPrice = async (): Promise<number> => {
  const rateInfo = await GetBCVRateInfo()
  return rateInfo?.rate || 0
}
