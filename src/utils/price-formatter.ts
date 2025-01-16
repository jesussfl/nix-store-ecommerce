import { CurrencyCode } from '@/graphql/graphql'

export function priceFormatter(
  price: number,
  currencyCode: CurrencyCode | string
) {
  //TODO: more universal solution
  const translations: Partial<Record<CurrencyCode, { country: string }>> = {
    [CurrencyCode.USD]: {
      country: 'en-US',
    },
    [CurrencyCode.EUR]: {
      country: 'de-DE',
    },
    [CurrencyCode.PLN]: {
      country: 'pl-PL',
    },
    [CurrencyCode.CZK]: {
      country: 'cs-CZ',
    },
    //VENEZUELA
    [CurrencyCode.VES]: {
      country: 'es-VE',
    },
  }
  const c = translations[currencyCode as CurrencyCode]
  if (!c) {
    const formatterCode = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currencyDisplay: 'symbol',
      currency: 'USD',
    })
    return formatterCode.format(price / 100)
  }

  const formatterCode = new Intl.NumberFormat(c.country, {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: currencyCode,
  })
  return formatterCode.format(price / 100)
}

export function formatPriceValue(priceWithTax: any, currencyCode: any) {
  if ('value' in priceWithTax) {
    return priceFormatter(priceWithTax.value, currencyCode)
  }

  if (priceWithTax.min === priceWithTax.max) {
    return priceFormatter(priceWithTax.min, currencyCode)
  }

  return `${priceFormatter(priceWithTax.min, currencyCode)} - ${priceFormatter(priceWithTax.max, currencyCode)}`
}
