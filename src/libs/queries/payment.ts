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

export const ADD_ADDITIONAL_PAYMENT_TO_ORDER = graphql(`
  mutation AddPaymentToExistingOrder(
    $orderCode: String!
    $paymentMethodCode: String!
    $metadata: JSON
  ) {
    addPaymentToExistingOrder(
      orderCode: $orderCode
      paymentMethodCode: $paymentMethodCode
      metadata: $metadata
    ) {
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)
