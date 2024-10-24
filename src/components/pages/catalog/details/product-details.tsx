'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/button'
import { Input } from '@/components/shared/input/input'
import { Minus, Plus, Share2, ShoppingCart } from 'lucide-react'
import { GetProductDataQuery } from '@/graphql/graphql'
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import H1 from '@/components/shared/headings'
import { Badge } from '@/components/shared/badge'
import { useCart } from '@/components/cart/cart-context'

interface Asset {
  id: string
  preview: string
}

interface ProductOption {
  id: string
  code: string
  name: string
  groupId: string
}

interface Variant {
  id: string
  sku: string
  priceWithTax: number
  price: number
  currencyCode: string
  assets: Asset[]
  options: ProductOption[]
}

export default function ProductDetails({
  product,
  initialVariantId,
}: {
  product: GetProductDataQuery['product']
  initialVariantId: string
}) {
  const router = useRouter()
  const { isLoading, isLogged, fetchActiveOrder, addToCart } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})
  const optionGroups = product?.optionGroups || []
  const variants = product?.variants || []
  const currentVariant = variants.find((v) => v.id === initialVariantId) || null
  const facets = product?.facetValues.map((facet) => facet.name) || []

  // Fetch the active order on mount
  useEffect(() => {
    if (!isLoading) {
      fetchActiveOrder()
    }
  }, [isLoading, fetchActiveOrder])

  // Update selected options and price when the variant or quantity changes
  useEffect(() => {
    if (!currentVariant) return
    const initialOptions = currentVariant.options.reduce(
      (acc, option) => {
        acc[option.groupId] = option.id
        return acc
      },
      {} as Record<string, string>
    )
    setSelectedOptions(initialOptions)
    setTotalPrice(currentVariant.priceWithTax * quantity)
  }, [currentVariant, quantity])

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity))
  }

  const handleOptionChange = (groupId: string, optionId: string) => {
    const isFirstGroup = optionGroups[0]?.id === groupId
    let updatedVariant = null

    if (isFirstGroup) {
      updatedVariant =
        variants.find((variant) =>
          variant.options.some(
            (option) => option.groupId === groupId && option.id === optionId
          )
        ) || null
    } else {
      const newSelectedOptions = { ...selectedOptions, [groupId]: optionId }
      updatedVariant =
        variants.find((variant) =>
          variant.options.every(
            (option) => newSelectedOptions[option.groupId] === option.id
          )
        ) || null
    }

    if (updatedVariant) {
      const newOptions = updatedVariant.options.reduce(
        (acc, option) => {
          acc[option.groupId] = option.id
          return acc
        },
        {} as Record<string, string>
      )

      setSelectedOptions(newOptions)
      setTotalPrice(updatedVariant.priceWithTax * quantity)
      router.replace(`?variant=${updatedVariant.id}`, { scroll: false })
    } else if (isFirstGroup) {
      setSelectedOptions({ [groupId]: optionId })
      setTotalPrice(null)
    }
  }

  const getAvailableOptions = (groupId: string) => {
    const isFirstGroup = optionGroups[0]?.id === groupId
    if (isFirstGroup) {
      return new Set(
        optionGroups
          .find((group) => group.id === groupId)
          ?.options.map((option) => option.id)
      )
    } else {
      const firstGroupOption = selectedOptions[optionGroups[0].id]
      return new Set(
        variants
          .filter((variant) =>
            variant.options.some(
              (option) =>
                option.groupId === optionGroups[0].id &&
                option.id === firstGroupOption
            )
          )
          .flatMap((variant) => variant.options)
          .filter((option) => option.groupId === groupId)
          .map((option) => option.id)
      )
    }
  }

  if (!currentVariant || !product) return null

  return (
    <div className="space-y-10 rounded-lg md:border-2 md:p-6 lg:w-[450px]">
      <ProductBadges facets={facets} />
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
      />
      {totalPrice !== null && (
        <TotalPrice
          totalPrice={totalPrice}
          currencyCode={currentVariant.currencyCode}
        />
      )}
      <PurchaseActions
        isLogged={isLogged}
        isLoading={isLoading}
        productSlug={product.slug}
        currentVariant={currentVariant}
        quantity={quantity}
        addToCart={addToCart}
      />
      <PaymentMethods />
    </div>
  )
}

const ProductBadges = ({ facets }: { facets: string[] }) => (
  <div className="flex flex-wrap items-center gap-2">
    {facets.map((facet) => (
      <Badge key={facet} variant="default" className="text-xs">
        {facet}
      </Badge>
    ))}
    <Button variant="secondary" size="icon">
      <Share2 className="h-4 w-4" />
    </Button>
  </div>
)

