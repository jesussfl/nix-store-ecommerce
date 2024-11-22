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
import { AlertTriangle, Loader2 } from 'lucide-react'
import { LOCATIONS, PERSONAL_DELIVERIES_LOCATIONS } from './locations'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/shared/alert'

export default function ShippingFields() {
  const { control, watch, setValue, unregister } = useFormContext()
  const shippingType = watch('shippingDetails.shippingType')
  const { setShippingMethod } = useCart()
  const handleDeliveryOptionChange = async (
    option: 'national' | 'delivery' | 'personal'
  ) => {
    if (option === 'delivery') {
      const shippingMethodResult = await setShippingMethod('3')

      setValue('shippingDetails.state', 'aragua')
    } else if (option === 'personal') {
      const shippingMethodResult = await setShippingMethod('4')

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
    } else {
      const shippingMethodResult = await setShippingMethod('4')
      unregister([
        'shippingDetails.location',
        'shippingDetails.state',
        'shippingDetails.shippingCompany',
        'shippingDetails.officeCode',
        'shippingDetails.locationObject',
      ])
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
            <h3 className="text-lg font-medium">Llena tus datos de envío</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              <FormField
                control={control}
                name="shippingDetails.shippingType"
                rules={{ required: 'Este campo es obligatorio' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Envío</FormLabel>
                    <Select
                      onValueChange={(
                        value: 'national' | 'delivery' | 'personal'
                      ) => handleDeliveryOptionChange(value)}
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
                        <SelectItem value="personal">
                          Entregas en persona
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      console.log(value, 'value')
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
              {shippingType === 'delivery' && <DeliveryFields />}
              {shippingType === 'national' && <NationalShippingFields />}
              {shippingType === 'personal' && <PersonalDeliveries />}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function DeliveryFields() {
  const { control, watch, setValue } = useFormContext()
  const { setShippingMethod, setShippingOrderAddress } = useCart()
  const selectedLocation = watch('shippingDetails.locationObject')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const handleLocationChange = async (value: string) => {
    const location = LOCATIONS.find((loc) => loc.name === value)
    setIsLoadingLocation(true)
    if (location) {
      const shippingAddressResult = await setShippingOrderAddress({
        city: location.name,
        countryCode: 'VE',
        province: 'aragua',
        streetLine1: location.name,
      })

      if (shippingAddressResult) {
        setValue('shippingDetails.location', `${location.name}`)
        setValue('shippingDetails.locationObject', location)
      }

      setIsLoadingLocation(false)
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
              {isLoadingLocation ? (
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

function NationalShippingFields() {
  const { control } = useFormContext()
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="shippingDetails.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="amazonas">Amazonas</SelectItem>
                  <SelectItem value="anzoategui">Anzoátegui</SelectItem>
                  <SelectItem value="zulia">Zulia</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="shippingDetails.shippingCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa de envíos</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input placeholder="Ej. Frente al farmatodo..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

function PersonalDeliveries() {
  const { control, setValue } = useFormContext()
  const { setShippingMethod, setShippingOrderAddress } = useCart()
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
                    Punto de referencia:
                    {selectedLocation?.exact_address || ''}
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
