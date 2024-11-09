'use client'

import { useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/shared/form'
import { Card, CardContent } from '@/components/shared/card/card'
import { Input } from '@/components/shared/input/input'
import { Banknote, Wallet, LucideIcon } from 'lucide-react'
import { useEffect } from 'react'
import { vendureFetch } from '@/libs/vendure'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'
import { ADD_PAYMENT_TO_ORDER } from '@/libs/queries/payment'

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
    icon: Wallet,
  },
  'pago-movil': {
    name: 'Pago Móvil',
    info: ['📱 04123761604', '🪪 V - 28456627', '🏦 0172 | Bancamiga'],
    icon: Wallet,
  },
  transferencia: {
    name: 'Transferencia Bancamiga',
    info: [
      '👤 Sara Beatriz Quiñones Vargas',
      '🪙 01720226062265251120',
      '🪪 V - 2845662',
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
    <div className="space-y-6">
      <FormField
        control={control}
        name="paymentDetails.paymentMethod"
        rules={{ required: 'Debe seleccionar un método de pago' }}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Método de pago</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Object.entries(PAYMENT_METHODS).map(([key, method]) => {
                  const Icon = method.icon
                  return (
                    <FormItem key={key}>
                      <FormControl>
                        <RadioGroupItem
                          value={key}
                          id={key}
                          className="peer sr-only"
                        />
                      </FormControl>
                      <Label
                        htmlFor={key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{method.name}</span>
                      </Label>
                    </FormItem>
                  )
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedMethod && (
        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Información de {PAYMENT_METHODS[selectedMethod].name}
              </h3>
              <div className="space-y-1 text-sm">
                {Array.isArray(PAYMENT_METHODS[selectedMethod].info) ? (
                  PAYMENT_METHODS[selectedMethod].info.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <p>{PAYMENT_METHODS[selectedMethod].info}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={control}
                name="paymentDetails.reference"
                rules={{ required: 'El número de referencia es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Referencia</FormLabel>
                    <FormControl>
                      <Input placeholder="#4343434" {...field} />
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
}

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={`inline-flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
