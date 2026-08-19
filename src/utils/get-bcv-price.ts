/**
 * Returns the bolívar conversion rate used across the storefront.
 *
 * DELIBERATE: this is the official EURO rate, not the official USD/BCV rate,
 * even though the function name and the `bcvPrice` / `bcvDolar` variables at
 * the call sites say "BCV". It is the store's chosen Bs conversion rate.
 *
 * Do not "fix" this to /v1/dolares/oficial without a pricing decision: every
 * Bs price in the catalog, cart, checkout and order summary is derived from
 * it, and switching to the official USD rate drops all Bs prices by ~13.6%.
 *
 * The same value converts the customer's Bs payment back to USD in
 * `payment-form.tsx`, so display and payment stay consistent as long as both
 * use this one function.
 *
 * Endpoint returns an array; index 0 is `fuente: "oficial"`, index 1 is
 * `fuente: "paralelo"`. Returns 0 on failure — callers must treat 0 as
 * "rate unavailable" and must not divide by it.
 */
export const GetBCVPrice = async () => {
  try {
    const data = await fetch('https://ve.dolarapi.com/v1/euros', {
      method: 'GET',
      next: { revalidate: 3600 },
    }).then((res) => res.json())

    return (Array.isArray(data) ? data[0]?.promedio : data?.promedio) || 0
  } catch (error) {
    console.error('Error fetching Bs conversion rate:', error)
    return 0
  }
}
