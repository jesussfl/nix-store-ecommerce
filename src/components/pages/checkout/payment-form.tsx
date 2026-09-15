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
import { useBcvRate } from '@/libs/context/bcv-price-context'
import { BcvRate } from '@/libs/bcv/types'
import { CurrencyCode } from '@/graphql/graphql'
import { priceFormatterFromMajor } from '@/utils/price-formatter'

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
  const { rateInfo, refresh, pendingChange, acknowledgeChange } = useBcvRate()
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
    const isAmountInBS =
      values.paymentDetails.paymentMethod === 'pago-movil' ||
      values.paymentDetails.paymentMethod === 'transferencia'

    // Bs payments must use a rate no older than what the customer has been
    // looking at on this page. Refresh right before submitting so a rate
    // that changed while this tab was open doesn't silently convert their
    // Bs amount at a stale rate.
    let bcvRateUsed: BcvRate | null = rateInfo

    if (isAmountInBS) {
      const freshRate = await refresh()
      // If the refresh failed, keep the rate the customer has been seeing.
      if (freshRate) bcvRateUsed = freshRate

      // `pendingChange` covers both this refresh and any earlier background
      // refresh (tab focus) that updated the rate without warning.
      const change =
        freshRate && rateInfo && rateInfo.rate !== freshRate.rate
          ? { from: pendingChange?.from ?? rateInfo, to: freshRate }
          : pendingChange

      if (change) {
        const newBsTotal =
          ((activeOrder?.totalWithTax ?? 0) / 100) * change.to.rate

        acknowledgeChange()
        toast({
          title: 'La tasa del BCV cambió',
          description: `La tasa pasó de ${priceFormatterFromMajor(change.from.rate, CurrencyCode.VES)} a ${priceFormatterFromMajor(change.to.rate, CurrencyCode.VES)} por dólar. El nuevo total a pagar es ${priceFormatterFromMajor(newBsTotal, CurrencyCode.VES)}. Revisa el monto antes de continuar.`,
          variant: 'destructive',
        })
        return
      }
    }

    const bcvDolar = bcvRateUsed?.rate || 0

    // rate: 0 means the rate service failed. Without this guard the
    // division below yields Infinity and the customer is told their amount is
    // invalid, which sends them off to "fix" a perfectly good payment.
    if (isAmountInBS && (!bcvDolar || !Number.isFinite(bcvDolar))) {
      toast({
        title: 'Error',
        description:
          'No se pudo obtener la tasa de cambio. Intenta de nuevo en unos momentos.',
        variant: 'destructive',
      })
      return
    }
    // Keep cents: the admin partial-payment handler compares this against
    // `initialPercentage`% of the order total, so rounding to whole dollars
    // can push a legitimate payment below the threshold and reject it.
    const amount = isAmountInBS
      ? Math.round((Number(values.paymentDetails.totalPaid) / bcvDolar) * 100) /
        100
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

          metadata: isAmountInBS
            ? {
                referencia: values.paymentDetails.reference,
                monto: amount,
                'fecha de pago': values.paymentDetails.date,
                telefono: values.paymentDetails.phone,
                tasa: bcvRateUsed?.rate ?? 0,
                'fecha valor': bcvRateUsed?.valueDate ?? '',
                fuente: bcvRateUsed?.source ?? 'dolarapi',
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

    const { data: transitionData, error: transitionError } = await vendureFetch(
      {
        query: TRANSITION_ORDER_STATE,
        variables: {
          state: 'ValidatingPayment',
        },
      }
    )

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              variant={'destructive'}
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
              onClick={cancelOrder}
            >
              Cancelar Pedido
            </Button>
            <Button
              type="button"
              variant={'outline'}
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
              onClick={backToShipping}
            >
              Corregir datos de envío
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            Finalizar Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}
