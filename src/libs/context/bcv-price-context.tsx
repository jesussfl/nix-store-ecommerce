'use client'
import {
  ActiveOrderFragment,
  CreateAddressInput,
  GetActiveCustomerQuery,
  SetOrderShippingAddressMutationVariables,
} from '@/graphql/graphql'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { GET_ACTIVE_ORDER } from '@/libs/queries/order'
import { vendureFetch } from '@/libs/vendure'
import { useState } from 'react'
import { createContainer } from 'unstated-next'

const useCartContainer = createContainer(() => {
  const [activeOrder, setActiveOrder] = useState<ActiveOrderFragment | null>()
  const [bcvPrice, setBcvPrice] = useState(0)
  const [currentCustomer, setCurrentCustomer] =
    useState<GetActiveCustomerQuery['activeCustomer']>()
  const [isLogged, setIsLogged] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const open = () => setOpen(true)
  const close = () => setOpen(false)

  const fetchActiveOrder = async () => {
    if (!isLoading) return
    setIsLoading(true)
    try {
      const data = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv', {
        method: 'GET',
        cache: 'force-cache',
        next: {
          revalidate: 5,
        },
      }).then((res) => res.json())

      setBcvPrice(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLogged,
    activeOrder,
    cart: activeOrder,

    fetchActiveOrder,
    isOpen,
    open,
    close,
    isLoading,
    currentCustomer,
  }
})

export const useCart = useCartContainer.useContainer
export const CartProvider = useCartContainer.Provider
