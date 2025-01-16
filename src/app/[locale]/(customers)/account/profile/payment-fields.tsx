// app/components/payment/PaymentFields.tsx

'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shared/form'
import { Input } from '@/components/shared/input/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/select/select'

export function PaymentFields() {
  const { control } = useFormContext()

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="paymentDetails.paymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Método de pago</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un método de pago" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pago-movil">Pago Móvil</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paymentDetails.totalPaid"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monto pagado</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paymentDetails.reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referencia</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paymentDetails.date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de pago</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="paymentDetails.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
