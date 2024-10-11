'use client'
import { useState } from 'react'
import { Button } from '@/components/shared/button'
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import { Input } from '@/components/shared/input/input'
import { Share2 } from 'lucide-react'
import Image from 'next/image'

interface ProductDetailsProps {
  title: string
  price: number
  originalPrice: number
  colors: { name: string; image: string }[]
  sizes: string[]
}

export function ProductDetails({
  title,
  price,
  originalPrice,
  colors,
  sizes,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)

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
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-purple-600">
          ${price.toFixed(2)} USD
        </span>
        <span className="text-sm text-gray-500 line-through">
          ${originalPrice.toFixed(2)} USD
        </span>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Color:</h3>
        <RadioGroup defaultValue={colors[0].name} className="flex gap-2">
          {colors.map((color) => (
            <div key={color.name}>
              <RadioGroupItem
                value={color.name}
                id={`color-${color.name}`}
                className="sr-only"
              />
              <Label htmlFor={`color-${color.name}`} className="cursor-pointer">
                <Image
                  src={color.image}
                  alt={color.name}
                  width={60}
                  height={60}
                  className="rounded-md border-2 border-transparent hover:border-purple-600"
                />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Talla:</h3>
        <RadioGroup defaultValue={sizes[0]} className="flex gap-2">
          {sizes.map((size) => (
            <div key={size}>
              <RadioGroupItem
                value={size}
                id={`size-${size}`}
                className="sr-only"
              />
              <Label
                htmlFor={`size-${size}`}
                className="cursor-pointer rounded-md border px-4 py-2 hover:bg-gray-100"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
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
