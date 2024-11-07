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
  const facetsByProducts = activeOrder?.lines
    .map((l) => l.productVariant.product.facetValues)
    .flat()
  const separateShipping = watch('shippingDetails.separateShipping')
  const shippingType = watch('shippingDetails.shippingType')
  const selectedLocation = watch('shippingDetails.locationObject')

  const hasSeparateShipping =
    facetsByProducts?.some((facet) => facet.code === 'por-encargo') &&
    facetsByProducts?.some((facet) => facet.code === 'disponibilidad-inmediata')
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
      {/* {hasSeparateShipping ? (
        <>
          <Alert variant={'primary'}>
            <Info className="h-5 w-5" />
            <AlertTitle>
              Parece que tienes productos de entrega inmediata y por encargo
            </AlertTitle>
            <AlertDescription>
              Debes seleccionar el tipo de envío
            </AlertDescription>
          </Alert>
          <FormField
            control={control}
            name="shippingDetails.separateShipping"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Habilitar envíos por separado</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </>
      ) : null}

      {separateShipping && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="text-lg font-medium">Productos por encargo</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.shippingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Envío</FormLabel>
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
                          <SelectItem value="national">
                            Envío nacional (Cobro a destino)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.name"
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
                  name="shippingDetails.preOrderShipping.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número telefónico de quien recibe el pedido
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+58 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="state1">Estado 1</SelectItem>
                          <SelectItem value="state2">Estado 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.shippingCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa de envío</FormLabel>
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
                          <SelectItem value="company1">Empresa 1</SelectItem>
                          <SelectItem value="company2">Empresa 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Dirección o código de la agencia donde recibe el pedido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Código, calle, dirección"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.preOrderShipping.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Correo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h3 className="text-lg font-medium">
                Productos de entrega inmediata
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="shippingDetails.immediateShipping.shippingType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Envío</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="delivery" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Delivery (Maracay) - Cobro a Destino
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.immediateShipping.zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar zona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="las-delicias">
                            Las delicias - 3$
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.immediateShipping.name"
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
                  name="shippingDetails.immediateShipping.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número telefónico de quien recibe el pedido
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+58 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="shippingDetails.immediateShipping.address"
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
                  name="shippingDetails.immediateShipping.reference"
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
      )} */}

      {/* {!separateShipping && (
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
                            Delivery (Maracay) - Cobro a Destino
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
                            {locations.map((location) => (
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
                            <p>Nombre: {selectedLocation.name}</p>
                            <p className="mt-2 text-xl font-bold">
                              Precio: ${selectedLocation.price.toFixed(2)}
                            </p>
                          </div>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex gap-4">
                  <FormField
                    control={control}
                    name="tipo_cedula"
                    rules={{
                      required: 'Este campo es requerido',
                    }}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Tipo</FormLabel>
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
                    name={`cedula`}
                    disabled={!watch('tipo_cedula')}
                    rules={{
                      required: 'Este campo es requerido',
                      validate: (value) => {
                        const documentType = watch('tipo_cedula')
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
                        <FormLabel>{`Documento de identidad`}</FormLabel>

                        <FormControl>
                          <Input
                            type="text"
                            onInput={(e) => {
                              const documentType = watch('tipo_cedula')
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
                  name={`shippingDetails.phone`}
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Número telefónico de quien recibe el pedido`}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={'ve'}
                          {...field}
                          masks={{
                            ve: '....-...-....',
                          }}
                          onChange={(value: string, data: any) => {
                            const phoneNumber = value.split(data.dialCode)[1]
                            const formattedPhoneNumber = `+${
                              data.dialCode
                            }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                              4,
                              7
                            )}-${phoneNumber.slice(7)}`
                            field.onChange(formattedPhoneNumber)
                          }}
                          countryCodeEditable={false}
                          disableCountryGuess
                          disableDropdown
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  {shippingType === 'national' && (
                    <FormField
                      control={control}
                      name="shippingDetails.state"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
                          <FormLabel>Estado</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={
                              shippingType === 'delivery'
                                ? 'aragua'
                                : field.value
                            }
                            disabled={shippingType === 'delivery'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione el estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="amazonas">Amazonas</SelectItem>
                              <SelectItem value="anzoategui">
                                Anzoátegui
                              </SelectItem>
                              <SelectItem value="apure">Apure</SelectItem>
                              <SelectItem value="aragua">Aragua</SelectItem>
                              <SelectItem value="barinas">Barinas</SelectItem>
                              <SelectItem value="bolivar">Bolívar</SelectItem>
                              <SelectItem value="carabobo">Carabobo</SelectItem>
                              <SelectItem value="cojedes">Cojedes</SelectItem>
                              <SelectItem value="delta-amacuro">
                                Delta Amacuro
                              </SelectItem>
                              <SelectItem value="distrito-capital">
                                Distrito Capital
                              </SelectItem>
                              <SelectItem value="falcon">Falcón</SelectItem>
                              <SelectItem value="guarico">Guárico</SelectItem>
                              <SelectItem value="lara">Lara</SelectItem>
                              <SelectItem value="merida">Mérida</SelectItem>
                              <SelectItem value="miranda">Miranda</SelectItem>
                              <SelectItem value="monagas">Monagas</SelectItem>
                              <SelectItem value="nueva-esparta">
                                Nueva Esparta
                              </SelectItem>
                              <SelectItem value="portuguesa">
                                Portuguesa
                              </SelectItem>
                              <SelectItem value="sucre">Sucre</SelectItem>
                              <SelectItem value="tachira">Táchira</SelectItem>
                              <SelectItem value="trujillo">Trujillo</SelectItem>
                              <SelectItem value="vargas">Vargas</SelectItem>
                              <SelectItem value="yaracuy">Yaracuy</SelectItem>
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
                      <FormItem className="w-[50%]">
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
                  <div className="flex gap-4">
                    <FormField
                      control={control}
                      name="shippingDetails.shippingCompany"
                      render={({ field }) => (
                        <FormItem className="w-[50%]">
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
                        <FormItem className="w-[50%]">
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
      )} */}

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

              <div className="flex gap-4">
                <FormField
                  control={control}
                  name="shippingDetails.dniType"
                  rules={{
                    required: 'Este campo es requerido',
                  }}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Tipo</FormLabel>
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
                      <FormLabel>{`Documento de identidad`}</FormLabel>

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
                rules={{
                  required: 'Este campo es requerido',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Número telefónico de quien recibe el pedido`}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        country={'ve'}
                        {...field}
                        masks={{
                          ve: '....-...-....',
                        }}
                        onChange={(value: string, data: any) => {
                          const phoneNumber = value.split(data.dialCode)[1]
                          const formattedPhoneNumber = `+${
                            data.dialCode
                          }-${phoneNumber.slice(0, 4)}-${phoneNumber.slice(
                            4,
                            7
                          )}-${phoneNumber.slice(7)}`
                          field.onChange(formattedPhoneNumber)
                        }}
                        countryCodeEditable={false}
                        disableCountryGuess
                        disableDropdown
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                {shippingType === 'national' && (
                  <FormField
                    control={control}
                    name="shippingDetails.state"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
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
                            <SelectItem value="amazonas">Amazonas</SelectItem>
                            <SelectItem value="anzoategui">
                              Anzoátegui
                            </SelectItem>
                            <SelectItem value="apure">Apure</SelectItem>
                            <SelectItem value="aragua">Aragua</SelectItem>
                            <SelectItem value="barinas">Barinas</SelectItem>
                            <SelectItem value="bolivar">Bolívar</SelectItem>
                            <SelectItem value="carabobo">Carabobo</SelectItem>
                            <SelectItem value="cojedes">Cojedes</SelectItem>
                            <SelectItem value="delta-amacuro">
                              Delta Amacuro
                            </SelectItem>
                            <SelectItem value="distrito-capital">
                              Distrito Capital
                            </SelectItem>
                            <SelectItem value="falcon">Falcón</SelectItem>
                            <SelectItem value="guarico">Guárico</SelectItem>
                            <SelectItem value="lara">Lara</SelectItem>
                            <SelectItem value="merida">Mérida</SelectItem>
                            <SelectItem value="miranda">Miranda</SelectItem>
                            <SelectItem value="monagas">Monagas</SelectItem>
                            <SelectItem value="nueva-esparta">
                              Nueva Esparta
                            </SelectItem>
                            <SelectItem value="portuguesa">
                              Portuguesa
                            </SelectItem>
                            <SelectItem value="sucre">Sucre</SelectItem>
                            <SelectItem value="tachira">Táchira</SelectItem>
                            <SelectItem value="trujillo">Trujillo</SelectItem>
                            <SelectItem value="vargas">Vargas</SelectItem>
                            <SelectItem value="yaracuy">Yaracuy</SelectItem>
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
                    <FormItem className="w-[50%]">
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
                <div className="flex gap-4">
                  <FormField
                    control={control}
                    name="shippingDetails.shippingCompany"
                    render={({ field }) => (
                      <FormItem className="w-[50%]">
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
                      <FormItem className="w-[50%]">
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
