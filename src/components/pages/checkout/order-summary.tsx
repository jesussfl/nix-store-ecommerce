'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/shared/button'
import { useCart } from '@/components/cart/cart-context'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/shared/separator/separator'
import { debounce } from 'lodash'

interface OrderSummaryProps {
  isPaymentStep: boolean
}

interface LocalQuantities {
  [key: string]: number
}

interface OrderLine {
  id: string
  quantity: number
  unitPriceWithTax: number
  productVariant: {
    name: string
  }
  featuredAsset?: {
    preview: string
  }
}

interface ActiveOrder {
  lines: OrderLine[]
  currencyCode: string
  subTotalWithTax: number
  shippingWithTax: number
  totalWithTax: number
}

export default function OrderSummary({ isPaymentStep }: OrderSummaryProps) {
  const { activeOrder, removeFromCart, setItemQuantityInCart, isLoading } =
    useCart()

  const [localQuantities, setLocalQuantities] = useState<LocalQuantities>({})
  const [pricingLoading, setPricingLoading] = useState(false)

  const debouncedUpdateQuantity = useCallback(
    debounce(async (lineId: string, newQuantity: number) => {
      setPricingLoading(true)

      if (newQuantity > 0) {
        await setItemQuantityInCart(lineId, newQuantity)
      } else {
        await removeFromCart(lineId)
      }

      setPricingLoading(false)
    }, 600),
    [setItemQuantityInCart, removeFromCart]
  )

  const handleQuantityChange = useCallback(
    (lineId: string, currentQuantity: number, change: number) => {
      if (isPaymentStep) return // Prevent changes during payment step

      const newQuantity = Math.max(
        0,
        (localQuantities[lineId] || currentQuantity) + change
      )

      setLocalQuantities((prev) => ({ ...prev, [lineId]: newQuantity }))
      debouncedUpdateQuantity(lineId, newQuantity)
    },
    [isPaymentStep, localQuantities, debouncedUpdateQuantity]
  )

  const handleRemoveItem = useCallback(
    (lineId: string) => {
      if (isPaymentStep) return // Prevent removal during payment step
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
      {(activeOrder as ActiveOrder).lines.map((line) => (
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
            <h3 className="text-sm font-medium">{line.productVariant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(
                line.unitPriceWithTax,
                (activeOrder as ActiveOrder).currencyCode
              )}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(line.id, line.quantity, -1)}
                disabled={isPaymentStep}
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
                onClick={() => handleQuantityChange(line.id, line.quantity, 1)}
                disabled={isPaymentStep}
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
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
                (activeOrder as ActiveOrder).subTotalWithTax,
                (activeOrder as ActiveOrder).currencyCode
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
                (activeOrder as ActiveOrder).shippingWithTax,
                (activeOrder as ActiveOrder).currencyCode
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
                (activeOrder as ActiveOrder).totalWithTax,
                (activeOrder as ActiveOrder).currencyCode
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
