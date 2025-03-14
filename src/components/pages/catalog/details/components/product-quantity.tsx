import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input/input'
import { Minus, Plus, AlertCircle } from 'lucide-react'
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{t(`select_quantity`)}</p>
        {!isStockLoading && (
          <span className="text-xs font-medium text-gray-500">
            {isOutOfStock
              ? `No hay stock`
              : availableStock > 10
                ? ``
                : `Quedan ${availableStock} unidades`}
          </span>
        )}
      </div>

      {isLowStock && !isOutOfStock && (
        <Alert variant="default" className="border-amber-200 bg-amber-50 py-2">
          {/* <AlertCircle className="h-4 w-4 text-amber-500" /> */}
          <AlertDescription className="text-xs text-amber-700">
            {`Solo quedan ${availableStock} unidades`}
            {/* {t('only_few_items_left', { count: availableStock })} */}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center gap-4">
        <Button
          variant="secondary"
          className=""
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isStockLoading}
          aria-label={`Disminuir cantidad`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          readOnly
          value={quantity}
          className="w-full text-center"
          max={availableStock}
          min={1}
        />
        <Button
          className=""
          variant="secondary"
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={isMaxStock || isStockLoading}
          aria-label={`Aumentar cantidad`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isMaxStock && !isOutOfStock && (
        <p className="text-xs text-amber-500"> {`No hay más stock`} </p>
      )}
    </div>
  )
}
