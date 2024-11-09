import { z } from 'zod'

export const shippingDetailsSchema = z.object({
  shippingType: z.enum(['national', 'delivery'], {
    required_error: 'El tipo de envío es requerido',
  }),
  fullName: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .min(3, 'El nombre es requerido'),
  streetLine1: z
    .string({
      required_error: 'La dirección es requerida',
    })
    .min(5, 'Esta dirección es requerida'),
  streetLine2: z
    .string({
      required_error: 'La dirección es requerida',
    })
    .min(5, 'Esta dirección es requerida'),
  city: z
    .string({
      required_error: 'La ciudad es requerida',
    })
    .min(1, 'La ciudad es necesaria'),
  state: z
    .string({
      required_error: 'El estado es requerido',
    })
    .min(1, 'El estado es requerido'),
  dni: z
    .string({
      required_error: 'La cédula es requerida',
    })
    .min(1, 'La cédula es requerida'),
  dniType: z
    .string({
      required_error: 'El tipo de cédula es requerido',
    })
    .min(1, 'El tipo de cédula es requerido'),
  phoneNumber: z
    .string({
      required_error: 'El número de contacto es requerido',
    })
    .min(7, 'El número de contacto es requerido'),
  separateShipping: z.boolean().optional(),
  officeCode: z.string().optional(),
  shippingCompany: z.string().optional(),
  location: z.string().optional(),
})
