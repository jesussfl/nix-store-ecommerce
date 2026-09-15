'use client'

/**
 * Holds the single BCV rate used across the checkout payment step, so the
 * order total shown in `OrderSummary`, the conversion hint in
 * `PaymentFields`, and the Bs->USD conversion in `PaymentForm.onSubmit`
 * never diverge (see the "Currency (BCV)" section of CLAUDE.md).
 *
 * Initialized from a server-fetched `BcvRate` (see
 * `checkout/payment/page.tsx`). `refresh()` re-fetches `/api/bcv-rate` and
 * only updates the rate when it comes back with `rate > 0`; a failed or
 * unavailable refresh keeps the previously displayed rate. Also refreshes
 * on tab focus/visibility, throttled so a user tabbing back and forth
 * cannot spam the endpoint.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { BcvRate } from '@/libs/bcv/types'
import { GetBCVRateInfo } from '@/utils/get-bcv-price'

const REFRESH_THROTTLE_MS = 60 * 1000

type RateChange = { from: BcvRate; to: BcvRate }

const useBcvRateContainer = createContainer((initialRate?: BcvRate | null) => {
  const [rateInfo, setRateInfo] = useState<BcvRate | null>(initialRate ?? null)
  // A rate change the customer has not been warned about yet. Set by any
  // refresh (background focus/visibility or pre-submit) so a silent
  // background update can never slip a new rate past the submit warning.
  const [pendingChange, setPendingChange] = useState<RateChange | null>(null)
  const currentRate = useRef<BcvRate | null>(initialRate ?? null)
  const lastRefreshAt = useRef(0)
  const inFlight = useRef<Promise<BcvRate | null> | null>(null)

  const refresh = useCallback((): Promise<BcvRate | null> => {
    // Share an in-flight refresh instead of returning null, so a submit that
    // races a focus refresh still sees the fresh rate.
    if (inFlight.current) return inFlight.current

    inFlight.current = GetBCVRateInfo()
      .then((next) => {
        lastRefreshAt.current = Date.now()
        if (!next || next.rate <= 0) return null

        const previous = currentRate.current
        if (previous && previous.rate > 0 && previous.rate !== next.rate) {
          setPendingChange((change) => ({
            from: change?.from ?? previous,
            to: next,
          }))
        }

        currentRate.current = next
        setRateInfo(next)
        return next
      })
      .finally(() => {
        inFlight.current = null
      })

    return inFlight.current
  }, [])

  const acknowledgeChange = useCallback(() => setPendingChange(null), [])

  useEffect(() => {
    const maybeRefresh = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastRefreshAt.current < REFRESH_THROTTLE_MS) return
      refresh()
    }

    document.addEventListener('visibilitychange', maybeRefresh)
    window.addEventListener('focus', maybeRefresh)

    return () => {
      document.removeEventListener('visibilitychange', maybeRefresh)
      window.removeEventListener('focus', maybeRefresh)
    }
  }, [refresh])

  return { rateInfo, refresh, pendingChange, acknowledgeChange }
})

export const useBcvRate = useBcvRateContainer.useContainer
export const BcvRateProvider = useBcvRateContainer.Provider
