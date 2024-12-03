'use client'

import { useFormContext } from 'react-hook-form'
import { useCart } from '@/components/cart/cart-context'
import { Input } from '@/components/shared/input/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shared/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select/select'
import { Loader2 } from 'lucide-react'
import { LOCATIONS } from './locations'
import { useEffect } from 'react'

export default function DeliveryFields() {
  const { control, watch, setValue } = useFormContext()
  const { isOrderLoading, setShippingOrderAddress } = useCart()
  const selectedLocation = watch('shippingDetails.locationObject')

  const handleLocationChange = async (value: string) => {
    const location = LOCATIONS.find((loc) => loc.name === value)
    if (location) {
      const shippingAddressResult = await setShippingOrderAddress({
        city: location.name,
        countryCode: 'VE',
        province: 'Aragua',
        streetLine1: location.name,
      })

      if (shippingAddressResult) {
        setValue('shippingDetails.location', `${location.name}`)
        setValue('shippingDetails.locationObject', location)
      }
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="shippingDetails.location"
        rules={{ required: 'Este campo es obligatorio' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ubicación</FormLabel>
            <Select
              onValueChange={handleLocationChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una ubicación" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LOCATIONS.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 rounded-md bg-secondary p-4">
              <p className="text-lg font-semibold">Detalles de la ubicación:</p>
              {isOrderLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <p>Nombre: {selectedLocation?.name || ''}</p>
                  <p className="mt-2 text-xl font-bold">
                    Precio: ${selectedLocation?.price.toFixed(2) || ''}
                  </p>
                </>
              )}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="shippingDetails.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="shippingDetails.streetLine1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección Exacta</FormLabel>
            <FormControl>
              <Input placeholder="Avenida, Calle, Casa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shippingDetails.streetLine2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Punto de referencia</FormLabel>
            <FormControl>
              <Input placeholder="Ej. Frente al farmatodo..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
