'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/shared/button'
import { Input } from '@/components/shared/input/input'
import { ArrowRight, Minus, Plus, Share2, ShoppingCart } from 'lucide-react'
import { GetActiveCustomerQuery, GetProductDataQuery } from '@/graphql/graphql'
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import H1 from '@/components/shared/headings'
import { Badge } from '@/components/shared/badge'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import { vendureFetch } from '@/libs/vendure'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
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
  activeCustomer?: GetActiveCustomerQuery['activeCustomer']
}) {
  const optionGroups = product?.optionGroups || []
  const variants = product?.variants || []
  const currentVariant =
    product?.variants.find((v) => v.id === initialVariantId) || null
  const facets = product?.facetValues.map((facet) => facet.name) || []
  const router = useRouter()
  const cart = useCart()
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  // useEffect(() => {
  //   checkAuthStatus()
  // }, [])

  // const checkAuthStatus = async () => {
  //   try {
  //     const { data } = await vendureFetch({
  //       query: GET_ACTIVE_CUSTOMER,
  //     })
  //     if (data?.activeCustomer) {
  //       setIsAuthenticated(true)
  //     }
  //   } catch (error) {
  //     console.error('Error checking auth status:', error)
  //   }
  // }

  useEffect(() => {
    if (!currentVariant) return
    const newSelectedOptions: Record<string, string> = {}

    currentVariant?.options.forEach((option) => {
      newSelectedOptions[option.groupId] = option.id
    })

    setSelectedOptions(newSelectedOptions)
    setTotalPrice(currentVariant.priceWithTax * quantity)
  }, [currentVariant, quantity])

  const handleQuantityChange = (newQuantity: number) => {
    const updatedQuantity = Math.max(1, newQuantity)
    setQuantity(updatedQuantity)
  }

  const handleOptionChange = (groupId: string, optionId: string) => {
    const isFirstOptionGroup =
      optionGroups.indexOf(
        optionGroups.find((group) => group.id === groupId)!
      ) === 0
    let newVariant: Variant | null = null

    if (isFirstOptionGroup) {
      newVariant =
        variants.find((variant) =>
          variant.options.some(
            (option) => option.groupId === groupId && option.id === optionId
          )
        ) || null
    } else {
      const newSelectedOptions = { ...selectedOptions, [groupId]: optionId }
      newVariant =
        variants.find((variant) =>
          variant.options.every(
            (option) => newSelectedOptions[option.groupId] === option.id
          )
        ) || null
    }

    if (newVariant) {
      const updatedOptions: Record<string, string> = {}
      newVariant.options.forEach((option) => {
        updatedOptions[option.groupId] = option.id
      })
      setSelectedOptions(updatedOptions)
      setTotalPrice(newVariant.priceWithTax * quantity)

      router.replace(`?variant=${newVariant.id}`, { scroll: false })
    } else if (isFirstOptionGroup) {
      const resetOptions: Record<string, string> = { [groupId]: optionId }
      setSelectedOptions(resetOptions)
      setTotalPrice(null)
    }
  }
  const getAvailableOptions = (groupId: string) => {
    const isFirstOptionGroup =
      optionGroups.indexOf(
        optionGroups.find((group) => group.id === groupId)!
      ) === 0
    if (isFirstOptionGroup) {
      return new Set(
        optionGroups
          .find((group) => group.id === groupId)
          ?.options.map((option) => option.id)
      )
    } else {
      const firstGroupId = optionGroups[0].id
      const firstGroupSelectedOptionId = selectedOptions[firstGroupId]
      return new Set(
        variants
          .filter((variant) =>
            variant.options.some(
              (option) =>
                option.groupId === firstGroupId &&
                option.id === firstGroupSelectedOptionId
            )
          )
          .flatMap((variant) => variant.options)
          .filter((option) => option.groupId === groupId)
          .map((option) => option.id)
      )
    }
  }
  if (!currentVariant || !product) {
    return null // or a loading state
  }

  return (
    <div className="space-y-10 rounded-lg md:border-2 md:p-6 lg:w-[450px]">
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
      <div className="space-y-2">
        <H1 className="text-base font-semibold lg:text-xl lg:font-semibold">
          {product.name}
        </H1>
        {currentVariant && (
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-medium text-primary">
              ${(currentVariant.priceWithTax / 100).toFixed(2)}{' '}
              {currentVariant.currencyCode}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${(currentVariant.price / 100).toFixed(2)}{' '}
              {currentVariant.currencyCode}
            </span>
          </div>
        )}
      </div>
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
                {group.options.map((option) => {
                  const isAvailable = availableOptions.has(option.id)
                  return (
                    <div key={option.id}>
                      <RadioGroupItem
                        value={option.id}
                        id={`${group.code}-${option.id}`}
                        className="sr-only"
                        disabled={!isAvailable && index !== 0}
                      />
                      <Label
                        htmlFor={`${group.code}-${option.id}`}
                        className={`cursor-pointer rounded-md border px-4 py-2 ${
                          selectedOptions[group.id] === option.id
                            ? 'border-purple-500 bg-purple-100'
                            : 'hover:bg-gray-100'
                        } ${
                          !isAvailable && index !== 0
                            ? 'cursor-not-allowed opacity-50'
                            : ''
                        }`}
                      >
                        {option.name}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Selecciona la cantidad</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-full"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-full text-center"
          />
          <Button
            variant="outline"
            size="icon"
            className="w-full"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {currentVariant && totalPrice !== null && (
        <div className="rounded-md bg-slate-100 p-4">
          <p className="text-base font-semibold">Total:</p>
          <p className="text-xl font-medium text-primary">
            ${(totalPrice / 100).toFixed(2)} {currentVariant.currencyCode}
          </p>
        </div>
      )}

      <div className="w-full space-y-2">
        <Link
          href={
            cart.isLogged
              ? '/cart'
              : '/account/login?callback=/catalog/details/' +
                product.slug +
                '?variantId=' +
                currentVariant.id
          }
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
        >
          Comprar ahora
          <ShoppingCart className="ml-2 h-4 w-4" />
        </Link>

        <Button
          variant="outline"
          onClick={() => cart.addToCart(currentVariant.id, quantity)}
          className="w-full"
        >
          Agregar al carrito
          <ShoppingCart className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <PaymentMethods />
    </div>
  )
}

const PaymentMethods = () => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Métodos de pago disponibles</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Binance
        </Button>
        <Button variant="outline" size="sm">
          Paypal
        </Button>
        <Button variant="outline" size="sm">
          Pago Móvil
        </Button>
        <Button variant="outline" size="sm">
          Transferencia
        </Button>
      </div>
    </div>
  )
}
