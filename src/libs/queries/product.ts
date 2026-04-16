import { vendureFetch } from '@/libs/vendure'
import { graphql } from '@/graphql'

export const GET_CURRENT_STOCK_LEVEL = graphql(`
  query GetCurrentStockLevel($variantId: ID!) {
    currentStockLevel(variantId: $variantId)
  }
`)

export const fetchCurrentStockLevel = async (
  variantId: string
): Promise<number> => {
  const { data, error } = await vendureFetch({
    query: GET_CURRENT_STOCK_LEVEL,
    variables: {
      variantId,
    },
  })

  if (error) {
    throw new Error(`Failed to fetch stock level: ${error}`)
  }

  if (data?.currentStockLevel == null) {
    throw new Error('No stock level data returned')
  }

  return data.currentStockLevel
}
