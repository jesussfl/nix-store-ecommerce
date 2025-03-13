import { Button } from '@/components/shared/button'
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Variant } from '../hooks/use-product-details'
import { Alert, AlertDescription } from '@/components/shared/alert'

export interface PurchaseActionsProps {
  isLogged: boolean
  isLoading: boolean
  productSlug: string
  currentVariant: Variant
  quantity: number
  availableStock: number
  addToCart: (
    productVariantId: string,
    quantity: number
  ) => Promise<{
    success: boolean
    errorCode?: string
    message?: string
    quantityAvailable?: number
  }>
}

export const PurchaseActions = ({
  isLogged,
  isLoading,
  productSlug,
  currentVariant,
  quantity,
  availableStock,
  addToCart,
}: PurchaseActionsProps) => {
  const router = useRouter()
  const t = useTranslations('common')
  const [error, setError] = useState<{
    message: string
    code: string
    quantityAvailable?: number
  } | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)

  const handleCheckout = async () => {
    if (!isLogged && !isLoading) {
      router.push(
        '/account/login?callback=/checkout&variant=' +
          currentVariant.id +
          `&quantity=${quantity}`
      )
      return
    }

    if (quantity > availableStock) {
      setError({
        message: `Solo hay ${availableStock} unidad(es) disponible(s).`,
        code: 'INSUFFICIENT_STOCK_ERROR',
        quantityAvailable: availableStock,
      })
      return
    }

    setAddingToCart(true)
    setError(null)

    try {
      const result = await addToCart(currentVariant.id, quantity)
      if (!result.success) {
        setError({
          message: result.message || 'Error al añadir al carrito',
          code: result.errorCode || 'ERROR',
          quantityAvailable: result.quantityAvailable,
        })
        return
      }

      router.push(`/checkout`)
    } catch (err) {
      setError({
        message: 'Ocurrió un error inesperado',
        code: 'UNEXPECTED_ERROR',
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isLogged && !isLoading) {
      router.push(
        '/account/login?callback=/catalog/details/' +
          productSlug +
          '?variant=' +
          currentVariant.id
      )
      return
    }

    if (quantity > availableStock) {
      setError({
        message: `Solo hay ${availableStock} unidad(es) disponible(s).`,
        code: 'INSUFFICIENT_STOCK_ERROR',
        quantityAvailable: availableStock,
      })
      return
    }

    setAddingToCart(true)
    setError(null)

    try {
      const result = await addToCart(currentVariant.id, quantity)
      if (!result.success) {
        setError({
          message: result.message || 'Error al añadir al carrito',
          code: result.errorCode || 'ERROR',
          quantityAvailable: result.quantityAvailable,
        })
      }
    } catch (err) {
      setError({
        message: 'Ocurrió un error inesperado',
        code: 'UNEXPECTED_ERROR',
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const isOutOfStock =
    currentVariant.stockLevel === 'OUT_OF_STOCK' ||
    availableStock <= 0 ||
    (error?.code === 'INSUFFICIENT_STOCK_ERROR' &&
      error?.quantityAvailable === 0)

  const hasInsufficientStock =
    error?.code === 'INSUFFICIENT_STOCK_ERROR' &&
    error.quantityAvailable !== undefined &&
    error.quantityAvailable > 0

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.code === 'INSUFFICIENT_STOCK_ERROR'
              ? hasInsufficientStock
                ? `Solo hay ${error.quantityAvailable} unidad(es) disponible(s).`
                : 'Este producto está agotado actualmente.'
              : error.message}
          </AlertDescription>
        </Alert>
      )}

      <Button
        variant="default"
        disabled={
          isLoading || addingToCart || isOutOfStock || quantity > availableStock
        }
        onClick={handleCheckout}
        className="w-full"
        size={'lg'}
      >
        {isLoading || addingToCart ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          t(`buy_now`)
        )}
      </Button>
      <Button
        variant={'outline'}
        onClick={handleAddToCart}
        className="w-full"
        size={'lg'}
        disabled={
          isLoading || addingToCart || isOutOfStock || quantity > availableStock
        }
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading || addingToCart ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          t(`add_to_cart`)
        )}
      </Button>
      {isOutOfStock && (
        <p className="text-sm text-red-600">
          Este producto está actualmente agotado.
        </p>
      )}
      {hasInsufficientStock && (
        <p className="text-sm text-amber-600">
          Por favor, ajusta la cantidad a {error.quantityAvailable} o menos.
        </p>
      )}
    </div>
  )
}
