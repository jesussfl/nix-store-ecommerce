'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/shared/form'
import PaymentFields from './payment-fields'
import { useCart } from '@/components/cart/cart-context'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/shared/button'

import Link from 'next/link'
import { cn } from '@/libs/utils'
import { vendureFetch } from '@/libs/vendure'
import { ADD_PAYMENT_TO_ORDER } from '@/libs/queries/payment'

const formSchema = z.object({
  paymentDetails: z
    .object({
      paymentMethod: z.string().optional(),
      reference: z.string().optional(),
      phone: z.any().optional(),
      date: z.any().optional(),
    })
    .optional(),
})

type FormSchema = z.infer<typeof formSchema>

export default function PaymentForm() {
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
      paymentDetails: {},
    },
  })

  const onSubmit = async (values: FormSchema) => {
    const { data, error } = await vendureFetch({
      query: ADD_PAYMENT_TO_ORDER,
      variables: {
        input: {
          method: 'pago-movil',
          metadata: {
            reference: 'sarabquinonesv@gmail.com',
          },
        },
      },
    })

    if (data?.addPaymentToOrder) {
      router.replace('/checkout/confirmation/' + activeOrder?.code)
    }

    if (error) {
      console.error(error)
      return
    }
    console.log('Payment details:', values.paymentDetails)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PaymentFields />
        <div className="flex justify-between">
          <Link
            href="/checkout"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Volver a Envío
          </Link>
          <Button
            type="submit"
            className="ml-auto"
            disabled={form.formState.isSubmitting}
          >
            Finalizar Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}
