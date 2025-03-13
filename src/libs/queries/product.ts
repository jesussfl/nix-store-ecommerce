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
  try {
    const { data } = await vendureFetch({
      query: GET_CURRENT_STOCK_LEVEL,
      variables: {
        variantId,
      },
    })

    return data?.currentStockLevel || 0
  } catch (error) {
    console.error('Error fetching stock level:', error)
    return 0
  }
}
