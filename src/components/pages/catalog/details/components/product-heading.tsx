import H1 from '@/components/shared/headings'
import { priceFormatter } from '@/utils/price-formatter'
import { Variant } from '../hooks/use-product-details'

export interface ProductHeadingProps {
  productName: string
  currentVariant: Variant
}

export const ProductHeading = ({
  productName,
  currentVariant,
}: ProductHeadingProps) => {
  const stockLevels: Record<string, { label: string; className: string }> = {
    OUT_OF_STOCK: {
      label: 'Agotado',
      className: 'bg-red-50 text-red-700',
    },
    LOW_STOCK: {
      label: 'Pocas unidades',
      className: 'bg-amber-50 text-amber-700',
    },
    NOT_SPECIFIED: {
      label: 'No especificado',
      className: 'bg-slate-100 text-slate-600',
    },
    IN_STOCK: {
      label: 'Disponible',
      className: 'bg-emerald-50 text-emerald-700',
    },
  }
  const currentStock =
    stockLevels[currentVariant.stockLevel] || stockLevels.NOT_SPECIFIED

  return (
    <div className="space-y-3 sm:space-y-4">
      <H1 className="break-words text-lg font-semibold leading-tight text-slate-900 sm:text-2xl lg:text-[1.75rem]">
        {productName}
      </H1>
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-[1.75rem] font-semibold tracking-tight text-primary sm:text-3xl lg:text-[2rem]">
          {priceFormatter(
            currentVariant.priceWithTax,
            currentVariant.currencyCode
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span>Estado del producto</span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${currentStock.className}`}
        >
          {currentStock.label}
        </span>
      </div>
    </div>
  )
}
