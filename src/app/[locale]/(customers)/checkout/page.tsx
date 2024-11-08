import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import CheckoutForm from './checkout-form'
import OrderSummary from './order-summary'

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const { step } = searchParams
  return (
    <div className="mt-12 grid items-start gap-6 md:mx-8 md:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {step === 'shipping' ? 'Datos de envío' : 'Datos de pago'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutForm
            initialStep={(step as 'shipping' | 'payment') || 'shipping'}
          />
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
