import { graphql } from '@/graphql'

export const GET_PAYMENT_METHODS = graphql(`
  query GetPaymentMethods {
    eligiblePaymentMethods {
      id
      name
      code
      isEligible
    }
  }
`)

export const ADD_PAYMENT_TO_ORDER = graphql(`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)
