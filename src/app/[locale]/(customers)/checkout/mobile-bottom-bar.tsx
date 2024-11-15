'use client'
import { useCart } from '@/components/cart/cart-context'
import OrderSummary from '@/components/pages/checkout/order-summary'
import { Button } from '@/components/shared/button'
import {
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/shared/card/card'
import { Sheet, SheetTrigger, SheetContent } from '@/components/shared/sheet'
import { useState } from 'react'

export const MobileBottomBar = ({
  children,
  bcvPrice,
}: {
  children: React.ReactNode
  bcvPrice: number
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { activeOrder } = useCart()

  const totalInDollars = activeOrder ? activeOrder.totalWithTax / 100 : 0
  const totalInBs = totalInDollars * bcvPrice
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background p-4 shadow-md md:hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Total:</p>
          <p className="text-lg font-bold">${totalInDollars.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {totalInBs.toFixed(2)} Bs
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant={'secondary'} size={'sm'}>
                Ver resumen
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <CardHeader>
                <CardTitle>Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary bcvPrice={bcvPrice} isPaymentStep={false} />
              </CardContent>
            </SheetContent>
          </Sheet>
          {children}
        </div>
      </div>
    </div>
  )
}
