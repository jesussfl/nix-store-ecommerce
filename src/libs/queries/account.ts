import { graphql } from '@/graphql'

export const LOGIN_MUTATION = graphql(`
  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
    login(username: $email, password: $password, rememberMe: $rememberMe) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const REGISTER_MUTATION = graphql(`
  mutation Register($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const REQUEST_PASSWORD_RESET_MUTATION = graphql(`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(emailAddress: $email) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)
export const GET_ACTIVE_CUSTOMER = graphql(`
  query getActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      orders {
        items {
          id
          code
          state
          totalWithTax
          currencyCode
          createdAt
          updatedAt
          orderPlacedAt
          type
          totalWithTax
          shippingWithTax
          totalQuantity
          payments {
            id
            method
            amount
            state
            metadata
            createdAt
            updatedAt
            transactionId
            errorMessage
          }
        }
      }
    }
  }
`)

export const GET_CUSTOMER_ORDERS = graphql(`
  query GetCustomerOrders {
    activeCustomer {
      id
      orders {
        items {
          id
          code
          state
          totalWithTax
          currencyCode

          createdAt
        }
      }
    }
  }
`)

export const LOG_OUT_MUTATION = graphql(`
  mutation Logout {
    logout {
      success
    }
  }
`)
