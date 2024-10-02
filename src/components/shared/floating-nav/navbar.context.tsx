'use client'
import { GetTopLevelCollectionsQuery } from '@/graphql/graphql'
import React from 'react'

type NavbarContextType = {
  collections: GetTopLevelCollectionsQuery['collections']['items']
  error?: string
}
export const NavbarContext = React.createContext<NavbarContextType>({
  collections: [],
  error: undefined,
})

export const NavbarProvider = ({
  value,
  children,
}: {
  value: NavbarContextType
  children: React.ReactNode
}) => {
  return (
    <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
  )
}

export const useNavbar = () => React.useContext(NavbarContext)
