'use client'

import { Button } from '@/components/shared/button'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/dialog/dialog'
import { PaymentFields } from './payment-fields' // Ajusta la ruta de importación
import { Form } from '@/components/shared/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Order } from '@/graphql/graphql'

import { vendureFetch } from '@/libs/vendure'
import { ADD_ADDITIONAL_PAYMENT_TO_ORDER } from '@/libs/queries/payment'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'
import { GetBCVPrice } from '@/utils/get-bcv-price'
import { paymentDetailsSchema } from '@/utils/schemas/payment'
import { z } from 'zod'
import { useToast } from '@/components/shared/toast/use-toast'

const formSchema = z.object({
  paymentDetails: paymentDetailsSchema,
})

type FormSchema = z.infer<typeof formSchema>

export const AdditionalPaymentModal = ({
  selectedOrder,
  setShowRemainingPayment,
  showRemainingPayment,
}: {
  selectedOrder: Order | null
  setShowRemainingPayment: (show: boolean) => void
  showRemainingPayment: boolean
}) => {
  const { toast } = useToast()

  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentDetails: {
        paymentMethod: 'pago-movil', // Asegúrate de usar el código correcto del método de pago
        totalPaid: '',
        reference: '',
        date: '',
        phone: '',
      },
    },
  })

  const onSubmit = async (values: FormSchema) => {
    if (!selectedOrder) {
      toast({
        title: 'Error',
        description: 'No se ha seleccionado ninguna orden.',
        variant: 'destructive',
      })
      return
    }

    const bcvDolar = await GetBCVPrice()
    if (!bcvDolar || isNaN(bcvDolar)) {
      toast({
        title: 'Error',
        description:
          'No se pudo obtener el precio del dólar. Intenta de nuevo.',
        variant: 'destructive',
      })
      return
    }

    const isAmountInBS =
      values.paymentDetails.paymentMethod === 'pago-movil' ||
      values.paymentDetails.paymentMethod === 'transferencia'

    let amount = Number(values.paymentDetails.totalPaid)
    if (isAmountInBS) {
      // Convertir BS a USD
      amount = Math.round((amount / bcvDolar) * 100) / 100 // Redondear a dos decimales
    }

    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'El monto pagado debe ser mayor que 0.',
        variant: 'destructive',
      })
      return
    }

    console.log('amount', amount)

    const { data, error } = await vendureFetch({
      query: ADD_ADDITIONAL_PAYMENT_TO_ORDER, // Asegúrate de tener esta mutation definida
      variables: {
        orderCode: selectedOrder.code,
        paymentMethodCode: values.paymentDetails.paymentMethod,
        metadata: {
          referencia: values.paymentDetails.reference,
          monto: amount, // En decimal
          'fecha de pago': values.paymentDetails.date,
          telefono: values.paymentDetails.phone,
        },
      },
    })

    console.log(data, error, 'payment')

    if (data?.addPaymentToExistingOrder) {
      // Asegúrate de que esta respuesta exista
      const { data: transitionData, error: transitionError } =
        await vendureFetch({
          query: TRANSITION_ORDER_STATE,
          variables: {
            state: 'ValidatingPayment',
          },
        })

      console.log(data, error, 'transition')
      toast({
        title: 'Pago exitoso',
        description: 'El pago adicional se ha realizado correctamente.',
        variant: 'default',
      })
      setShowRemainingPayment(false)
    }

    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error || 'Error al realizar el pago.',
        variant: 'destructive',
      })
      return
    }
  }
  return (
    <Dialog open={showRemainingPayment} onOpenChange={setShowRemainingPayment}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pagar Monto Adicional</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Campos de pago */}
            <PaymentFields />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRemainingPayment(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Procesando...'
                  : 'Pagar Adicional'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
