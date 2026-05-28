'use client'

import { useEffect } from 'react'
import { useCart } from '@/components/cart/cart-context'

export default function RefreshCart() {
  const { clearActiveOrder, fetchActiveOrder } = useCart()

  useEffect(() => {
    clearActiveOrder()
    void fetchActiveOrder()
  }, [clearActiveOrder, fetchActiveOrder])

  return null
}
