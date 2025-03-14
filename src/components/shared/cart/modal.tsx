/* eslint-disable */
'use client'
import { RiShoppingCartLine } from '@remixicon/react'
import { useCallback, useEffect, useState, ReactNode } from 'react'
import { Button, buttonVariants } from '@/components/shared/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { useCart } from '@/components/cart/cart-context'
import { AlertCircle, Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { ScrollArea } from '@/components/shared/scroll-area/scroll-area'
import { Separator } from '@/components/shared/separator/separator'
import { debounce } from 'lodash'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import { fetchCurrentStockLevel } from '@/libs/queries/product'
import { Alert, AlertDescription } from '@/components/shared/alert'

// Definir tipos para los componentes de tooltip
interface TooltipComponentProps {
  children: ReactNode
}

interface TooltipTriggerProps extends TooltipComponentProps {
  asChild?: boolean
}

// Importación condicional para evitar errores si el módulo no está disponible
let TooltipProvider: React.FC<TooltipComponentProps>
let Tooltip: React.FC<TooltipComponentProps>
let TooltipTrigger: React.FC<TooltipTriggerProps>
let TooltipContent: React.FC<TooltipComponentProps>

try {
  const tooltipModule = require('@/components/shared/tooltip')
  TooltipProvider = tooltipModule.TooltipProvider
  Tooltip = tooltipModule.Tooltip
  TooltipTrigger = tooltipModule.TooltipTrigger
  TooltipContent = tooltipModule.TooltipContent
} catch (error) {
  // Fallback para cuando el módulo no está disponible
  TooltipProvider = ({ children }: TooltipComponentProps) => <>{children}</>
  Tooltip = ({ children }: TooltipComponentProps) => <>{children}</>
  TooltipTrigger = ({ children, asChild }: TooltipTriggerProps) =>
    asChild ? <>{children}</> : <div>{children}</div>
  TooltipContent = ({ children }: TooltipComponentProps) => (
    <div className="hidden">{children}</div>
  )
}

export default function CartModal({ bcvPrice }: { bcvPrice: number }) {
  const {
    activeOrder,
    fetchActiveOrder,
    removeFromCart,
    setItemQuantityInCart,
    isLoading,
  } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [pricingLoading, setPricingLoading] = useState(false) // Loader for pricing
  const [localQuantities, setLocalQuantities] = useState<{
    [key: string]: number
  }>({})
  const [stockLevels, setStockLevels] = useState<{
    [key: string]: { available: number; loading: boolean; error: string | null }
  }>({})
  const [updateErrors, setUpdateErrors] = useState<{
    [key: string]: string | null
  }>({})

  useEffect(() => {
    if (!isLoading) return
    fetchActiveOrder()
  }, [fetchActiveOrder, isLoading])

  // Cargar los niveles de stock cuando se abre el modal y cuando cambia el pedido activo
  useEffect(() => {
    if (!isOpen || !activeOrder || !activeOrder.lines) return

    const fetchStockForAllItems = async () => {
      const newStockLevels = { ...stockLevels }

      // Inicializar los niveles de stock como cargando
      activeOrder.lines.forEach((line) => {
        if (!newStockLevels[line.id]) {
          newStockLevels[line.id] = {
            available: 0,
            loading: true,
            error: null,
          }
        }
      })
      setStockLevels(newStockLevels)

      // Fetch stock levels para cada línea
      for (const line of activeOrder.lines) {
        try {
          const stockLevel = await fetchCurrentStockLevel(
            line.productVariant.id
          )
          setStockLevels((prev) => ({
            ...prev,
            [line.id]: {
              available: stockLevel,
              loading: false,
              error: null,
            },
          }))
        } catch (error) {
          console.error(
            `Error fetching stock for ${line.productVariant.name}:`,
            error
          )
          setStockLevels((prev) => ({
            ...prev,
            [line.id]: {
              available: line.quantity, // Usar la cantidad actual como valor por defecto conservador
              loading: false,
              error: 'Error al obtener stock disponible',
            },
          }))
        }
      }
    }

    fetchStockForAllItems()
  }, [isOpen, activeOrder])

  const debouncedUpdateQuantity = useCallback(
    debounce(
      async (lineId: string, newQuantity: number, currentStock: number) => {
        setPricingLoading(true) // Start loader for pricing
        setUpdateErrors((prev) => ({ ...prev, [lineId]: null }))

        // Validation against stock level
        if (newQuantity > currentStock) {
          setUpdateErrors((prev) => ({
            ...prev,
            [lineId]: `Solo hay ${currentStock} unidades disponibles`,
          }))
          // Revert to available quantity
          setLocalQuantities((prev) => ({
            ...prev,
            [lineId]: Math.min(newQuantity, currentStock),
          }))
          setPricingLoading(false)
          return
        }

        try {
          if (newQuantity > 0) {
            const result = await setItemQuantityInCart(lineId, newQuantity)

            // Check for errors in response
            if (
              result &&
              typeof result === 'object' &&
              'errorCode' in result &&
              result.errorCode === 'INSUFFICIENT_STOCK_ERROR'
            ) {
              const availableStock =
                'quantityAvailable' in result
                  ? (result.quantityAvailable as number)
                  : 0
              setUpdateErrors((prev) => ({
                ...prev,
                [lineId]: `Solo hay ${availableStock} unidades disponibles`,
              }))
              // Update stock levels with correct value
              setStockLevels((prev) => ({
                ...prev,
                [lineId]: {
                  available: availableStock,
                  loading: false,
                  error: null,
                },
              }))
              // Revert to available quantity
              setLocalQuantities((prev) => ({
                ...prev,
                [lineId]: availableStock,
              }))
            }
          } else {
            await removeFromCart(lineId)
          }
        } catch (error) {
          console.error('Error updating quantity:', error)
          setUpdateErrors((prev) => ({
            ...prev,
            [lineId]: 'Error al actualizar cantidad',
          }))
        } finally {
          setPricingLoading(false) // Stop loader for pricing
        }
      },
      600
    ),
    [setItemQuantityInCart, removeFromCart]
  )

  const handleQuantityChange = (
    lineId: string,
    currentQuantity: number,
    change: number,
    variantId: string
  ) => {
    const newQuantity =
      (localQuantities[lineId] !== undefined
        ? localQuantities[lineId]
        : currentQuantity) + change
    if (newQuantity < 0) return // Prevent negative quantities

    // Get current stock level
    const currentStock = stockLevels[lineId]?.available || currentQuantity

    // If increasing quantity and would exceed stock, show warning but don't update
    if (change > 0 && newQuantity > currentStock) {
      setUpdateErrors((prev) => ({
        ...prev,
        [lineId]: `Solo hay ${currentStock} unidades disponibles`,
      }))
      return
    }

    // Update the local state immediately for a quick UI response
    setLocalQuantities((prev) => ({ ...prev, [lineId]: newQuantity }))
    setUpdateErrors((prev) => ({ ...prev, [lineId]: null }))

    // Debounced server update
    debouncedUpdateQuantity(lineId, newQuantity, currentStock)
  }

  const isMaxStock = (lineId: string, quantity: number) => {
    const stock = stockLevels[lineId]?.available || 0
    return quantity >= stock && stock > 0
  }

  // Componente de tooltip simplificado si no está disponible el módulo
  const renderTooltip = (
    children: ReactNode,
    content: ReactNode,
    isVisible: boolean
  ) => {
    if (!TooltipProvider) {
      return children
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          {isVisible && <TooltipContent>{content}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <RiShoppingCartLine className="h-5 w-5" />
          {activeOrder && activeOrder.totalQuantity > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeOrder.totalQuantity}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] pt-16 sm:w-[400px]">
        <h2 className="mb-4 text-center text-2xl font-semibold">Mi Carrito</h2>
        {activeOrder && activeOrder.lines && activeOrder.lines.length > 0 ? (
          <>
            <ScrollArea className="h-[calc(100vh-300px)] pr-4">
              {activeOrder.lines.map((line) => (
                <div key={line.id} className="flex flex-col space-y-2 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={
                          line.featuredAsset?.preview ||
                          '/placeholder.svg?height=64&width=64'
                        }
                        alt={line.productVariant.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">
                        {line.productVariant.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {(line.unitPriceWithTax / 100).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: activeOrder.currencyCode,
                        })}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(
                              line.id,
                              line.quantity,
                              -1,
                              line.productVariant.id
                            )
                          }
                          disabled={
                            (localQuantities[line.id] !== undefined
                              ? localQuantities[line.id]
                              : line.quantity) <= 1 ||
                            stockLevels[line.id]?.loading
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          {localQuantities[line.id] !== undefined
                            ? localQuantities[line.id]
                            : line.quantity}
                        </span>
                        {renderTooltip(
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(
                                  line.id,
                                  line.quantity,
                                  1,
                                  line.productVariant.id
                                )
                              }
                              disabled={
                                stockLevels[line.id]?.loading ||
                                isMaxStock(
                                  line.id,
                                  localQuantities[line.id] !== undefined
                                    ? localQuantities[line.id]
                                    : line.quantity
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>,
                          <p>Stock máximo alcanzado</p>,
                          isMaxStock(
                            line.id,
                            localQuantities[line.id] !== undefined
                              ? localQuantities[line.id]
                              : line.quantity
                          )
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(line.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stock disponible */}
                  {!stockLevels[line.id]?.loading && (
                    <div className="ml-20 text-xs text-gray-500">
                      {(stockLevels[line.id]?.available || 0) > 10
                        ? ''
                        : `Disponible: ${stockLevels[line.id]?.available || 0} unidades`}
                    </div>
                  )}

                  {/* Errores */}
                  {updateErrors[line.id] && (
                    <div className="ml-20">
                      <Alert variant="destructive" className="py-1 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {updateErrors[line.id]}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                {pricingLoading ? ( // Loader for subtotal
                  <span className="loader">Cargando...</span>
                ) : (
                  <span>
                    {(activeOrder.subTotalWithTax / 100).toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: activeOrder.currencyCode,
                      }
                    )}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                {pricingLoading ? ( // Loader for shipping
                  <span className="loader">Cargando...</span>
                ) : (
                  <span>
                    {(activeOrder.shippingWithTax / 100).toLocaleString(
                      'es-ES',
                      {
                        style: 'currency',
                        currency: activeOrder.currencyCode,
                      }
                    )}
                  </span>
                )}
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                {pricingLoading ? ( // Loader for total
                  <span className="loader">Cargando...</span>
                ) : (
                  <span>
                    {(activeOrder.totalWithTax / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: activeOrder.currencyCode,
                    })}{' '}
                    {`${((activeOrder.totalWithTax / 100) * bcvPrice).toFixed(2)} Bs`}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'mt-4 w-full'
              )}
              onClick={() => setIsOpen(false)}
            >
              Continuar compra
            </Link>
          </>
        ) : (
          <>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <p className="text-center text-muted-foreground">
                Tu carrito está vacío
              </p>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
