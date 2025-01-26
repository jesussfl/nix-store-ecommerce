import { graphql } from '@/graphql'
export const ACTIVE_ORDER_FRAGMENT = graphql(`
  fragment ActiveOrder on Order {
    id
    createdAt
    updatedAt
    totalQuantity
    couponCodes
    code
    customFields
    customer {
      id
      emailAddress
      firstName
      lastName
      phoneNumber
    }
    payments {
      id
      method
      amount
      state
      errorMessage
    }
    discounts {
      type
      description
      amountWithTax
      adjustmentSource
    }
    shipping
    shippingWithTax
    totalWithTax
    subTotalWithTax
    state
    active
    currencyCode
    shippingLines {
      shippingMethod {
        id
        name
        description
      }
      priceWithTax
    }
    lines {
      id
      quantity
      linePriceWithTax
      unitPriceWithTax
      discountedLinePriceWithTax
      featuredAsset {
        id
        preview
      }
      productVariant {
        name
        id
        sku
        price
        featuredAsset {
          id
          source
        }
        stockLevel
        product {
          facetValues {
            id
            name
            code
          }
          name
          slug
        }
      }
    }
  }
`)

export const ORDER_FRAGMENT = graphql(`
  fragment Order on Order {
    ...ActiveOrder
    shippingAddress {
      fullName
      streetLine1
      streetLine2
      city
      province
      postalCode
    }
    billingAddress {
      fullName
      streetLine1
      streetLine2
      city
      province
      postalCode
    }
  }
`)
export const GET_ACTIVE_ORDER = graphql(`
  query GetActiveOrder {
    activeOrder {
      ...ActiveOrder
    }
  }
`)

export const TRANSITION_ORDER_STATE = graphql(`
  mutation TransitionToState($state: String!) {
    transitionOrderToState(state: $state) {
      ...ActiveOrder
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
        fromState
        toState
      }
    }
  }
`)

export const GET_ORDER_BY_CODE = graphql(`
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      customFields
      createdAt
      updatedAt
      totalQuantity
      couponCodes
      code
      customer {
        id
        emailAddress
        firstName
        lastName
        phoneNumber
      }
      payments {
        id
        method
        amount
        state
        errorMessage
      }
      discounts {
        type
        description
        amountWithTax
        adjustmentSource
      }
      shippingAddress {
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
      }

      shipping
      shippingWithTax
      totalWithTax
      subTotalWithTax
      state
      active
      currencyCode
      shippingLines {
        shippingMethod {
          id
          name
          description
        }
        priceWithTax
      }
      lines {
        id
        quantity
        linePriceWithTax
        unitPriceWithTax
        discountedLinePriceWithTax
        featuredAsset {
          id
          preview
        }
        productVariant {
          name
          id
          sku
          price
          featuredAsset {
            id
            source
          }
          stockLevel
          product {
            facetValues {
              id
              name
              code
            }
            name
            slug
          }
        }
      }
    }
  }
`)
