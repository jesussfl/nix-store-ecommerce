'use client'
import {
  ActiveOrderFragment,
  CreateAddressInput,
  GetActiveCustomerQuery,
  GetCustomerOrdersQuery,
  SetOrderShippingAddressMutationVariables,
} from '@/graphql/graphql'
import {
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  SET_ITEM_QUANTITY_IN_CART_MUTATION,
  SET_ORDER_SHIPPING_ADDRESS_MUTATION,
  SET_SHIPPING_METHOD_MUTATION,
} from '@/libs/mutations/order'
import {
  GET_ACTIVE_CUSTOMER,
  GET_CUSTOMER_ORDERS,
  LOG_OUT_MUTATION,
} from '@/libs/queries/account'
import { GET_ACTIVE_ORDER } from '@/libs/queries/order'
import { vendureFetch } from '@/libs/vendure'
import { useState } from 'react'
import { createContainer } from 'unstated-next'

const useCartContainer = createContainer(() => {
  const [activeOrder, setActiveOrder] = useState<ActiveOrderFragment | null>()
  const [currentCustomer, setCurrentCustomer] =
    useState<GetActiveCustomerQuery['activeCustomer']>()
  const [isLogged, setIsLogged] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOrderLoading, setIsOrderLoading] = useState(false)
  const [customerOrders, setCustomerOrders] =
    useState<GetCustomerOrdersQuery['activeCustomer']>()
  const open = () => setOpen(true)
  const close = () => setOpen(false)

  const fetchActiveOrder = async () => {
    if (!isLoading) return
    setIsLoading(true)
    try {
      const [
        { data: order, error: orderError },
        { data: customer, error: customerError },
      ] = await Promise.all([
        vendureFetch({
          query: GET_ACTIVE_ORDER,
        }),
        vendureFetch({
          query: GET_ACTIVE_CUSTOMER,
        }),
      ])

      if (order?.activeOrder) {
        setActiveOrder(order.activeOrder)
      }

      setCurrentCustomer(customer?.activeCustomer)
      setIsLogged(!!customer?.activeCustomer?.id)

      return order?.activeOrder
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (id: string, q: number, o?: boolean) => {
    setActiveOrder(
      (c) => c && { ...c, totalQuantity: (c.totalQuantity || 0) + q }
    )
    try {
      const { data, error } = await vendureFetch({
        query: ADD_TO_CART_MUTATION,
        variables: {
          productVariantId: id,
          quantity: q,
        },
      })

      if (data?.addItemToOrder.__typename === 'Order') {
        if (data?.addItemToOrder) {
          setActiveOrder(data?.addItemToOrder)
        }

        if (o) open()

        return {
          success: true,
        }
      } else if (data?.addItemToOrder.__typename === 'InsufficientStockError') {
        // Revertimos el cambio optimista
        await fetchActiveOrder()

        return {
          success: false,
          errorCode: 'INSUFFICIENT_STOCK_ERROR',
          message: data.addItemToOrder.message,
          quantityAvailable: data.addItemToOrder.quantityAvailable,
        }
      } else if (data?.addItemToOrder) {
        await fetchActiveOrder()

        return {
          success: false,
          errorCode: data.addItemToOrder.__typename,
          message: data.addItemToOrder.message || 'Error al añadir al carrito',
        }
      }

      return {
        success: false,
        errorCode: 'UNKNOWN_ERROR',
        message: 'Error desconocido al añadir al carrito',
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        errorCode: 'UNEXPECTED_ERROR',
        message: 'Error inesperado al añadir al carrito',
      }
    }
  }

  const removeFromCart = async (id: string) => {
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
        if (data.removeOrderLine) {
          setActiveOrder(data.removeOrderLine)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const setItemQuantityInCart = async (id: string, q: number) => {
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
        setActiveOrder(data?.adjustOrderLine)
        return {
          success: true,
        }
      } else if (
        data?.adjustOrderLine.__typename === 'InsufficientStockError'
      ) {
        // Revertimos el cambio optimista
        await fetchActiveOrder()

        return {
          success: false,
          errorCode: 'INSUFFICIENT_STOCK_ERROR',
          message: data.adjustOrderLine.message,
          quantityAvailable: data.adjustOrderLine.quantityAvailable,
        }
      } else if (data?.adjustOrderLine) {
        await fetchActiveOrder()

        return {
          success: false,
          errorCode: data.adjustOrderLine.__typename,
          message:
            data.adjustOrderLine.message || 'Error al ajustar la cantidad',
        }
      }

      return {
        success: false,
        errorCode: 'UNKNOWN_ERROR',
        message: 'Error desconocido al ajustar la cantidad',
      }
    } catch (e) {
      console.error(e)
      // Revertimos el cambio optimista en caso de error
      await fetchActiveOrder()

      return {
        success: false,
        errorCode: 'UNEXPECTED_ERROR',
        message: 'Error inesperado al ajustar la cantidad',
      }
    }
  }

  const setShippingOrderAddress = async (address: CreateAddressInput) => {
    try {
      setIsOrderLoading(true)
      const { data } = await vendureFetch({
        query: SET_ORDER_SHIPPING_ADDRESS_MUTATION,
        variables: {
          input: address,
        },
      })
      if (data?.setOrderShippingAddress.__typename === 'Order') {
        setActiveOrder(data?.setOrderShippingAddress)
      }
      return data?.setOrderShippingAddress
    } catch (e) {
      console.error(e)
    } finally {
      setIsOrderLoading(false)
    }
  }

  const setShippingMethod = async (id: string) => {
    try {
      // setIsLoading(true)
      const { data } = await vendureFetch({
        query: SET_SHIPPING_METHOD_MUTATION,
        variables: {
          id,
        },
      })
      if (data?.setOrderShippingMethod.__typename === 'Order') {
        setActiveOrder(data?.setOrderShippingMethod)
      }
      return data?.setOrderShippingMethod
    } catch (e) {
      console.error(e)
    }
  }

  const getCustomerOrders = async () => {
    try {
      const { data } = await vendureFetch({
        query: GET_CUSTOMER_ORDERS,
      })

      if (data?.activeCustomer?.orders?.items) {
        setCustomerOrders(data.activeCustomer)
      }
      // return data?.activeCustomer?.orders?.items
    } catch (e) {
      console.error(e)
    }
  }

  const logOut = async () => {
    try {
      const { data } = await vendureFetch({
        query: LOG_OUT_MUTATION,
      })
      return data?.logout
    } catch (e) {
      console.error(e)
    }
  }

  const adjustOrderLine = async (lineId: string, quantity: number) => {
    try {
      const { data } = await vendureFetch({
        query: SET_ITEM_QUANTITY_IN_CART_MUTATION,
        variables: {
          lineId,
          quantity,
        },
      })

      if (data?.adjustOrderLine.__typename === 'Order') {
        setActiveOrder(data?.adjustOrderLine)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    isLogged,
    activeOrder,
    cart: activeOrder,
    customerOrders,
    getCustomerOrders,
    addToCart,
    setItemQuantityInCart,
    setShippingOrderAddress,
    setShippingMethod,
    removeFromCart,
    fetchActiveOrder,
    adjustOrderLine,
    isOpen,
    open,
    close,
    isLoading,
    currentCustomer,
    logOut,
    setIsOrderLoading,
    isOrderLoading,
  }
})

export const useCart = useCartContainer.useContainer
export const CartProvider = useCartContainer.Provider
