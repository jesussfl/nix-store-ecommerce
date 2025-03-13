import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CurrencyCode, GetProductDataQuery } from '@/graphql/graphql'
import { useCart } from '@/components/cart/cart-context'
import { fetchCurrentStockLevel } from '@/libs/queries/product'

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
  stockLevel: string
}

export interface ProductDetailsProps {
  product: GetProductDataQuery['product']
  initialVariantId: string
  bcvPrice: number
}

export function useProductDetails({
  product,
  initialVariantId,
  bcvPrice,
}: ProductDetailsProps) {
  const router = useRouter()
  const { isLoading, isLogged, fetchActiveOrder } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({})
  const [availableStock, setAvailableStock] = useState<number>(0)
  const [isStockLoading, setIsStockLoading] = useState<boolean>(true)

  const optionGroups = product?.optionGroups || []
  const variants = product?.variants || []
  const currentVariant = variants.find((v) => v.id === initialVariantId) || null
  const specialBadges = [
    'disponibilidad-inmediata',
    'por-encargo',
    'personalizado',
  ]
  const facets =
    product?.facetValues.filter((facet) =>
      specialBadges.includes(facet.code)
    ) || []

  // Fetch the active order on mount
  useEffect(() => {
    if (!isLoading) {
      fetchActiveOrder()
    }
  }, [isLoading, fetchActiveOrder])

  // Fetch current stock level when variant changes
  useEffect(() => {
    const updateStockLevel = async () => {
      if (!currentVariant) return

      setIsStockLoading(true)
      try {
        const stockLevel = await fetchCurrentStockLevel(currentVariant.id)
        setAvailableStock(stockLevel)
      } catch (error) {
        console.error('Error fetching stock level:', error)
        // Si hay un error, usamos un valor conservador basado en el stockLevel del producto
        if (currentVariant.stockLevel === 'OUT_OF_STOCK') {
          setAvailableStock(0)
        } else if (currentVariant.stockLevel === 'LOW_STOCK') {
          setAvailableStock(5) // Valor conservador para stock bajo
        } else {
          setAvailableStock(999) // Stock alto por defecto
        }
      } finally {
        setIsStockLoading(false)
      }
    }

    updateStockLevel()
  }, [currentVariant])

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
    // No permitir más que el stock disponible
    const maxQuantity = availableStock
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)))
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

      // Resetear la cantidad a 1 al cambiar de variante
      setQuantity(1)
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

  return {
    product,
    currentVariant,
    optionGroups,
    quantity,
    totalPrice,
    selectedOptions,
    facets,
    bcvPrice,
    isLoading,
    isLogged,
    availableStock,
    isStockLoading,
    handleQuantityChange,
    handleOptionChange,
    getAvailableOptions,
  }
}

export type { Asset, ProductOption, Variant }
