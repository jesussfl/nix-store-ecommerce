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
    <div className="text-sm font-medium text-gray-900">
      <p className="mb-2 text-sm font-semibold">{t(`total_price`)}</p>
      <p>
        {priceFormatter(totalPrice, currencyCode)}{' '}
        <Badge variant="success" className="w-auto bg-slate-600 text-xs">
          {priceFormatterFromMajor((totalPrice / 100) * bcvPrice, CurrencyCode.VES)}
        </Badge>
      </p>
    </div>
  )
}
