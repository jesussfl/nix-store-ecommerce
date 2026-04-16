import { z } from 'zod'

const requiredText = (message: string) =>
  z.string({ required_error: message }).trim().min(1, message)

const paymentAmount = requiredText('El total pagado es requerido').refine(
  (value) => {
    const amount = Number(value)
    return Number.isFinite(amount) && amount > 0
  },
  'Ingresa un monto mayor a 0'
)

const paymentDate = requiredText('La fecha es requerida')

const phoneNumber = requiredText('El número de contacto es requerido').refine(
  (value) => value.replace(/\D/g, '').length >= 10,
  'Ingresa un número de contacto válido'
)

const pagoMovilSchema = z.object({
  paymentMethod: z.literal('pago-movil'),
  reference: requiredText('La referencia es requerida'),
  totalPaid: paymentAmount,
  date: paymentDate,
  phone: phoneNumber,
})

const zinliSchema = z.object({
  paymentMethod: z.literal('zinli'),
  totalPaid: paymentAmount,
  date: paymentDate,
  reference: requiredText('El correo es requerido').email(
    'Ingresa un correo válido'
  ),
  phone: phoneNumber,
})

const binanceSchema = z.object({
  paymentMethod: z.literal('binance'),
  totalPaid: paymentAmount,
  date: paymentDate,
  reference: requiredText('El correo es requerido').email(
    'Ingresa un correo válido'
  ),

  phone: phoneNumber,
})

const paypalSchema = z.object({
  paymentMethod: z.literal('paypal'),
  totalPaid: paymentAmount,
  date: paymentDate,
  reference: requiredText('El correo es requerido').email(
    'Ingresa un correo válido'
  ),

  phone: phoneNumber,
})

const transferenciaSchema = z.object({
  paymentMethod: z.literal('transferencia'),
  reference: requiredText('La referencia es requerida'),
  totalPaid: paymentAmount,
  date: paymentDate,

  phone: phoneNumber,
})

export const paymentDetailsSchema = z.discriminatedUnion('paymentMethod', [
  pagoMovilSchema,
  zinliSchema,
  binanceSchema,
  paypalSchema,
  transferenciaSchema,
])
