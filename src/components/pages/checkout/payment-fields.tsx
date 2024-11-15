'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shared/form'
import { Card, CardContent } from '@/components/shared/card/card'
import { Input } from '@/components/shared/input/input'
import {
  Banknote,
  Wallet,
  LucideIcon,
  CreditCard,
  Smartphone,
  Calendar,
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared/tabs/tabs'

interface PaymentMethod {
  name: string
  info: string | string[]
  icon: LucideIcon
}

type PaymentMethodKey =
  | 'binance'
  | 'zinli'
  | 'paypal'
  | 'pago-movil'
  | 'transferencia'

const PAYMENT_METHODS: Record<PaymentMethodKey, PaymentMethod> = {
  binance: {
    name: 'Binance',
    info: 'sarabquinonesv@gmail.com',
    icon: Wallet,
  },
  zinli: {
    name: 'Zinli',
    info: 'nixstore.mcy@gmail.com',
    icon: Wallet,
  },
  paypal: {
    name: 'PayPal',
    info: [
      '📧 nixstore.mcy@gmail.com',
      '⚠ Enviar SIN NOTA.',
      '⛔ Enviar SIN DIRECCIÓN.',
      '⁉ Si no sabe cómo quitar la dirección PREGUNTE antes de hacer el pago.',
      '❌ Si no cumple las indicaciones se hará una DEVOLUCIÓN.',
    ],
    icon: CreditCard,
  },
  'pago-movil': {
    name: 'Pago Móvil',
    info: ['📱 04123761604', '🪪 V - 28456627', '🏦 0172 | Bancamiga'],
    icon: Smartphone,
  },
  transferencia: {
    name: 'Transferencia Bancamiga',
    info: [
      '👤 Sara Beatriz Quiñones Vargas',
      '🪙 01720226062265251120',
      '🪪 V - 28456627',
    ],
    icon: Banknote,
  },
}

export default function PaymentFields() {
  const { control, watch } = useFormContext()
  const selectedMethod = watch('paymentDetails.paymentMethod') as
    | PaymentMethodKey
    | undefined

  return (
    <>
      <FormField
        control={control}
        name="paymentDetails.paymentMethod"
        rules={{ required: 'Debe seleccionar un método de pago' }}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <Tabs
                onValueChange={field.onChange}
                value={field.value}
                className="w-full"
              >
                <TabsList className="flex h-auto w-full flex-wrap gap-4">
                  {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                    <TabsTrigger key={key} value={key} className="">
                      <method.icon className="mr-2 h-5 w-5" />
                      {method.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                  <TabsContent key={key} value={key} className="mt-6">
                    <Card>
                      <CardContent className="space-y-4 p-4">
                        <h3 className="text-lg font-semibold">
                          Información de {method.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          {Array.isArray(method.info) ? (
                            method.info.map((line, i) => (
                              <p key={i} className="flex items-center">
                                <span className="mr-2">
                                  {line.split(' ')[0]}
                                </span>
                                {line.split(' ').slice(1).join(' ')}
                              </p>
                            ))
                          ) : (
                            <p>{method.info}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedMethod && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold">Detalles del Pago</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="paymentDetails.reference"
              rules={{ required: 'El número de referencia es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Todos los números de la referencia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="paymentDetails.phone"
              rules={{ required: 'El número de teléfono es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="0412-000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="paymentDetails.totalPaid"
              rules={{ required: 'El total pagado es requerido' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total pagado</FormLabel>
                  <FormControl>
                    <Input placeholder="Monto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="paymentDetails.date"
              rules={{ required: 'La fecha del pago es requerida' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del pago</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </>
  )
}
