'use client'
import { RiShoppingCartLine } from '@remixicon/react'
import { useCallback, useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/shared/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { useCart } from '@/components/cart/cart-context'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { ScrollArea } from '@/components/shared/scroll-area/scroll-area'
import { Separator } from '@/components/shared/separator/separator'
import { debounce } from 'lodash'
import Link from 'next/link'
import { cn } from '@/libs/utils'

export default function CartModal() {
  const {
    activeOrder,
    fetchActiveOrder,
    removeFromCart,
    setItemQuantityInCart,
    isLoading,
  } = useCart()

  const [pricingLoading, setPricingLoading] = useState(false) // Loader for pricing
  const [localQuantities, setLocalQuantities] = useState<{
    [key: string]: number
  }>({})
  useEffect(() => {
    if (!isLoading) return
    fetchActiveOrder()
  }, [fetchActiveOrder, isLoading])

  const debouncedUpdateQuantity = useCallback(
    debounce(async (lineId: string, newQuantity: number) => {
      setPricingLoading(true) // Start loader for pricing

      if (newQuantity > 0) {
        await setItemQuantityInCart(lineId, newQuantity)
      } else {
        removeFromCart(lineId)
      }

      setPricingLoading(false) // Stop loader for pricing
    }, 600),
    []
  )
  const handleQuantityChange = (
    lineId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = (localQuantities[lineId] || currentQuantity) + change
    if (newQuantity < 0) return // Prevent negative quantities

    // Update the local state immediately for a quick UI response
    setLocalQuantities((prev) => ({ ...prev, [lineId]: newQuantity }))

    // Debounced server update
    debouncedUpdateQuantity(lineId, newQuantity)
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <RiShoppingCartLine className="h-5 w-5" />
          {activeOrder && activeOrder.totalQuantity > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeOrder.totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] pt-16 sm:w-[400px]">
        <h2 className="mb-4 text-center text-2xl font-semibold">Mi Carrito</h2>
        {activeOrder && activeOrder.lines && activeOrder.lines.length > 0 ? (
          <>
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
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
                    <h3 className="text-sm font-medium">
                      {line.productVariant.name}
                    </h3>
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
                        onClick={() =>
                          handleQuantityChange(line.id, line.quantity, -1)
                        }
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
                        onClick={() =>
                          handleQuantityChange(line.id, line.quantity, 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(line.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                {pricingLoading ? ( // Loader for subtotal
                  <span className="loader">Cargando...</span>
                ) : (
                  <span>
                    {(activeOrder.subTotalWithTax / 100).toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: activeOrder.currencyCode,
                      }
                    )}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                {pricingLoading ? ( // Loader for shipping
                  <span className="loader">Cargando...</span>
                ) : (
                  <span>
                    {(activeOrder.shippingWithTax / 100).toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: activeOrder.currencyCode,
                      }
                    )}
                  </span>
                )}
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                {pricingLoading ? ( // Loader for total
                  <span className="loader">Cargando...</span>
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
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-4 w-full'
              )}
            >
              Continuar compra
            </Link>
          </>
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <p className="text-center text-muted-foreground">
                Tu carrito está vacío
              </p>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
