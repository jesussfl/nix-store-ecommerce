import { graphql } from '@/graphql'

export const ADD_TO_CART_MUTATION = graphql(`
  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
      __typename
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
      ... on InsufficientStockError {
        quantityAvailable
        order {
          ...ActiveOrder
        }
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }

      ... on OrderModificationError {
        errorCode
        message
      }

      ... on OrderLimitError {
        errorCode
        message
      }
    }
  }
`)

export const REMOVE_FROM_CART_MUTATION = graphql(`
  mutation RemoveItemFromOrder($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      __typename
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`)

export const SET_ITEM_QUANTITY_IN_CART_MUTATION = graphql(`
  mutation AdjustItemQuantityInOrder($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      __typename
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
      ... on OrderLimitError {
        errorCode
        message
      }
      ... on InsufficientStockError {
        quantityAvailable
        order {
          ...ActiveOrder
        }
      }
      ... on NegativeQuantityError {
        errorCode
        message
      }
      ... on OrderModificationError {
        errorCode
        message
      }
    }
  }
`)

export const SET_ORDER_SHIPPING_ADDRESS_MUTATION = graphql(`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      __typename
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)

export const SET_SHIPPING_METHOD_MUTATION = graphql(`
  mutation SetShippingMethod($id: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $id) {
      __typename
      ...ActiveOrder
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`)
