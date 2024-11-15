import { z } from 'zod'

const sharedFields = z.object({
  fullName: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  streetLine1: z
    .string({ required_error: 'La dirección es requerida' })
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  streetLine2: z
    .string({ required_error: 'El punto de referencia es requerido' })
    .min(5),
  city: z.string({
    required_error: 'La ciudad es requerida',
  }),
  state: z.string({
    required_error: 'El estado es requerido',
  }),
  dni: z.string({ required_error: 'La cédula es requerida' }),

  dniType: z.string({
    required_error: 'El tipo de documento es requerido',
  }),
  phoneNumber: z.string({
    required_error: 'El número de contacto es requerido',
  }),
})

const personalDeliveriesSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('personal'),
    location: z.string({
      required_error: 'La ubicación es requerida para entregas personales',
    }),
  })
)
const nationalShippingSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('national'),
    officeCode: z.string({
      required_error:
        'El código de oficina es requerido para envíos nacionales',
    }),

    shippingCompany: z.string({
      required_error:
        'La compañía de envío es requerida para envíos nacionales',
    }),
  })
)

const deliveryShippingSchema = sharedFields.merge(
  z.object({
    shippingType: z.literal('delivery'),
    location: z.string({
      required_error: 'La ubicación es requerida para entregas a domicilio',
    }),
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
