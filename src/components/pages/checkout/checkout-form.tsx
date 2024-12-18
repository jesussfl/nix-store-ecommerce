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
import { SET_ORDER_SHIPPING_ADDRESS_MUTATION } from '@/libs/mutations/order'
import { shippingDetailsSchema } from '@/utils/schemas/shipping'
import ShippingFields from './shipping/shipping-form'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'
import { MobileBottomBar } from '@/app/[locale]/(customers)/checkout/mobile-bottom-bar'
import { useToast } from '@/components/shared/toast/use-toast'

const formSchema = z.object({
  shippingDetails: shippingDetailsSchema,
})

type FormSchema = z.infer<typeof formSchema>

export default function ShippingForm() {
  const { isLogged, isLoading, activeOrder, isOrderLoading } = useCart()
  const router = useRouter()

  const { toast } = useToast()
  const isOrderEmpty = activeOrder?.lines.length === 0
  const isOrderArranging = activeOrder?.state === 'ArrangingPayment'
  useEffect(() => {
    if (!isLogged && !isLoading) {
      window.location.href = '/account/login?callback=/checkout'
    }

    if (isOrderArranging) {
      window.location.href = '/checkout/payment'
    }
  }, [isLogged, isLoading, isOrderArranging])
  useEffect(() => {
    if (isOrderEmpty) {
      router.push('/')
    }
  }, [router, isOrderEmpty])

  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingDetails: {},
    },
  })

  const onSubmit = async (values: FormSchema) => {
    const { data: addressData, error: addressError } = await vendureFetch({
      query: SET_ORDER_SHIPPING_ADDRESS_MUTATION,
      variables: {
        input: {
          fullName: values.shippingDetails.fullName,
          streetLine1: values.shippingDetails.streetLine1,
          streetLine2: values.shippingDetails.streetLine2,
          city:
            values.shippingDetails.shippingType === 'delivery' ||
            values.shippingDetails.shippingType === 'personal'
              ? values.shippingDetails.location
              : values.shippingDetails.city,
          province: values.shippingDetails.state,
          phoneNumber: values.shippingDetails.phoneNumber,
          countryCode: 'VE',
          customFields: {
            officeCode:
              values.shippingDetails.shippingType === 'national'
                ? values.shippingDetails.officeCode
                : undefined,
            shippingCompany:
              values.shippingDetails.shippingType === 'national'
                ? values.shippingDetails.shippingCompany
                : undefined,
          },
        },
      },
    })

    if (addressError || !addressData?.setOrderShippingAddress) {
      console.error('Error setting shipping address:', addressError)
      toast({
        title: 'Error',
        description:
          addressError +
          ' Parece que hubo un error en la dirección de envío. Inténtalo de nuevo.',
        variant: 'destructive',
      })
      return
    }

    const { data, error } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'ArrangingPayment',
      },
    })
    if (data?.transitionOrderToState && !error) {
      router.push('/checkout/payment')
    }

    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ShippingFields />
        <Button
          type="submit"
          className="ml-auto"
          disabled={form.formState.isSubmitting || isOrderLoading}
        >
          Continuar al Pago
        </Button>
        <MobileBottomBar bcvPrice={3}>
          <Button
            type="submit"
            className="ml-auto"
            disabled={form.formState.isSubmitting || isOrderLoading}
          >
            Continuar al Pago
          </Button>
        </MobileBottomBar>
      </form>
    </Form>
  )
}
