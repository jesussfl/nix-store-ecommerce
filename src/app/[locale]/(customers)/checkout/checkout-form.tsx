'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/shared/form'
import ShippingForm from './shipping-form'
import PaymentForm from './payment-form'
import { useCart } from '@/components/cart/cart-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/button'
import { vendureFetch } from '@/libs/vendure'
import {
  SET_ORDER_SHIPPING_ADDRESS_MUTATION,
  SET_SHIPPING_METHOD_MUTATION,
} from '@/libs/mutations/order'

const shippingDetailsSchema = z.object({
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

const formSchema = z.object({
  shippingDetails: shippingDetailsSchema.refine(
    (data) => {
      if (data.shippingType === 'national') {
        return !!data.officeCode && !!data.shippingCompany
      }
      if (data.shippingType === 'delivery') {
        return !!data.location
      }
      return true
    },
    {
      message: 'Campos requeridos faltantes para el tipo de envío seleccionado',
      path: ['shippingType'],
    }
  ),
  paymentDetails: z.object({
    paymentMethod: z.string().optional(),
    paymentProof: z.any().optional(),
  }),
})

type FormSchema = z.infer<typeof formSchema>

export default function CheckoutForm({
  initialStep,
}: {
  initialStep: 'shipping' | 'payment'
}) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const { isLogged, isLoading } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!isLogged && !isLoading) {
      router.push('/')
    }
  }, [isLogged, isLoading, router])

  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingDetails: {
        separateShipping: false,
        shippingType: 'national',
      },
      paymentDetails: {},
    },
  })

  const onSubmit = async (values: FormSchema) => {
    if (currentStep === 'shipping') {
      const { data: addressData, error: addressError } = await vendureFetch({
        query: SET_ORDER_SHIPPING_ADDRESS_MUTATION,
        variables: {
          input: {
            fullName: values.shippingDetails.fullName,
            streetLine1: values.shippingDetails.streetLine1,
            streetLine2: values.shippingDetails.streetLine2,
            city:
              values.shippingDetails.location || values.shippingDetails.city,
            province: values.shippingDetails.state,
            phoneNumber: values.shippingDetails.phoneNumber,
            countryCode: 'VE',
          },
        },
      })

      if (addressError) {
        console.error('Error setting shipping address:', addressError)
        return
      }

      const { data: shippingData, error: shippingError } = await vendureFetch({
        query: SET_SHIPPING_METHOD_MUTATION,
        variables: {
          id: '3',
        },
      })

      if (shippingError) {
        console.error('Error setting shipping method:', shippingError)
        return
      }

      setCurrentStep('payment')
      router.push('/checkout?step=payment')
    } else {
      // Handle payment submission
      console.log('Payment details:', values.paymentDetails)
      // Implement your payment processing logic here
      router.push('/checkout/success')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentStep === 'shipping' ? <ShippingForm /> : <PaymentForm />}
        <div className="flex justify-between">
          {currentStep === 'payment' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep('shipping')}
            >
              Volver a Envío
            </Button>
          )}
          <Button
            type="submit"
            className="ml-auto"
            disabled={form.formState.isSubmitting}
          >
            {currentStep === 'shipping'
              ? 'Continuar a Pago'
              : 'Finalizar Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
