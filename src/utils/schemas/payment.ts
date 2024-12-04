import { z } from 'zod'

const pagoMovilSchema = z.object({
  paymentMethod: z.literal('pago-movil'),
  reference: z.string({ required_error: 'La referencia es requerida' }),
  totalPaid: z.string({ required_error: 'El total pagado es requerido' }),
  date: z.string({ required_error: 'La fecha es requerida' }),
  phone: z.string({ required_error: 'El número de contacto es requerido' }),
})

const zinliSchema = z.object({
  paymentMethod: z.literal('zinli'),
  totalPaid: z.string({ required_error: 'El total pagado es requerido' }),
  date: z.string({ required_error: 'La fecha es requerida' }),
  reference: z.string({ required_error: 'El correo es requerido' }),
  phone: z.string({ required_error: 'El número de contacto es requerido' }),
})

const binanceSchema = z.object({
  paymentMethod: z.literal('binance'),
  totalPaid: z.string({ required_error: 'El total pagado es requerido' }),
  date: z.string({ required_error: 'La fecha es requerida' }),
  reference: z.string({ required_error: 'El correo es requerido' }),

  phone: z.string({ required_error: 'El número de contacto es requerido' }),
})

const paypalSchema = z.object({
  paymentMethod: z.literal('paypal'),
  totalPaid: z.string({ required_error: 'El total pagado es requerido' }),
  date: z.string({ required_error: 'La fecha es requerida' }),
  reference: z.string({ required_error: 'El correo es requerido' }),

  phone: z.string({ required_error: 'El número de contacto es requerido' }),
})

const transferenciaSchema = z.object({
  paymentMethod: z.literal('transferencia'),
  reference: z.string({ required_error: 'La referencia es requerida' }),
  totalPaid: z.string({ required_error: 'El total pagado es requerido' }),
  date: z.string({ required_error: 'La fecha es requerida' }),

  phone: z.string({ required_error: 'El número de contacto es requerido' }),
})

export const paymentDetailsSchema = z.discriminatedUnion('paymentMethod', [
  pagoMovilSchema,
  zinliSchema,
  binanceSchema,
  paypalSchema,
  transferenciaSchema,
])
