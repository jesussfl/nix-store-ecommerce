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

export default function NationalShippingFields() {
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
                  <SelectItem value="apure">Apure</SelectItem>
                  <SelectItem value="aragua">Aragua</SelectItem>
                  <SelectItem value="barinas">Barinas</SelectItem>
                  <SelectItem value="bolivar">Bolívar</SelectItem>
                  <SelectItem value="carabobo">Carabobo</SelectItem>
                  <SelectItem value="cojedes">Cojedes</SelectItem>
                  <SelectItem value="delta-amacuro">Delta Amacuro</SelectItem>
                  <SelectItem value="distrito-capital">
                    Distrito Capital
                  </SelectItem>
                  <SelectItem value="falcon">Falcón</SelectItem>
                  <SelectItem value="guarico">Guárico</SelectItem>
                  <SelectItem value="lara">Lara</SelectItem>
                  <SelectItem value="merida">Mérida</SelectItem>
                  <SelectItem value="miranda">Miranda</SelectItem>
                  <SelectItem value="monagas">Monagas</SelectItem>
                  <SelectItem value="nueva-esparta">Nueva Esparta</SelectItem>
                  <SelectItem value="portuguesa">Portuguesa</SelectItem>
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
                  <SelectItem value="MRW">MRW</SelectItem>
                  <SelectItem value="ZOOM">ZOOM</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="Liberty Express">
                    Liberty Express
                  </SelectItem>
                  <SelectItem value="Domesa">Domesa</SelectItem>
                  <SelectItem value="Tealca">Tealca</SelectItem>
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
