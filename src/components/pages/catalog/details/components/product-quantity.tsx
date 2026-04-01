import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input/input'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@/components/shared/alert'

export interface ProductQuantityProps {
  quantity: number
  onQuantityChange: (newQuantity: number) => void
  availableStock: number
  isStockLoading: boolean
}

export const ProductQuantity = ({
  quantity,
  onQuantityChange,
  availableStock,
  isStockLoading,
}: ProductQuantityProps) => {
  const t = useTranslations(`product_details`)
  const isMaxStock = quantity >= availableStock
  const isLowStock = availableStock > 0 && availableStock <= 5
  const isOutOfStock = availableStock <= 0
  const stockMessage = isOutOfStock
    ? 'No hay stock'
    : availableStock > 10
      ? 'Disponible'
      : `Quedan ${availableStock} unidades`

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {t(`select_quantity`)}
        </p>
        {!isStockLoading && (
          <span className="text-xs font-medium text-slate-500">
            {stockMessage}
          </span>
        )}
      </div>

      {isLowStock && !isOutOfStock && (
        <Alert className="rounded-xl border-amber-200 bg-amber-50 py-2 sm:rounded-2xl">
          <AlertDescription className="text-xs text-amber-700">
            {`Solo quedan ${availableStock} unidades`}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2.5 sm:max-w-xs sm:grid-cols-[48px_minmax(0,1fr)_48px] sm:gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-xl border border-slate-200 bg-white sm:h-12 sm:w-12"
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isStockLoading}
          aria-label={`Disminuir cantidad`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          readOnly
          inputMode="numeric"
          value={quantity}
          className="h-11 rounded-xl border-slate-200 bg-white px-2 text-center text-base font-semibold text-slate-900 sm:h-12 sm:text-lg"
          max={availableStock}
          min={1}
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-xl border border-slate-200 bg-white sm:h-12 sm:w-12"
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={isMaxStock || isStockLoading}
          aria-label={`Aumentar cantidad`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isMaxStock && !isOutOfStock && (
        <p className="text-xs text-amber-600">{`No hay más stock disponible`}</p>
      )}
    </div>
  )
}
