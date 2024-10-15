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
    "\n  query GetProductData($slug: String!) {\n    product(slug: $slug) {\n      __typename\n      id\n      name\n      slug\n      description\n      optionGroups {\n        id\n        code\n        name\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n      assets {\n        id\n        preview\n      }\n      variants {\n        id\n        sku\n        priceWithTax\n        price\n        currencyCode\n        assets {\n          id\n          preview\n        }\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n    }\n  }\n": types.GetProductDataDocument,
    "\n  query GetAllCollections {\n    collections {\n      items {\n        id\n        slug\n        name\n        parentId\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n": types.GetAllCollectionsDocument,
    "\n  query GetTopLevelCollections {\n    collections(options: { topLevelOnly: true }) {\n      items {\n        id\n        slug\n        name\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n": types.GetTopLevelCollectionsDocument,
    "\n  query SearchProducts($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      facetValues {\n        count\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n      }\n      items {\n        productName\n        productId\n        slug\n        collectionIds\n        productAsset {\n          id\n          preview\n        }\n        priceWithTax {\n          ... on SinglePrice {\n            value\n          }\n          ... on PriceRange {\n            min\n            max\n          }\n        }\n        productVariantId\n        productVariantName\n        currencyCode\n      }\n    }\n  }\n": types.SearchProductsDocument,
    "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        featuredAsset {\n          preview\n        }\n      }\n    }\n  }\n": types.GetProductsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProductData($slug: String!) {\n    product(slug: $slug) {\n      __typename\n      id\n      name\n      slug\n      description\n      optionGroups {\n        id\n        code\n        name\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n      featuredAsset {\n        id\n        preview\n      }\n      assets {\n        id\n        preview\n      }\n      variants {\n        id\n        sku\n        priceWithTax\n        price\n        currencyCode\n        assets {\n          id\n          preview\n        }\n        options {\n          id\n          code\n          name\n          groupId\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetProductDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllCollections {\n    collections {\n      items {\n        id\n        slug\n        name\n        parentId\n        featuredAsset {\n          id\n          preview\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetAllCollectionsDocument;
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
export function graphql(source: "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      items {\n        id\n        name\n        featuredAsset {\n          preview\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetProductsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