const ProductHeading = ({
  productName,
  currentVariant,
}: {
  productName: string
  currentVariant: Variant
}) => (
  <div className="space-y-2">
    <H1 className="text-base font-semibold lg:text-xl lg:font-semibold">
      {productName}
    </H1>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-medium text-primary">
        ${(currentVariant.priceWithTax / 100).toFixed(2)}{' '}
        {currentVariant.currencyCode}
      </span>
      <span className="text-sm text-gray-500 line-through">
        ${(currentVariant.price / 100).toFixed(2)} {currentVariant.currencyCode}
      </span>
    </div>
  </div>
)

const ProductOptions = ({
  optionGroups,
  selectedOptions,
  getAvailableOptions,
  handleOptionChange,
}: {
  optionGroups: any[]
  selectedOptions: Record<string, string>
  getAvailableOptions: (groupId: string) => Set<string>
  handleOptionChange: (groupId: string, optionId: string) => void
}) => (
  <div className="space-y-4">
    {optionGroups.map((group, index) => {
      const availableOptions = getAvailableOptions(group.id)
      return (
        <div key={group.id} className="space-y-2">
          <p className="text-sm font-semibold">{group.name}:</p>
          <RadioGroup
            value={selectedOptions[group.id] || ''}
            onValueChange={(value) => handleOptionChange(group.id, value)}
            className="flex flex-wrap gap-2"
          >
            {group.options.map((option) => (
              <OptionLabel
                key={option.id}
                option={option}
                group={group}
                isSelected={selectedOptions[group.id] === option.id}
                isAvailable={availableOptions.has(option.id)}
                index={index}
              />
            ))}
          </RadioGroup>
        </div>
      )
    })}
  </div>
)

const OptionLabel = ({
  option,
  group,
  isSelected,
  isAvailable,
  index,
}: {
  option: ProductOption
  group: { code: string }
  isSelected: boolean
  isAvailable: boolean
  index: number
}) => (
  <div key={option.id}>
    <RadioGroupItem
      value={option.id}
      id={`${group.code}-${option.id}`}
      className="sr-only"
      disabled={!isAvailable && index !== 0}
    />
    <Label
      htmlFor={`${group.code}-${option.id}`}
      className={`cursor-pointer rounded-md border px-4 py-2 ${isSelected ? 'border-purple-500 bg-purple-100' : 'hover:bg-gray-100'} ${
        !isAvailable && index !== 0 ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {option.name}
    </Label>
  </div>
)

const ProductQuantity = ({
  quantity,
  onQuantityChange,
}: {
  quantity: number
  onQuantityChange: (newQuantity: number) => void
}) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">Selecciona la cantidad</p>
    <div className="flex justify-center gap-4">
      <Button
        variant="secondary"
        className=""
        onClick={() => onQuantityChange(quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        readOnly
        value={quantity}
        className="w-full text-center"
      />
      <Button
        className=""
        variant="secondary"
        onClick={() => onQuantityChange(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
)

const TotalPrice = ({
  totalPrice,
  currencyCode,
}: {
  totalPrice: number
  currencyCode: string
}) => (
  <div className="flex justify-between text-sm font-medium text-gray-900">
    <p>Total price:</p>
    <p>
      ${(totalPrice / 100).toFixed(2)} {currencyCode}
    </p>
  </div>
)

const PurchaseActions = ({
  isLogged,
  isLoading,
  productSlug,
  currentVariant,
  quantity,
  addToCart,
}: {
  isLogged: boolean
  isLoading: boolean
  productSlug: string
  currentVariant: Variant
  quantity: number
  addToCart: (productVariantId: string, quantity: number) => Promise<void>
}) => {
  const router = useRouter()
  const handleCheckout = async () => {
    if (!isLogged) {
      router.push('/account/login?callback=/catalog/details/')
      return
    }
    router.push(`/checkout?slug=${productSlug}`)
  }
  const handleAddToCart = async () => {
    if (!isLogged) {
      router.push('/account/login?callback=/catalog/details/')
      return
    }
    await addToCart(currentVariant.id, quantity)
  }

  return (
    <div className="space-y-4">
      <Button variant="default" onClick={handleCheckout} className="w-full">
        Proceed to Checkout
      </Button>
      <Button variant={'outline'} onClick={handleAddToCart} className="w-full">
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? 'Loading...' : 'Add to Cart'}
      </Button>
    </div>
  )
}

const PaymentMethods = () => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">Accepted Payment Methods</p>
    <div className="flex space-x-2">
      {/* Insert icons for payment methods here */}
    </div>
  </div>
)
