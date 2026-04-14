'use client'

import { useProductDetails } from './hooks/use-product-details'
import { ProductBadges } from './components/product-badges'
import { ProductHeading } from './components/product-heading'
import { ProductOptions } from './components/product-options'
import { ProductQuantity } from './components/product-quantity'
import { TotalPrice } from './components/total-price'
import { SpecialOrderMessage } from './components/special-order-message'
import { PurchaseActions } from './components/purchase-actions'
import { GetProductDataQuery } from '@/graphql/graphql'
import { useCart } from '@/components/cart/cart-context'
import { useCallback } from 'react'

export default function ProductDetails({
  product,
  initialVariantId,
  bcvPrice,
}: {
  product: GetProductDataQuery['product']
  initialVariantId: string
  bcvPrice: number
}) {
  const { addToCart: originalAddToCart } = useCart()

  const addToCart = useCallback(
    async (productVariantId: string, quantity: number) => {
      try {
        const result = await originalAddToCart(productVariantId, quantity)
        if (typeof result === 'undefined') {
          return {
            success: true,
          }
        }
        return result
      } catch (error) {
        console.error('Error adding to cart:', error)
        return {
          success: false,
          errorCode: 'UNEXPECTED_ERROR',
          message: 'Error inesperado al añadir al carrito',
        }
      }
    },
    [originalAddToCart]
  )

  const {
    currentVariant,
    optionGroups,
    quantity,
    totalPrice,
    selectedOptions,
    facets,
    isLoading,
    isLogged,
    availableStock,
    isStockLoading,
    handleQuantityChange,
    handleOptionChange,
    getAvailableOptions,
  } = useProductDetails({
    product,
    initialVariantId,
    bcvPrice,
  })

  if (!product || !currentVariant) return null

  return (
    <div className="space-y-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:space-y-8 sm:rounded-[1.75rem] sm:p-6 xl:sticky xl:top-28">
      <ProductBadges facets={facets.map((f) => f.name)} />
      <ProductHeading
        productName={product.name}
        currentVariant={currentVariant}
      />
      <ProductOptions
        optionGroups={optionGroups}
        selectedOptions={selectedOptions}
        getAvailableOptions={getAvailableOptions}
        handleOptionChange={handleOptionChange}
      />
      <ProductQuantity
        quantity={quantity}
        onQuantityChange={handleQuantityChange}
        availableStock={availableStock}
        isStockLoading={isStockLoading}
      />
      {totalPrice !== null && (
        <TotalPrice
          bcvPrice={bcvPrice}
          totalPrice={totalPrice}
          currencyCode={currentVariant.currencyCode}
        />
      )}
      <SpecialOrderMessage
        isImmediatelyAvailable={
          facets.find((facet) => facet.code === 'disponibilidad-inmediata') !==
          undefined
        }
      />
      <PurchaseActions
        isLogged={isLogged}
        isLoading={isLoading}
        productSlug={product.slug}
        currentVariant={currentVariant}
        quantity={quantity}
        addToCart={addToCart}
        availableStock={availableStock}
      />
    </div>
  )
}
