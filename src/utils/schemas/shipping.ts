import { z } from 'zod'

const requiredText = (message: string) =>
  z.string({ required_error: message }).trim().min(1, message)

const sharedFields = z.object({
  fullName: requiredText('El nombre es requerido').min(
    3,
    'El nombre debe tener al menos 3 caracteres'
  ),
  streetLine1: requiredText('La dirección es requerida').min(
    5,
    'La dirección debe tener al menos 5 caracteres'
  ),
  streetLine2: requiredText('El punto de referencia es requerido').min(
    5,
    'El punto de referencia debe tener al menos 5 caracteres'
  ),
  city: requiredText('La ciudad es requerida'),
  state: requiredText('El estado es requerido'),
  dni: requiredText('La cédula es requerida'),

  dniType: requiredText('El tipo de documento es requerido'),
  phoneNumber: requiredText('El número de contacto es requerido').refine(
    (value) => value.replace(/\D/g, '').length >= 10,
    'Ingresa un número de contacto válido'
  ),
})

const personalDeliveriesSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('personal'),
    location: requiredText(
      'La ubicación es requerida para entregas personales'
    ),
  })
)
const nationalShippingSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('national'),
    officeCode: requiredText(
      'El código de oficina es requerido para envíos nacionales'
    ),

    shippingCompany: requiredText(
      'La compañía de envío es requerida para envíos nacionales'
    ),
  })
)

const deliveryShippingSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('delivery'),
    location: requiredText(
      'La ubicación es requerida para entregas a domicilio'
    ),
  })
)

export const shippingDetailsSchema = z
  .discriminatedUnion('shippingType', [
    nationalShippingSchema,
    deliveryShippingSchema,
    personalDeliveriesSchema,
  ])
  .superRefine((data, ctx) => {
    const { dni, dniType } = data

    if (dniType === 'V' && !/^\d{7,8}$/.test(dni)) {
      ctx.addIssue({
        code: 'custom',
        path: ['dni'],
        message: 'Debe ser un número de 7 a 8 dígitos para el tipo V',
      })
    } else if (
      (dniType === 'E' || dniType === 'J') &&
      !/^\d{7,10}$/.test(dni)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['dni'],
        message: 'Debe ser un número de 7 a 10 dígitos para los tipos E o J',
      })
    }
  })
