'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/shared/button'
import { useCart } from '@/components/cart/cart-context'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/shared/separator/separator'
import { debounce } from 'lodash'

interface OrderSummaryProps {
  isPaymentStep: boolean
}

export default function OrderSummary({ isPaymentStep }: OrderSummaryProps) {
  const { activeOrder, removeFromCart, setItemQuantityInCart, isLoading } =
    useCart()

  const [localQuantities, setLocalQuantities] = useState<{
    [key: string]: number
  }>({})

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
      {activeOrder.lines.map((line) => (
        <div key={line.id} className="flex items-center space-x-4 py-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={
                line.featuredAsset?.preview ||
                '/placeholder.svg?height=64&width=64'
              }
              alt={line.productVariant.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium">{line.productVariant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {(line.unitPriceWithTax / 100).toLocaleString('es-ES', {
                style: 'currency',
                currency: activeOrder.currencyCode,
              })}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(line.id, line.quantity, -1)}
                disabled={isPaymentStep}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {localQuantities[line.id] !== undefined
                  ? localQuantities[line.id]
                  : line.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(line.id, line.quantity, 1)}
                disabled={isPaymentStep}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveItem(line.id)}
            className="flex-shrink-0"
            disabled={isPaymentStep}
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
              {(activeOrder.subTotalWithTax / 100).toLocaleString('es-ES', {
                style: 'currency',
                currency: activeOrder.currencyCode,
              })}
            </span>
          )}
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          {pricingLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>
              {(activeOrder.shippingWithTax / 100).toLocaleString('es-ES', {
                style: 'currency',
                currency: activeOrder.currencyCode,
              })}
            </span>
          )}
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          {pricingLoading || isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>
              {(activeOrder.totalWithTax / 100).toLocaleString('es-ES', {
                style: 'currency',
                currency: activeOrder.currencyCode,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
