import { CurrencyCode } from '@/graphql/graphql'

type CurrencyLocaleMap = Partial<Record<CurrencyCode, string>>

/**
 * The catalog is priced in USD in Vendure and the storefront displays USD.
 *
 * `es-VE` is used for USD so the thousands/decimal separators match the Bs
 * badge rendered next to it (`$1.234,50` alongside `Bs.S 957.042,50`), and
 * `narrowSymbol` keeps the `$` instead of the `USD` prefix that `symbol`
 * produces in this locale. VES renders identically under both settings.
 */
const APP_CURRENCY_LOCALES: CurrencyLocaleMap = {
  [CurrencyCode.USD]: 'es-VE',
  [CurrencyCode.VES]: 'es-VE',
  [CurrencyCode.EUR]: 'de-DE',
  [CurrencyCode.PLN]: 'pl-PL',
  [CurrencyCode.CZK]: 'cs-CZ',
}

export const APP_CURRENCY_CONFIG = {
  defaultCurrency: CurrencyCode.USD,
  fallbackLocale: 'es-VE',
  locales: APP_CURRENCY_LOCALES,
}

export function getDisplayCurrencyCode(
  currencyCode: CurrencyCode | string | null | undefined
) {
  return currencyCode || APP_CURRENCY_CONFIG.defaultCurrency
}

function getCurrencyLocale(currencyCode: CurrencyCode | string) {
  return (
    APP_CURRENCY_CONFIG.locales[currencyCode as CurrencyCode] ??
    APP_CURRENCY_CONFIG.locales[APP_CURRENCY_CONFIG.defaultCurrency] ??
    APP_CURRENCY_CONFIG.fallbackLocale
  )
}

export function formatMoney(
  amount: number,
  currencyCode: CurrencyCode | string,
  options?: { fromMinorUnits?: boolean }
) {
  const normalizedCode = getDisplayCurrencyCode(currencyCode)
  const locale = getCurrencyLocale(normalizedCode)
  const value = options?.fromMinorUnits === false ? amount : amount / 100

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    currency: normalizedCode,
  }).format(value)
}

export function priceFormatter(
  price: number,
  currencyCode: CurrencyCode | string
) {
  return formatMoney(price, currencyCode)
}

export function priceFormatterFromMajor(
  price: number,
  currencyCode: CurrencyCode | string
) {
  return formatMoney(price, currencyCode, { fromMinorUnits: false })
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
