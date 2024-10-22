import { graphql } from '@/graphql'
export const ACTIVE_ORDER_FRAGMENT = graphql(`
  fragment ActiveOrder on Order {
    id
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
          name
          slug
        }
      }
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
