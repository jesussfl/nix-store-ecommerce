'use client'

import { RiShoppingCartLine } from '@remixicon/react'

import { Button } from '../button'

import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'

export default function CartModal() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <RiShoppingCartLine className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] pt-16 sm:w-[400px]">
        <p className="text-center">Mi Carrito</p>
      </SheetContent>
    </Sheet>
  )
}
