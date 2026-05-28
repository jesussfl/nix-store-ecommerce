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
  APPLY_COUPON_CODE_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  REMOVE_COUPON_CODE_MUTATION,
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
import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'

const asActiveOrder = (order: unknown) => order as ActiveOrderFragment
const cartOrderStates = new Set(['AddingItems', 'ArrangingPayment'])

const asCartOrder = (order: unknown) => {
  const activeOrder = order ? asActiveOrder(order) : null

  if (!activeOrder?.active || !cartOrderStates.has(activeOrder.state)) {
    return null
  }

  return activeOrder
}

const translateCouponMessage = (message: string) => {
  const invalidCode = message.match(/Coupon code "(.+)" is not valid/i)?.[1]
  if (invalidCode) return `El cupón "${invalidCode}" no es válido.`

  const expiredCode = message.match(/Coupon code "(.+)" has expired/i)?.[1]
  if (expiredCode) return `El cupón "${expiredCode}" expiró.`

  return message
}

const getCouponErrorMessage = (
  result:
    | {
        __typename?: string
        message?: string
        couponCode?: string
        limit?: number
      }
    | null
    | undefined,
  fallback: string
) => {
  const couponCode = result?.couponCode ? ` "${result.couponCode}"` : ''

  switch (result?.__typename) {
    case 'CouponCodeInvalidError':
      return `El cupón${couponCode} no es válido.`
    case 'CouponCodeExpiredError':
      return `El cupón${couponCode} expiró.`
    case 'CouponCodeLimitError':
      return result?.limit
        ? `El cupón${couponCode} ya alcanzó su límite de ${result.limit} usos.`
        : `El cupón${couponCode} ya alcanzó su límite de uso.`
    default:
      return result?.message ? translateCouponMessage(result.message) : fallback
  }
}

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
  const clearActiveOrder = useCallback(() => setActiveOrder(null), [])

  const fetchActiveOrder = useCallback(async () => {
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

      if (orderError) {
        console.error(orderError)
      } else {
        setActiveOrder(asCartOrder(order?.activeOrder))
      }

      if (customerError) {
        console.error(customerError)
      }

      setCurrentCustomer(customer?.activeCustomer)
      setIsLogged(!!customer?.activeCustomer?.id)

      return asCartOrder(order?.activeOrder)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
          setActiveOrder(asActiveOrder(data?.addItemToOrder))
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
    setActiveOrder((currentOrder) => {
      if (!currentOrder) return currentOrder

      const lineToRemove = currentOrder.lines.find((line) => line.id === id)
      const nextLines = currentOrder.lines.filter((line) => line.id !== id)

      return {
        ...currentOrder,
        lines: nextLines,
        totalQuantity: Math.max(
          0,
          currentOrder.totalQuantity - (lineToRemove?.quantity ?? 0)
        ),
      }
    })
    try {
      const { data } = await vendureFetch({
        query: REMOVE_FROM_CART_MUTATION,
        variables: {
          lineId: id,
        },
      })
      if (data?.removeOrderLine.__typename === 'Order') {
        if (data.removeOrderLine) {
          setActiveOrder(asActiveOrder(data.removeOrderLine))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const setItemQuantityInCart = async (id: string, q: number) => {
    setActiveOrder((currentOrder) => {
      if (currentOrder?.lines.find((line) => line.id === id)) {
        const previousLine = currentOrder.lines.find((line) => line.id === id)
        const previousQuantity = previousLine?.quantity ?? 0

        return {
          ...currentOrder,
          totalQuantity:
            currentOrder.totalQuantity - previousQuantity + q,
          lines: currentOrder.lines.map((line) =>
            line.id === id ? { ...line, quantity: q } : line
          ),
        }
      }
      return currentOrder
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
        setActiveOrder(asActiveOrder(data?.adjustOrderLine))
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
        setActiveOrder(asActiveOrder(data?.setOrderShippingAddress))
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
      const { data, error } = await vendureFetch({
        query: SET_SHIPPING_METHOD_MUTATION,
        variables: {
          id,
        },
      })

      if (error) {
        return {
          success: false,
          message: translateCouponMessage(error),
        }
      }

      if (data?.setOrderShippingMethod.__typename === 'Order') {
        setActiveOrder(asActiveOrder(data?.setOrderShippingMethod))
        return {
          success: true,
          order: asActiveOrder(data.setOrderShippingMethod),
        }
      }

      return {
        success: false,
        message:
          data?.setOrderShippingMethod?.message ||
          'No pudimos configurar el método de envío.',
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message:
          e instanceof Error
            ? e.message
            : 'No pudimos configurar el método de envío.',
      }
    }
  }

  const applyCouponCode = async (couponCode: string) => {
    try {
      setIsOrderLoading(true)
      const { data, error } = await vendureFetch({
        query: APPLY_COUPON_CODE_MUTATION,
        variables: {
          couponCode,
        },
      })

      if (error) {
        return {
          success: false,
          message: error,
        }
      }

      if (data?.applyCouponCode.__typename === 'Order') {
        const order = asActiveOrder(data.applyCouponCode)
        setActiveOrder(order)
        return {
          success: true,
          order,
        }
      }

      return {
        success: false,
        errorCode: data?.applyCouponCode?.errorCode,
        message: getCouponErrorMessage(
          data?.applyCouponCode,
          'No pudimos aplicar este cupón.'
        ),
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message:
          e instanceof Error ? e.message : 'No pudimos aplicar este cupón.',
      }
    } finally {
      setIsOrderLoading(false)
    }
  }

  const removeCouponCode = async (couponCode: string) => {
    try {
      setIsOrderLoading(true)
      const { data, error } = await vendureFetch({
        query: REMOVE_COUPON_CODE_MUTATION,
        variables: {
          couponCode,
        },
      })

      if (error) {
        return {
          success: false,
          message: error,
        }
      }

      if (data?.removeCouponCode) {
        const order = asActiveOrder(data.removeCouponCode)
        setActiveOrder(order)
        return {
          success: true,
          order,
        }
      }

      return {
        success: false,
        message: 'No pudimos quitar este cupón.',
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message:
          e instanceof Error ? e.message : 'No pudimos quitar este cupón.',
      }
    } finally {
      setIsOrderLoading(false)
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
        setActiveOrder(asActiveOrder(data?.adjustOrderLine))
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
    applyCouponCode,
    removeCouponCode,
    removeFromCart,
    fetchActiveOrder,
    clearActiveOrder,
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
