import { useCart } from '@/components/cart/cart-context'
import { useEffect } from 'react'

export const useUserSesion = () => {
  const { isLogged, isLoading, currentCustomer, logOut } = useCart()
  useEffect(() => {
    if (!isLogged && !isLoading) {
      window.location.href = '/account/login?callback=/account/profile'
    }
  }, [isLogged, isLoading])

  const handleLogOut = () => {
    logOut()
    window.location.href = '/'
  }

  return {
    handleLogOut,
  }
}
