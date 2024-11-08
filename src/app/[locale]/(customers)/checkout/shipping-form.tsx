'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/shared/input/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select/select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shared/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/accordion'
import { useCart } from '@/components/cart/cart-context'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Loader2 } from 'lucide-react'
import { LOCATIONS } from './locations'

export default function ShippingForm() {
  const { control, watch, setValue, unregister } = useFormContext()
  const { activeOrder, setShippingMethod, setShippingOrderAddress, isLoading } =
    useCart()
  const shippingType = watch('shippingDetails.shippingType')
  const selectedLocation = watch('shippingDetails.locationObject')

  const handleLocationChange = async (value: string) => {
    const location = LOCATIONS.find((loc) => loc.name === value)
    if (location) {
      const shippingAddressResult = await setShippingOrderAddress({
        city: location.name,
        countryCode: 'VE',
        province: 'aragua',
        streetLine1: location.name,
      })
      const shippingMethodResult = await setShippingMethod('3')

      if (shippingAddressResult && shippingMethodResult) {
        setValue('shippingDetails.location', `${location.name}`)
        setValue('shippingDetails.locationObject', location)
      }
    }
  }

  const handleDeliveryOptionChange = (option: 'national' | 'delivery') => {
    if (option === 'delivery') {
      setValue('shippingDetails.state', 'aragua')
    } else {
      unregister('shippingDetails.location')
      unregister('shippingDetails.state')
      unregister('shippingDetails.shippingCompany')
      unregister('shippingDetails.officeCode')
      unregister('shippingDetails.locationObject')
    }

    setValue('shippingDetails.shippingType', option)
  }

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="shipping"
      >
        <AccordionItem value="shipping">
          <AccordionTrigger>
            <h3 className="text-lg font-medium">Envío</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <FormField
                control={control}
                name="shippingDetails.shippingType"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Envío</FormLabel>
                    <Select
                      onValueChange={(value: 'national' | 'delivery') =>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {shippingType === 'delivery' && (
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
                            <SelectItem
                              key={location.name}
                              value={location.name}
                            >
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedLocation && (
                        <div className="mt-4 rounded-md bg-secondary p-4">
                          <p className="text-lg font-semibold">
                            Detalles de la ubicación:
                          </p>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <p>Nombre: {selectedLocation.name}</p>
                              <p className="mt-2 text-xl font-bold">
                                Precio: ${selectedLocation.price.toFixed(2)}
                              </p>
                            </>
                          )}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={control}
                  name="shippingDetails.dniType"
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                            const documentType = watch(
                              'shippingDetails.dniType'
                            )
                            if (documentType !== 'P') {
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/[^0-9]/g, '')
                              return
                            }
                            e.currentTarget.value =
                              e.currentTarget.value.replace(
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
                    <FormLabel>
                      Nombre y apellido de quien recibe el pedido
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Jesús López" {...field} />
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
                    <FormLabel>
                      Número telefónico de quien recibe el pedido
                    </FormLabel>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {shippingType === 'national' && (
                  <FormField
                    control={control}
                    name="shippingDetails.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            shippingType === 'delivery' ? 'aragua' : field.value
                          }
                          disabled={shippingType === 'delivery'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Add all states here */}
                            <SelectItem value="amazonas">Amazonas</SelectItem>
                            <SelectItem value="anzoategui">
                              Anzoátegui
                            </SelectItem>
                            {/* ... other states ... */}
                            <SelectItem value="zulia">Zulia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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

              {shippingType === 'national' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={control}
                    name="shippingDetails.shippingCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa de envíos</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione la empresa de envíos" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DHL">DHL</SelectItem>
                            <SelectItem value="Zoom">Zoom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="shippingDetails.officeCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código/Dirección de la oficina</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej. Frente al farmatodo..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={control}
                name="shippingDetails.streetLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Punto de referencia</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Frente al farmatodo..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
