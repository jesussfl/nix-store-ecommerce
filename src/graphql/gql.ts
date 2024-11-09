/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on InsufficientStockError {\n        quantityAvailable\n        order {\n          ...ActiveOrder\n        }\n      }\n      ... on NegativeQuantityError {\n        errorCode\n        message\n      }\n\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n\n      ... on OrderLimitError {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddItemToOrderDocument,
    "\n  mutation RemoveItemFromOrder($lineId: ID!) {\n    removeOrderLine(orderLineId: $lineId) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RemoveItemFromOrderDocument,
    "\n  mutation AdjustItemQuantityInOrder($lineId: ID!, $quantity: Int!) {\n    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderLimitError {\n        errorCode\n        message\n      }\n      ... on InsufficientStockError {\n        quantityAvailable\n        order {\n          ...ActiveOrder\n        }\n      }\n      ... on NegativeQuantityError {\n        errorCode\n        message\n      }\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AdjustItemQuantityInOrderDocument,
    "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetOrderShippingAddressDocument,
    "\n  mutation SetShippingMethod($id: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $id) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetShippingMethodDocument,
    "\n  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {\n    login(username: $email, password: $password, rememberMe: $rememberMe) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(emailAddress: $email) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RequestPasswordResetDocument,
    "\n  query getActiveCustomer {\n    activeCustomer {\n      id\n      title\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n": types.GetActiveCustomerDocument,
    "\n  query GetCollection($slug: String!) {\n    collection(slug: $slug) {\n      id\n      name\n      slug\n      parentId\n      children {\n        id\n        slug\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n  }\n": types.GetCollectionDocument,
    "\n  fragment ActiveOrder on Order {\n    id\n    createdAt\n    updatedAt\n    totalQuantity\n    couponCodes\n    code\n    customer {\n      id\n      emailAddress\n      firstName\n      lastName\n      phoneNumber\n    }\n    payments {\n      id\n      method\n      amount\n      state\n      errorMessage\n    }\n    discounts {\n      type\n      description\n      amountWithTax\n      adjustmentSource\n    }\n    shipping\n    shippingWithTax\n    totalWithTax\n    subTotalWithTax\n    state\n    active\n    currencyCode\n    shippingLines {\n      shippingMethod {\n        id\n        name\n        description\n      }\n      priceWithTax\n    }\n    lines {\n      id\n      quantity\n      linePriceWithTax\n      unitPriceWithTax\n      discountedLinePriceWithTax\n      featuredAsset {\n        id\n        preview\n      }\n      productVariant {\n        name\n        id\n        sku\n        price\n        featuredAsset {\n          id\n          source\n        }\n        stockLevel\n        product {\n          facetValues {\n            id\n            name\n            code\n          }\n          name\n          slug\n        }\n      }\n    }\n  }\n": types.ActiveOrderFragmentDoc,
    "\n  fragment Order on Order {\n    ...ActiveOrder\n    shippingAddress {\n      fullName\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n    }\n    billingAddress {\n      fullName\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n    }\n  }\n": types.OrderFragmentDoc,
    "\n  query GetActiveOrder {\n    activeOrder {\n      ...ActiveOrder\n    }\n  }\n": types.GetActiveOrderDocument,
    "\n  mutation TransitionToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ...ActiveOrder\n      ... on OrderStateTransitionError {\n        errorCode\n        message\n        transitionError\n        fromState\n        toState\n      }\n    }\n  }\n": types.TransitionToStateDocument,
    "\n  query GetOrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      id\n      createdAt\n      updatedAt\n      totalQuantity\n      couponCodes\n      code\n      customer {\n        id\n        emailAddress\n        firstName\n        lastName\n        phoneNumber\n      }\n      payments {\n        id\n        method\n        amount\n        state\n        errorMessage\n      }\n      discounts {\n        type\n        description\n        amountWithTax\n        adjustmentSource\n      }\n      shipping\n      shippingWithTax\n      totalWithTax\n      subTotalWithTax\n      state\n      active\n      currencyCode\n      shippingLines {\n        shippingMethod {\n          id\n          name\n          description\n        }\n        priceWithTax\n      }\n      lines {\n        id\n        quantity\n        linePriceWithTax\n        unitPriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          name\n          id\n          sku\n          price\n          featuredAsset {\n            id\n            source\n          }\n          stockLevel\n          product {\n            facetValues {\n              id\n              name\n              code\n            }\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n": types.GetOrderByCodeDocument,
    "\n  query GetPaymentMethods {\n    eligiblePaymentMethods {\n      id\n      name\n      code\n      isEligible\n    }\n  }\n": types.GetPaymentMethodsDocument,
    "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddPaymentToOrderDocument,
    "\n  query GetProductData($slug: String!) {\n    product(slug: $slug) {\n      __typename\n      id\n      name\n      slug\n      description\n      facetValues {\n        id\n        name\n        code\n      }\n      optionGroups {\n        id\n        code\n        name\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n      assets {\n        id\n        preview\n      }\n      variants {\n        id\n        sku\n        priceWithTax\n        # facetValues {\n        #   id\n        #   name\n        #   code\n        #   facetId\n        #   facet {\n        #     id\n        #     name\n        #     code\n        #   }\n        # }\n        price\n        currencyCode\n        assets {\n          id\n          preview\n        }\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n    }\n  }\n": types.GetProductDataDocument,
    "\n  query GetAllCollections($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        slug\n        name\n        parentId\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n": types.GetAllCollectionsDocument,
    "\n  query GetTopLevelCollections {\n    collections(options: { topLevelOnly: true }) {\n      items {\n        id\n        slug\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n": types.GetTopLevelCollectionsDocument,
    "\n  query SearchProducts($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        productId\n        slug\n        collectionIds\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            value\n          }\n          ... on PriceRange {\n            min\n            max\n          }\n        }\n        productVariantId\n        productVariantName\n        currencyCode\n      }\n    }\n  }\n": types.SearchProductsDocument,
    "\n  query GetSearchSuggestions($input: SearchInput!) {\n    search(input: $input) {\n      items {\n        productName\n        slug\n      }\n    }\n  }\n": types.GetSearchSuggestionsDocument,
    "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        featuredAsset {\n          preview\n        }\n      }\n    }\n  }\n": types.GetProductsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on InsufficientStockError {\n        quantityAvailable\n        order {\n          ...ActiveOrder\n        }\n      }\n      ... on NegativeQuantityError {\n        errorCode\n        message\n      }\n\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n\n      ... on OrderLimitError {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AddItemToOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveItemFromOrder($lineId: ID!) {\n    removeOrderLine(orderLineId: $lineId) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').RemoveItemFromOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdjustItemQuantityInOrder($lineId: ID!, $quantity: Int!) {\n    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n      ... on OrderLimitError {\n        errorCode\n        message\n      }\n      ... on InsufficientStockError {\n        quantityAvailable\n        order {\n          ...ActiveOrder\n        }\n      }\n      ... on NegativeQuantityError {\n        errorCode\n        message\n      }\n      ... on OrderModificationError {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AdjustItemQuantityInOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SetOrderShippingAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetShippingMethod($id: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $id) {\n      __typename\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').SetShippingMethodDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {\n    login(username: $email, password: $password, rememberMe: $rememberMe) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').RegisterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordReset($email: String!) {\n    requestPasswordReset(emailAddress: $email) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').RequestPasswordResetDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getActiveCustomer {\n    activeCustomer {\n      id\n      title\n      firstName\n      lastName\n      emailAddress\n    }\n  }\n"): typeof import('./graphql').GetActiveCustomerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCollection($slug: String!) {\n    collection(slug: $slug) {\n      id\n      name\n      slug\n      parentId\n      children {\n        id\n        slug\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n    }\n  }\n"): typeof import('./graphql').GetCollectionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ActiveOrder on Order {\n    id\n    createdAt\n    updatedAt\n    totalQuantity\n    couponCodes\n    code\n    customer {\n      id\n      emailAddress\n      firstName\n      lastName\n      phoneNumber\n    }\n    payments {\n      id\n      method\n      amount\n      state\n      errorMessage\n    }\n    discounts {\n      type\n      description\n      amountWithTax\n      adjustmentSource\n    }\n    shipping\n    shippingWithTax\n    totalWithTax\n    subTotalWithTax\n    state\n    active\n    currencyCode\n    shippingLines {\n      shippingMethod {\n        id\n        name\n        description\n      }\n      priceWithTax\n    }\n    lines {\n      id\n      quantity\n      linePriceWithTax\n      unitPriceWithTax\n      discountedLinePriceWithTax\n      featuredAsset {\n        id\n        preview\n      }\n      productVariant {\n        name\n        id\n        sku\n        price\n        featuredAsset {\n          id\n          source\n        }\n        stockLevel\n        product {\n          facetValues {\n            id\n            name\n            code\n          }\n          name\n          slug\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ActiveOrderFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Order on Order {\n    ...ActiveOrder\n    shippingAddress {\n      fullName\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n    }\n    billingAddress {\n      fullName\n      streetLine1\n      streetLine2\n      city\n      province\n      postalCode\n    }\n  }\n"): typeof import('./graphql').OrderFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetActiveOrder {\n    activeOrder {\n      ...ActiveOrder\n    }\n  }\n"): typeof import('./graphql').GetActiveOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransitionToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ...ActiveOrder\n      ... on OrderStateTransitionError {\n        errorCode\n        message\n        transitionError\n        fromState\n        toState\n      }\n    }\n  }\n"): typeof import('./graphql').TransitionToStateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrderByCode($code: String!) {\n    orderByCode(code: $code) {\n      id\n      createdAt\n      updatedAt\n      totalQuantity\n      couponCodes\n      code\n      customer {\n        id\n        emailAddress\n        firstName\n        lastName\n        phoneNumber\n      }\n      payments {\n        id\n        method\n        amount\n        state\n        errorMessage\n      }\n      discounts {\n        type\n        description\n        amountWithTax\n        adjustmentSource\n      }\n      shipping\n      shippingWithTax\n      totalWithTax\n      subTotalWithTax\n      state\n      active\n      currencyCode\n      shippingLines {\n        shippingMethod {\n          id\n          name\n          description\n        }\n        priceWithTax\n      }\n      lines {\n        id\n        quantity\n        linePriceWithTax\n        unitPriceWithTax\n        discountedLinePriceWithTax\n        featuredAsset {\n          id\n          preview\n        }\n        productVariant {\n          name\n          id\n          sku\n          price\n          featuredAsset {\n            id\n            source\n          }\n          stockLevel\n          product {\n            facetValues {\n              id\n              name\n              code\n            }\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetOrderByCodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPaymentMethods {\n    eligiblePaymentMethods {\n      id\n      name\n      code\n      isEligible\n    }\n  }\n"): typeof import('./graphql').GetPaymentMethodsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ...ActiveOrder\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): typeof import('./graphql').AddPaymentToOrderDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProductData($slug: String!) {\n    product(slug: $slug) {\n      __typename\n      id\n      name\n      slug\n      description\n      facetValues {\n        id\n        name\n        code\n      }\n      optionGroups {\n        id\n        code\n        name\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n      assets {\n        id\n        preview\n      }\n      variants {\n        id\n        sku\n        priceWithTax\n        # facetValues {\n        #   id\n        #   name\n        #   code\n        #   facetId\n        #   facet {\n        #     id\n        #     name\n        #     code\n        #   }\n        # }\n        price\n        currencyCode\n        assets {\n          id\n          preview\n        }\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetProductDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllCollections($options: CollectionListOptions) {\n    collections(options: $options) {\n      items {\n        id\n        slug\n        name\n        parentId\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllCollectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetTopLevelCollections {\n    collections(options: { topLevelOnly: true }) {\n      items {\n        id\n        slug\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetTopLevelCollectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchProducts($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        productId\n        slug\n        collectionIds\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            value\n          }\n          ... on PriceRange {\n            min\n            max\n          }\n        }\n        productVariantId\n        productVariantName\n        currencyCode\n      }\n    }\n  }\n"): typeof import('./graphql').SearchProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSearchSuggestions($input: SearchInput!) {\n    search(input: $input) {\n      items {\n        productName\n        slug\n      }\n    }\n  }\n"): typeof import('./graphql').GetSearchSuggestionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        featuredAsset {\n          preview\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetProductsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
