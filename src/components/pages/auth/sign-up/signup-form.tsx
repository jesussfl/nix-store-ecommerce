'use client'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { RegisterCustomerInputType } from '@/graphql/selectors'
import { storefrontApiMutation } from '@/graphql/client'

import { z } from 'zod'
import { useTranslations } from 'next-intl'

type FormValues = RegisterCustomerInputType & { confirmPassword: string }

export const SignUpForm = () => {
  const t = useTranslations('customer')
  const tErrors = useTranslations('common')
  const [success, setSuccess] = useState<boolean>(false)
  //   const push = usePush()
  const schema = z
    .object({
      emailAddress: z
        .string()
        .email(tErrors('errors.email.invalid'))
        .min(1, tErrors('errors.email.required')),
      password: z
        .string()
        .min(8, tErrors('errors.password.minLength'))
        .max(25, tErrors('errors.password.maxLength')),
      confirmPassword: z
        .string()
        .min(8, tErrors('errors.password.minLength'))
        .max(25, tErrors('errors.password.maxLength')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tErrors('errors.confirmPassword.mustMatch'),
      path: ['confirmPassword'],
    })

  //   const {
  //     formState: { errors, isSubmitting },
  //     register,
  //     handleSubmit,
  //     setError,
  //   } = useForm<FormValues>({
  //     resolver: zodResolver(schema),
  //   })

  //   const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //     const { emailAddress, password } = data

  //     try {
  //       const { registerCustomerAccount } = await storefrontApiMutation(ctx)({
  //         registerCustomerAccount: [
  //           { input: { emailAddress, password } },
  //           {
  //             __typename: true,
  //             '...on Success': { success: true },
  //             '...on MissingPasswordError': {
  //               message: true,
  //               errorCode: true,
  //             },
  //             '...on NativeAuthStrategyError': {
  //               message: true,
  //               errorCode: true,
  //             },
  //             '...on PasswordValidationError': {
  //               errorCode: true,
  //               message: true,
  //               validationErrorMessage: true,
  //             },
  //           },
  //         ],
  //       })

  //       if (registerCustomerAccount.__typename === 'Success') {
  //         setSuccess(true)
  //         await new Promise((resolve) => setTimeout(resolve, 3000))
  //         // push('/customer/sign-in')
  //         return
  //       }

  //       setError('root', {
  //         message: tErrors(`errors.backend.${registerCustomerAccount.errorCode}`),
  //       })
  //     } catch {
  //       setError('root', { message: tErrors('errors.backend.UNKNOWN_ERROR') })
  //     }
  //   }

  return (
    <>
      <p>Signup Form</p>
    </>
  )
}
