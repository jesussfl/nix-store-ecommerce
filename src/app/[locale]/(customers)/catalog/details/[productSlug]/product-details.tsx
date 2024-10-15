'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/shared/button'
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import { Input } from '@/components/shared/input/input'
import { Share2 } from 'lucide-react'

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

interface OptionGroup {
  id: string
  code: string
  name: string
  options: ProductOption[]
}

interface ProductDetailsProps {
  title: string
  variants: Variant[]
  optionGroups: OptionGroup[]
  initialVariantId?: string
}

export function ProductDetails({
  title,
  variants,
  optionGroups,
  initialVariantId,
}: ProductDetailsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

  useEffect(() => {
    const variantId = searchParams.get('variant') || initialVariantId
    const variant = variants.find((v) => v.id === variantId) || variants[0]
    if (variant) {
      setSelectedVariant(variant)
      const newSelectedOptions: Record<string, string> = {}
      variant.options.forEach((option) => {
        newSelectedOptions[option.groupId] = option.id
      })
      setSelectedOptions(newSelectedOptions)
    }
  }, [variants, initialVariantId, searchParams])

  const handleOptionChange = (groupId: string, optionId: string) => {
    const isFirstOptionGroup =
      optionGroups.indexOf(
        optionGroups.find((group) => group.id === groupId)!
      ) === 0
    let newVariant: Variant | null = null

    if (isFirstOptionGroup) {
      // For the first option group, find a variant that matches the selected option
      newVariant =
        variants.find((variant) =>
          variant.options.some(
            (option) => option.groupId === groupId && option.id === optionId
          )
        ) || null
    } else {
      // For other option groups, find a variant that matches all currently selected options
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
      setSelectedVariant(newVariant)
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('variant', newVariant.id)
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    } else if (isFirstOptionGroup) {
      // If no variant found for the first option group, reset other options
      const resetOptions: Record<string, string> = { [groupId]: optionId }
      setSelectedOptions(resetOptions)
      setSelectedVariant(null)
    }
  }

  const getAvailableOptions = (groupId: string) => {
    const isFirstOptionGroup =
      optionGroups.indexOf(
        optionGroups.find((group) => group.id === groupId)!
      ) === 0
    if (isFirstOptionGroup) {
      // All options are available for the first group
      return new Set(
        optionGroups
          .find((group) => group.id === groupId)
          ?.options.map((option) => option.id)
      )
    } else {
      // For other groups, filter based on the selected option in the first group
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
  console.log(selectedVariant)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
          Por Encargo
        </span>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {selectedVariant && (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-purple-600">
            ${(selectedVariant.priceWithTax / 100).toFixed(2)}{' '}
            {selectedVariant.currencyCode}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${(selectedVariant.price / 100).toFixed(2)}{' '}
            {selectedVariant.currencyCode}
          </span>
        </div>
      )}
      {optionGroups.map((group, index) => {
        const availableOptions = getAvailableOptions(group.id)
        return (
          <div key={group.id}>
            <h3 className="mb-2 font-medium">{group.name}:</h3>
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
      <div>
        <h3 className="mb-2 font-medium">Selecciona la cantidad</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
      <Button className="w-full bg-purple-600 hover:bg-purple-700">
        Comprar Ahora
      </Button>
      <Button variant="outline" className="w-full">
        Agregar al carrito
      </Button>
      <div>
        <h3 className="mb-2 font-medium">Métodos de pago disponibles</h3>
        <div className="flex gap-2">
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
    </div>
  )
}
