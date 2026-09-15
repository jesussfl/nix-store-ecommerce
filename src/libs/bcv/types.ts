/**
 * The bolívar conversion rate used across the storefront.
 *
 * `valueDate` is the rate's "Fecha Valor" (the date banks apply it) in
 * `YYYY-MM-DD` form. `source` records which upstream produced the value that
 * was ultimately selected (see `@/libs/bcv/rate.server`).
 *
 * `rate: 0` (with an empty `valueDate`) means "unavailable" — callers must
 * treat it that way and never divide by it. This type is imported from both
 * server and client code, so it must stay free of server-only imports.
 */
export interface BcvRate {
  rate: number
  valueDate: string
  source: 'bcv' | 'dolarapi'
}
