import { Badge } from '@/components/shared/badge'
import { CurrencyCode } from '@/graphql/graphql'
import { priceFormatter, priceFormatterFromMajor } from '@/utils/price-formatter'
import { useTranslations } from 'next-intl'

export interface TotalPriceProps {
  totalPrice: number
  currencyCode: string
  bcvPrice: number
}

export const TotalPrice = ({
  totalPrice,
  currencyCode,
  bcvPrice,
}: TotalPriceProps) => {
  const t = useTranslations(`common`)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {t(`total_price`)}
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <p className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {priceFormatter(totalPrice, currencyCode)}
        </p>
        <Badge className="w-auto rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
          {priceFormatterFromMajor(
            (totalPrice / 100) * bcvPrice,
            CurrencyCode.VES
          )}
        </Badge>
      </div>
    </div>
  )
}
