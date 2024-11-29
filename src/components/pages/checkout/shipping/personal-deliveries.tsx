'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useCart } from '@/components/cart/cart-context'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/shared/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { PERSONAL_DELIVERIES_LOCATIONS } from './locations'

export default function PersonalDeliveries() {
  const { control, setValue } = useFormContext()
  const { setShippingOrderAddress } = useCart()
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'C.C Galería Plaza',
    exact_address: 'Feria de Comida, en las mesas al frente de Pollos Arturo',
    schedule: '3:30pm - 4:00pm',
  })
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleLocationChange = async (value: string) => {
    const location = PERSONAL_DELIVERIES_LOCATIONS.find(
      (loc) => loc.name === value
    )

    setIsLoadingLocation(true)
    if (location) {
      setSelectedLocation(location)
      const shippingAddressResult = await setShippingOrderAddress({
        city: 'Maracay',
        countryCode: 'VE',
        province: 'Aragua',
        streetLine1: location.name,
      })

      if (shippingAddressResult) {
        setValue('shippingDetails.location', `Maracay`)
        setValue('shippingDetails.state', 'Aragua')
        setValue('shippingDetails.city', 'Maracay')
        setValue('shippingDetails.streetLine1', location.name)
        setValue('shippingDetails.streetLine2', location.exact_address)
        setValue('shippingDetails.locationObject', location)
      }
    }
    setIsLoadingLocation(false)
  }

  return (
    <div className="space-y-4">
      <Alert variant="primary">
        <AlertTriangle className="mr-2 h-4 w-4" />
        <AlertTitle>Advertencia</AlertTitle>
        <AlertDescription>
          Deberá avisar con un día de antelación para garantizar la
          disponibilidad de la entrega personal o retiro
        </AlertDescription>
      </Alert>
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
                {PERSONAL_DELIVERIES_LOCATIONS.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 rounded-md bg-secondary p-4">
              <p className="text-lg font-semibold">Detalles de la entrega</p>
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <p>Nombre: {selectedLocation?.name || ''}</p>
                  <p>
                    Punto de referencia: {selectedLocation?.exact_address || ''}
                  </p>
                  <p>Horario: {selectedLocation?.schedule || ''}</p>
                </>
              )}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
