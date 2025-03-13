/* eslint-disable */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/shared/button'
import { useCart } from '@/components/cart/cart-context'
import { AlertCircle, Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/shared/separator/separator'
import { debounce } from 'lodash'
import { Badge } from '@/components/shared/badge'
import { ScrollArea } from '@/components/shared/scroll-area/scroll-area'
import { priceFormatter } from '@/utils/price-formatter'
import { CurrencyCode } from '@/graphql/graphql'
import { SpecialOrderMessage } from '../catalog/details/components/special-order-message'
import { Alert, AlertDescription } from '@/components/shared/alert'
import { fetchCurrentStockLevel } from '@/libs/queries/product'

interface OrderSummaryProps {
  isPaymentStep: boolean
  bcvPrice: number
}

interface LocalQuantities {
  [key: string]: number
}

interface StockLevelState {
  [key: string]: {
    available: number
    loading: boolean
    error: string | null
  }
}

interface UpdateErrors {
  [key: string]: string | null
}

// interface OrderLine {
//   id: string
//   quantity: number
//   unitPriceWithTax: number
//   productVariant: {
//     name: string
//   }
//   featuredAsset?: {
//     preview: string
//   }
//   product: {
//     facetValues: {
//       id: string
//       name: string
//       code: string
//     }[]
//     name: string
//     slug: string
//   }
// }

// interface ActiveOrder {
//   lines: OrderLine[]
//   currencyCode: string
//   subTotalWithTax: number
//   shippingWithTax: number
//   totalWithTax: number
// }

export default function OrderSummary({
  isPaymentStep,
  bcvPrice,
}: OrderSummaryProps) {
  const { activeOrder, removeFromCart, setItemQuantityInCart, isLoading } =
    useCart()

  const [localQuantities, setLocalQuantities] = useState<LocalQuantities>({})
  const [pricingLoading, setPricingLoading] = useState(false)
  const [stockLevels, setStockLevels] = useState<StockLevelState>({})
  const [updateErrors, setUpdateErrors] = useState<UpdateErrors>({})

  useEffect(() => {
    if (!activeOrder || !activeOrder.lines || isPaymentStep) return

    const fetchStockForAllItems = async () => {
      const newStockLevels = { ...stockLevels }

      activeOrder.lines.forEach((line) => {
        if (!newStockLevels[line.id]) {
          newStockLevels[line.id] = {
            available: 0,
            loading: true,
            error: null,
          }
        }
      })
      setStockLevels(newStockLevels)

      for (const line of activeOrder.lines) {
        try {
          const stockLevel = await fetchCurrentStockLevel(
            line.productVariant.id
          )
          setStockLevels((prev) => ({
            ...prev,
            [line.id]: {
              available: stockLevel,
              loading: false,
              error: null,
            },
          }))
        } catch (error) {
          console.error(
            `Error fetching stock for ${line.productVariant.name}:`,
            error
          )
          setStockLevels((prev) => ({
            ...prev,
            [line.id]: {
              available: line.quantity,
              loading: false,
              error: 'Error al obtener stock disponible',
            },
          }))
        }
      }
    }

    fetchStockForAllItems()
  }, [activeOrder, isPaymentStep])

  const debouncedUpdateQuantity = useCallback(
    debounce(
      async (lineId: string, newQuantity: number, currentStock: number) => {
        setPricingLoading(true)
        setUpdateErrors((prev) => ({ ...prev, [lineId]: null }))

        if (newQuantity > currentStock) {
          setUpdateErrors((prev) => ({
            ...prev,
            [lineId]: `Solo hay ${currentStock} unidades disponibles`,
          }))
          setLocalQuantities((prev) => ({
            ...prev,
            [lineId]: Math.min(newQuantity, currentStock),
          }))
          setPricingLoading(false)
          return
        }

        try {
          if (newQuantity > 0) {
            const result = await setItemQuantityInCart(lineId, newQuantity)

            if (
              result &&
              typeof result === 'object' &&
              'errorCode' in result &&
              result.errorCode === 'INSUFFICIENT_STOCK_ERROR'
            ) {
              const availableStock =
                'quantityAvailable' in result
                  ? (result.quantityAvailable as number)
                  : 0
              setUpdateErrors((prev) => ({
                ...prev,
                [lineId]: `Solo hay ${availableStock} unidades disponibles`,
              }))
              setStockLevels((prev) => ({
                ...prev,
                [lineId]: {
                  available: availableStock,
                  loading: false,
                  error: null,
                },
              }))
              setLocalQuantities((prev) => ({
                ...prev,
                [lineId]: availableStock,
              }))
            }
          } else {
            await removeFromCart(lineId)
          }
        } catch (error) {
          console.error('Error updating quantity:', error)
          setUpdateErrors((prev) => ({
            ...prev,
            [lineId]: 'Error al actualizar cantidad',
          }))
        } finally {
          setPricingLoading(false)
        }
      },
      600
    ),
    [setItemQuantityInCart, removeFromCart]
  )

  const handleQuantityChange = useCallback(
    (lineId: string, currentQuantity: number, change: number) => {
      if (isPaymentStep) return

      const newQuantity = Math.max(
        0,
        (localQuantities[lineId] || currentQuantity) + change
      )

      const currentStock = stockLevels[lineId]?.available || currentQuantity

      if (change > 0 && newQuantity > currentStock) {
        setUpdateErrors((prev) => ({
          ...prev,
          [lineId]: `Solo hay ${currentStock} unidades disponibles`,
        }))
        return
      }

      setLocalQuantities((prev) => ({ ...prev, [lineId]: newQuantity }))
      setUpdateErrors((prev) => ({ ...prev, [lineId]: null }))

      debouncedUpdateQuantity(lineId, newQuantity, currentStock)
    },
    [isPaymentStep, localQuantities, debouncedUpdateQuantity, stockLevels]
  )

  const isMaxStock = useCallback(
    (lineId: string, quantity: number) => {
      const stock = stockLevels[lineId]?.available || 0
      return quantity >= stock && stock > 0
    },
    [stockLevels]
  )

  const handleRemoveItem = useCallback(
    (lineId: string) => {
      if (isPaymentStep) return
      removeFromCart(lineId)
    },
    [isPaymentStep, removeFromCart]
  )

  const formatCurrency = (amount: number, currencyCode: string) => {
    return (amount / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: currencyCode,
    })
  }

  if (!activeOrder || !activeOrder.lines || activeOrder.lines.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <p className="text-center text-muted-foreground">
            Tu carrito está vacío
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ScrollArea type="always" className="h-[calc(100vh-400px)] pr-4">
        {activeOrder.lines.map((line) => (
          <div
            key={line.id}
            className="flex flex-col items-start space-y-2 py-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={
                  line.featuredAsset?.preview ||
                  '/placeholder.svg?height=80&width=80'
                }
                alt={line.productVariant.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex-grow space-y-1">
              <h3 className="text-sm font-medium">
                {line.productVariant.name}
              </h3>
              <Badge variant="default" className="text-xs">
                {line.productVariant.product?.facetValues?.find(
                  (f) =>
                    f.code === 'por-encargo' ||
                    f.code === 'disponibilidad-inmediata' ||
                    f.code === 'personalizado'
                )?.name || 'Por encargo'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  line.unitPriceWithTax,
                  activeOrder.currencyCode
                )}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(line.id, line.quantity, -1)
                  }
                  disabled={isPaymentStep || stockLevels[line.id]?.loading}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="min-w-[1.5rem] text-center text-sm">
                  {localQuantities[line.id] !== undefined
                    ? localQuantities[line.id]
                    : line.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(line.id, line.quantity, 1)
                  }
                  disabled={
                    isPaymentStep ||
                    stockLevels[line.id]?.loading ||
                    isMaxStock(
                      line.id,
                      localQuantities[line.id] !== undefined
                        ? localQuantities[line.id]
                        : line.quantity
                    )
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {!stockLevels[line.id]?.loading && (
                <div className="text-xs text-gray-500">
                  Disponible: {stockLevels[line.id]?.available || 0} unidades
                </div>
              )}

              {updateErrors[line.id] && (
                <Alert variant="destructive" className="mt-1 py-1 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {updateErrors[line.id]}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(line.id)}
              className="flex-shrink-0"
              disabled={isPaymentStep}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            {pricingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>
                {formatCurrency(
                  activeOrder.subTotalWithTax,
                  activeOrder.currencyCode
                )}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            {pricingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>
                {formatCurrency(
                  activeOrder.shippingWithTax,
                  activeOrder.currencyCode
                )}
              </span>
            )}
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            {pricingLoading || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>
                {formatCurrency(
                  activeOrder.totalWithTax,
                  activeOrder.currencyCode
                )}{' '}
                <Badge variant="success" className="bg-slate-600">
                  {priceFormatter(
                    activeOrder.totalWithTax * bcvPrice,
                    CurrencyCode.VES
                  )}
                </Badge>
              </span>
            )}
          </div>
          <SpecialOrderMessage />
        </div>
      </ScrollArea>
    </div>
  )
}
