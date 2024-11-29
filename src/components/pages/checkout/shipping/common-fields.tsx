'use client'

import { useFormContext } from 'react-hook-form'
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
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function CommonFields() {
  const { control, watch } = useFormContext()

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="shippingDetails.dniType"
          rules={{ required: 'Este campo es requerido' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="V">V</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                  <SelectItem value="J">J</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`shippingDetails.dni`}
          disabled={!watch('shippingDetails.dniType')}
          rules={{
            required: 'Este campo es requerido',
            validate: (value) => {
              const documentType = watch('shippingDetails.dniType')
              if (documentType === 'V') {
                return (
                  /^\d{7,8}$/.test(value) ||
                  'Debe ser un número de 7 a 8 dígitos'
                )
              }
              if (documentType === 'E' || documentType === 'J') {
                return (
                  /^\d{7,10}$/.test(value) ||
                  'Debe ser un número de 7 a 10 dígitos'
                )
              }
              return true
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento de identidad</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  onInput={(e) => {
                    const documentType = watch('shippingDetails.dniType')
                    if (documentType !== 'P') {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ''
                      )
                      return
                    }
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^a-zA-Z0-9]{5,15}/g,
                      ''
                    )
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="shippingDetails.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre y apellido de quien recibe el pedido</FormLabel>
            <FormControl>
              <Input placeholder="Nombre de la persona" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`shippingDetails.phoneNumber`}
        rules={{ required: 'Este campo es requerido' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número telefónico de quien recibe el pedido</FormLabel>
            <FormControl>
              <PhoneInput
                country={'ve'}
                {...field}
                masks={{ ve: '....-...-....' }}
                onChange={(value: string, data: any) => {
                  const phoneNumber = value.split(data.dialCode)[1]
                  const formattedPhoneNumber = `+${data.dialCode}-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`
                  field.onChange(formattedPhoneNumber)
                }}
                countryCodeEditable={false}
                disableCountryGuess
                disableDropdown
                inputClass="w-full p-2 border rounded"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
