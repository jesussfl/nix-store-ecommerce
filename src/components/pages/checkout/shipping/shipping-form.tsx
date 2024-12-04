'use client'

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
import DeliveryFields from './delivery-fields'
import NationalShippingFields from './national-shipping-fields'
import PersonalDeliveries from './personal-deliveries'
import CommonFields from './common-fields'

export default function ShippingFields() {
  const { control, watch, setValue, unregister } = useFormContext()
  const shippingType = watch('shippingDetails.shippingType')
  const { setShippingMethod } = useCart()

  const handleDeliveryOptionChange = async (
    option: 'national' | 'delivery' | 'personal'
  ) => {
    const shippingMethods = {
      national: '1',
      delivery: '3',
      personal: '4',
    }

    await setShippingMethod(shippingMethods[option])

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
              <FormLabel>Tipo de Envío</FormLabel>
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
                    Envío nacional (Cobro a destino)
                  </SelectItem>
                  <SelectItem value="delivery">
                    Delivery (Solo zonas de Maracay)
                  </SelectItem>
                  <SelectItem value="personal">Entregas en persona</SelectItem>
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
