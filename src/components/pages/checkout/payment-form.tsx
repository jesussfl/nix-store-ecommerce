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

const isOrderResult = (
  result: unknown
): result is { code: string; state: string; lines: Array<unknown> } => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'code' in result &&
    'state' in result &&
    'lines' in result &&
    Array.isArray(result.lines)
  )
}

const getResultMessage = (result: unknown, fallback: string) => {
  if (
    typeof result === 'object' &&
    result !== null &&
    'message' in result &&
    typeof result.message === 'string'
  ) {
    return result.message
  }

  return fallback
}

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

    const transitionResult = data?.transitionOrderToState

    if (error || !transitionResult || !isOrderResult(transitionResult)) {
      console.error(error)
      toast({
        title: 'Error',
        description: getResultMessage(
          transitionResult,
          error || 'No pudimos volver al paso de envío.'
        ),
        variant: 'destructive',
      })
      return
    }

    router.push('/checkout')
  }
  const cancelOrder = async () => {
    const { data, error } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'Cancelled',
      },
    })
    const transitionResult = data?.transitionOrderToState

    if (error || !transitionResult || !isOrderResult(transitionResult)) {
      console.error(error)
      toast({
        title: 'Error',
        description: getResultMessage(
          transitionResult,
          error || 'Error al cancelar el pedido'
        ),
        variant: 'destructive',
      })
      return
    }

    window.location.href = '/'
  }
  const onSubmit = async (values: FormSchema) => {
    const bcvDolar = await GetBCVPrice()
    const isAmountInBS =
      values.paymentDetails.paymentMethod === 'pago-movil' ||
      values.paymentDetails.paymentMethod === 'transferencia'
    const amount = isAmountInBS
      ? Math.round(Number(values.paymentDetails.totalPaid) / bcvDolar)
      : Number(values.paymentDetails.totalPaid)

    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: 'Monto inválido',
        description: 'Revisa el total pagado antes de finalizar el pedido.',
        variant: 'destructive',
      })
      return
    }

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
    const paymentResult = data?.addPaymentToOrder

    if (error || !paymentResult || !isOrderResult(paymentResult)) {
      console.error(error)
      toast({
        title: 'Error',
        description: getResultMessage(
          paymentResult,
          error || 'No pudimos registrar el pago. Inténtalo de nuevo.'
        ),
        variant: 'destructive',
      })
      return
    }

    const { data: transitionData, error: transitionError } = await vendureFetch({
      query: TRANSITION_ORDER_STATE,
      variables: {
        state: 'ValidatingPayment',
      },
    })

    const transitionResult = transitionData?.transitionOrderToState

    if (
      transitionError ||
      !transitionResult ||
      !isOrderResult(transitionResult)
    ) {
      console.error(transitionError)
      toast({
        title: 'Pago registrado, pero falta confirmar el pedido',
        description: getResultMessage(
          transitionResult,
          transitionError ||
            'El pedido no pudo avanzar al estado de validación. Inténtalo nuevamente o contacta soporte.'
        ),
        variant: 'destructive',
      })
      return
    }

    router.replace(`/checkout/confirmation/${transitionResult.code}`)
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

          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting || !form.formState.isValid
            }
          >
            Finalizar Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}
