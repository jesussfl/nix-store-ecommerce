'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/shared/form'
import PaymentFields from './payment-fields'
import { useCart } from '@/components/cart/cart-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shared/button'

import { vendureFetch } from '@/libs/vendure'
import { ADD_PAYMENT_TO_ORDER } from '@/libs/queries/payment'
import { useToast } from '@/components/shared/toast/use-toast'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'
import { paymentDetailsSchema } from '@/utils/schemas/payment'
import { GetBCVPrice } from '@/utils/get-bcv-price'

const formSchema = z.object({
  paymentDetails: paymentDetailsSchema,
})

type FormSchema = z.infer<typeof formSchema>

export default function PaymentForm() {
  const { isLogged, isLoading, activeOrder } = useCart()
  const router = useRouter()
  const { toast } = useToast()
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
      paymentDetails: {
        paymentMethod: 'pago-movil',
      },
    },
  })
  const backToShipping = async () => {
    const { data, error } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'AddingItems',
      },
    })

    if (!error) {
      router.push('/checkout')
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
  const cancelOrder = async () => {
    const { data, error } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'Cancelled',
      },
    })
    if (!error) {
      window.location.href = '/'
    }
    if (error || !data) {
      console.error(error)
      toast({
        title: 'Error',
        description: error || 'Error al cancelar el pedido',
        variant: 'destructive',
      })
    }
  }
  const onSubmit = async (values: FormSchema) => {
    const bcvDolar = await GetBCVPrice()
    const isAmountInBS =
      values.paymentDetails.paymentMethod === 'pago-movil' ||
      values.paymentDetails.paymentMethod === 'transferencia'
    const amount = isAmountInBS
      ? Math.round(Number(values.paymentDetails.totalPaid) / bcvDolar)
      : Number(values.paymentDetails.totalPaid)

    console.log('amount', amount)
    const { data, error } = await vendureFetch({
      query: ADD_PAYMENT_TO_ORDER,
      variables: {
        input: {
          method: values.paymentDetails.paymentMethod,

          metadata:
            values.paymentDetails.paymentMethod === 'pago-movil' ||
            values.paymentDetails.paymentMethod === 'transferencia'
              ? {
                  referencia: values.paymentDetails.reference,
                  monto: amount,
                  'fecha de pago': values.paymentDetails.date,
                  telefono: values.paymentDetails.phone,
                }
              : {
                  monto: amount,
                  'fecha de pago': values.paymentDetails.date,
                  referencia: values.paymentDetails.reference,
                  telefono: values.paymentDetails.phone,
                },
        },
      },
    })
    console.log(data, error, 'payment')
    if (data?.addPaymentToOrder) {
      const { data, error } = await vendureFetch({
        query: TRANSITION_ORDER_STATE,
        variables: {
          state: 'ValidatingPayment',
        },
      })

      console.log(data, error, 'transition')
      window.location.href = '/checkout/confirmation/' + activeOrder?.code
    }

    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
      return
    }
    console.log('Payment details:', values.paymentDetails)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PaymentFields />
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={'destructive'}
              disabled={form.formState.isSubmitting}
              onClick={cancelOrder}
            >
              Cancelar Pedido
            </Button>
            <Button
              type="button"
              variant={'outline'}
              disabled={form.formState.isSubmitting}
              onClick={backToShipping}
            >
              Corregir datos de envío
            </Button>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Finalizar Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}
