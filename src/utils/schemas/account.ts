import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  rememberMe: z.boolean().optional(),
})

export const signupSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  firstName: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastName: z
    .string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
})

export type LoginInputs = z.infer<typeof loginSchema>
export type SignupInputs = z.infer<typeof signupSchema>
export type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>
