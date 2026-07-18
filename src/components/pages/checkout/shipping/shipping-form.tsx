'use client'

import { useFormContext } from 'react-hook-form'

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
import DeliveryFields from './delivery-fields'
import NationalShippingFields from './national-shipping-fields'
import PersonalDeliveries from './personal-deliveries'
import CommonFields from './common-fields'

export default function ShippingFields() {
  const { control, watch, setValue, unregister } = useFormContext()
  const shippingType = watch('shippingDetails.shippingType')

  const handleDeliveryOptionChange = async (
    option: 'national' | 'delivery' | 'personal'
  ) => {
    if (option === 'delivery') {
      setValue('shippingDetails.state', 'Aragua')
    } else {
      unregister([
        'shippingDetails.location',
        'shippingDetails.state',
        'shippingDetails.shippingCompany',
        'shippingDetails.officeCode',
        'shippingDetails.locationObject',
        'shippingDetails.streetLine1',
        'shippingDetails.streetLine2',
        'shippingDetails.city',
      ])
    }

    setValue('shippingDetails.shippingType', option)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-2">
        <FormField
          control={control}
          name="shippingDetails.shippingType"
          rules={{ required: 'Este campo es obligatorio' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalidad de entrega o envío</FormLabel>
              <Select
                onValueChange={(value: 'national' | 'delivery' | 'personal') =>
                  handleDeliveryOptionChange(value)
                }
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="national">
                    Envío Nacional: MRW, Zoom, Tealca, Liberty Express (cobro a
                    destino).
                  </SelectItem>
                  <SelectItem value="delivery">
                    Delivery: Maracay, Turmero, Palo Negro, El Limón, entre
                    otros (costo dependiendo de la distancia)
                  </SelectItem>
                  <SelectItem value="personal">
                    Entrega personal o pickup: Maracay (gratis en zonas y
                    horarios establecidos).
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <CommonFields />
        {shippingType === 'delivery' && <DeliveryFields />}
        {shippingType === 'national' && <NationalShippingFields />}
        {shippingType === 'personal' && <PersonalDeliveries />}
      </div>
    </div>
  )
}
