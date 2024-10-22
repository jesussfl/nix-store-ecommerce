'use client'

import { RiShoppingCartLine } from '@remixicon/react'
import { useEffect } from 'react'
import { Button } from '@/components/shared/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { useCart } from '@/components/cart/cart-context'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { ScrollArea } from '@/components/shared/scroll-area/scroll-area'
import { Separator } from '@/components/shared/separator/separator'

export default function CartModal() {
  const {
    activeOrder,
    fetchActiveOrder,
    removeFromCart,
    setItemQuantityInCart,
  } = useCart()

  useEffect(() => {
    fetchActiveOrder()
  }, [fetchActiveOrder])

  const handleQuantityChange = (
    lineId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      setItemQuantityInCart(lineId, newQuantity)
    } else {
      removeFromCart(lineId)
    }
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
                      <span className="text-sm">{line.quantity}</span>
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
                <span>
                  {(activeOrder.subTotalWithTax / 100).toLocaleString('es-ES', {
                    style: 'currency',
                    currency: activeOrder.currencyCode,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>
                  {(activeOrder.shippingWithTax / 100).toLocaleString('es-ES', {
                    style: 'currency',
                    currency: activeOrder.currencyCode,
                  })}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {(activeOrder.totalWithTax / 100).toLocaleString('es-ES', {
                    style: 'currency',
                    currency: activeOrder.currencyCode,
                  })}
                </span>
              </div>
            </div>
            <Button className="mt-4 w-full">Proceder al pago</Button>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Tu carrito está vacío
          </p>
        )}
      </SheetContent>
    </Sheet>
  )
}
