'use client'
import { useFragment } from '@/graphql'
import { ActiveOrderFragment } from '@/graphql/graphql'
import {
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  SET_ITEM_QUANTITY_IN_CART_MUTATION,
} from '@/libs/mutations/order'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { ACTIVE_ORDER_FRAGMENT, GET_ACTIVE_ORDER } from '@/libs/queries/order'
import { vendureFetch } from '@/libs/vendure'
import { useState, useCallback, useEffect } from 'react'
import { createContainer } from 'unstated-next'

const useCartContainer = createContainer(() => {
  const [activeOrder, setActiveOrder] = useState<ActiveOrderFragment | null>()
  const [isLogged, setIsLogged] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const fetchActiveOrder = useCallback(async () => {
    if (!isLoading) return // Prevent multiple fetches
    setIsLoading(true)
    try {
      const { data: order } = await vendureFetch({
        query: GET_ACTIVE_ORDER,
      })

      const { data: customer } = await vendureFetch({
        query: GET_ACTIVE_CUSTOMER,
      })
      const activeOrderData = useFragment(
        ACTIVE_ORDER_FRAGMENT,
        order?.activeOrder
      )

      if (activeOrderData) {
        setActiveOrder(activeOrderData)
      }

      // setActiveOrder(order?.activeOrder)
      setIsLogged(!!customer?.activeCustomer?.id)
      console.log(order?.activeOrder)
      return order?.activeOrder
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    fetchActiveOrder()
  }, [fetchActiveOrder])

  const addToCart = useCallback(
    async (id: string, q: number, o?: boolean) => {
      setActiveOrder(
        (c) => c && { ...c, totalQuantity: (c.totalQuantity || 0) + q }
      )
      try {
        const { data } = await vendureFetch({
          query: ADD_TO_CART_MUTATION,
          variables: {
            productVariantId: id,
            quantity: q,
          },
        })

        if (data?.addItemToOrder.__typename === 'Order') {
          const activeOrderData = useFragment(
            ACTIVE_ORDER_FRAGMENT,
            data.addItemToOrder
          )

          setActiveOrder(activeOrderData)

          if (o) open()
        }
      } catch (e) {
        console.error(e)
      }
    },
    [open]
  )

  const removeFromCart = useCallback(async (id: string) => {
    setActiveOrder(
      (c) => c && { ...c, lines: c.lines.filter((l) => l.id !== id) }
    )
    try {
      const { data } = await vendureFetch({
        query: REMOVE_FROM_CART_MUTATION,
        variables: {
          lineId: id,
        },
      })
      if (data?.removeOrderLine.__typename === 'Order') {
        const activeOrderData = useFragment(
          ACTIVE_ORDER_FRAGMENT,
          data.removeOrderLine
        )
        setActiveOrder(activeOrderData)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const setItemQuantityInCart = useCallback(async (id: string, q: number) => {
    setActiveOrder((c) => {
      if (c?.lines.find((l) => l.id === id)) {
        return {
          ...c,
          lines: c.lines.map((l) => (l.id === id ? { ...l, quantity: q } : l)),
        }
      }
      return c
    })
    try {
      const { data } = await vendureFetch({
        query: SET_ITEM_QUANTITY_IN_CART_MUTATION,
        variables: {
          lineId: id,
          quantity: q,
        },
      })
      if (data?.adjustOrderLine.__typename === 'Order') {
        const activeOrderData = useFragment(
          ACTIVE_ORDER_FRAGMENT,
          data.adjustOrderLine
        )
        setActiveOrder(activeOrderData)
      }
      return data?.adjustOrderLine
    } catch (e) {
      console.error(e)
    }
  }, [])

  return {
    isLogged,
    activeOrder,
    cart: activeOrder,
    addToCart,
    setItemQuantityInCart,
    removeFromCart,
    fetchActiveOrder,
    isOpen,
    open,
    close,
    isLoading,
  }
})

export const useCart = useCartContainer.useContainer
export const CartProvider = useCartContainer.Provider
