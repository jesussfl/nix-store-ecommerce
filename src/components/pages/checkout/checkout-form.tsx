'use client'

import * as z from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/shared/form'
import { useCart } from '@/components/cart/cart-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/button'
import { vendureFetch } from '@/libs/vendure'
import {
  SET_ORDER_SHIPPING_ADDRESS_MUTATION,
  SET_SHIPPING_METHOD_MUTATION,
} from '@/libs/mutations/order'
import { shippingDetailsSchema } from '@/utils/schemas/shipping'
import ShippingFields from './shipping-form'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'

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
})

type FormSchema = z.infer<typeof formSchema>

export default function ShippingForm() {
  const { isLogged, isLoading, activeOrder } = useCart()
  const router = useRouter()
  const isOrderEmpty = activeOrder?.lines.length === 0
  useEffect(() => {
    if (!isLogged && !isLoading) {
      router.push('/')
    }

    if (isOrderEmpty) {
      router.push('/')
    }
  }, [isLogged, isLoading, router, isOrderEmpty])

  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingDetails: {
        separateShipping: false,
        shippingType: 'national',
      },
    },
  })

  const onSubmit = async (values: FormSchema) => {
    console.log('values', values)
    const { data: addressData, error: addressError } = await vendureFetch({
      query: SET_ORDER_SHIPPING_ADDRESS_MUTATION,
      variables: {
        input: {
          fullName: values.shippingDetails.fullName,
          streetLine1: values.shippingDetails.streetLine1,
          streetLine2: values.shippingDetails.streetLine2,
          city: values.shippingDetails.location || values.shippingDetails.city,
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
    const { data, error } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'ArrangingPayment',
      },
    })

    if (data?.transitionOrderToState) {
      router.push('/checkout/payment')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ShippingFields />
        <Button
          type="submit"
          className="ml-auto"
          disabled={form.formState.isSubmitting}
        >
          Continuar al Pago
        </Button>
      </form>
    </Form>
  )
}
