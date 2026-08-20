/**
 * Returns the bolívar conversion rate used across the storefront.
 *
 * This is the official BCV USD rate (`/v1/dolares/oficial`), matching the USD
 * the catalog is priced and displayed in. It previously used the official EURO
 * rate (`/v1/euros`) while prices were displayed as euros; both were switched
 * together, so display currency and Bs conversion stay consistent.
 *
 * Every Bs price in the catalog, cart, checkout and order summary is derived
 * from this value, and the same value converts the customer's Bs payment back
 * to USD in `payment-form.tsx`. Keep all of them on this one function so
 * display and payment never diverge.
 *
 * The `/dolares/oficial` endpoint returns a single object; the previous
 * `/euros` endpoint returned an array whose index 0 was `fuente: "oficial"`.
 * Both shapes are handled. Returns 0 on failure — callers must treat 0 as
 * "rate unavailable" and must not divide by it.
 */
export const GetBCVPrice = async () => {
  try {
    const data = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      method: 'GET',
      next: { revalidate: 3600 },
    }).then((res) => res.json())

    return (Array.isArray(data) ? data[0]?.promedio : data?.promedio) || 0
  } catch (error) {
    console.error('Error fetching Bs conversion rate:', error)
    return 0
  }
}
