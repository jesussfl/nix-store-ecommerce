import { CurrencyCode } from '@/graphql/graphql'

type CurrencyLocaleMap = Partial<Record<CurrencyCode, string>>
type CurrencyOverrideMap = Partial<Record<CurrencyCode, CurrencyCode>>

const APP_CURRENCY_LOCALES: CurrencyLocaleMap = {
  [CurrencyCode.EUR]: 'de-DE',
  [CurrencyCode.PLN]: 'pl-PL',
  [CurrencyCode.CZK]: 'cs-CZ',
  [CurrencyCode.VES]: 'es-VE',
}

const APP_DISPLAY_CURRENCY_OVERRIDES: CurrencyOverrideMap = {
  [CurrencyCode.USD]: CurrencyCode.EUR,
}

export const APP_CURRENCY_CONFIG = {
  defaultCurrency: CurrencyCode.EUR,
  fallbackLocale: 'de-DE',
  locales: APP_CURRENCY_LOCALES,
  displayCurrencyOverrides: APP_DISPLAY_CURRENCY_OVERRIDES,
}

export function getDisplayCurrencyCode(
  currencyCode: CurrencyCode | string | null | undefined
) {
  if (!currencyCode) {
    return APP_CURRENCY_CONFIG.defaultCurrency
  }

  return (
    APP_CURRENCY_CONFIG.displayCurrencyOverrides[currencyCode as CurrencyCode] ??
    currencyCode
  )
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
    currencyDisplay: 'symbol',
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
