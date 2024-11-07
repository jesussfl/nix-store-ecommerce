'use client'

import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import CheckoutForm from './checkout-form'
import OrderSummary from './order-summary'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const step = searchParams.get('step') || 'shipping'

  return (
    <div className="container mx-auto mt-6 grid items-start gap-6 md:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {step === 'shipping' ? 'Datos de envío' : 'Datos de pago'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutForm initialStep={step as 'shipping' | 'payment'} />
        </CardContent>
      </Card>
      <Card className="h-auto shadow-none">
        <CardHeader>
          <CardTitle>Resumen de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummary isPaymentStep={step === 'payment'} />
        </CardContent>
      </Card>
    </div>
  )
}
