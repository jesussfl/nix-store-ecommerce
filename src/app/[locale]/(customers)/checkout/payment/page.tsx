import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import OrderSummary from '@/components/pages/checkout/order-summary'
import PaymentForm from '@/components/pages/checkout/payment-form'
import { BackLink } from '@/components/shared/back-link'
import { GetBCVPrice } from '@/utils/get-bcv-price'

export default async function PaymentPage() {
  const bcvPrice = await GetBCVPrice()
  return (
    <div className="-mt-16 space-y-4 md:mx-24">
      <BackLink />
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Datos de pago</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm />
          </CardContent>
        </Card>
        <Card className="h-auto shadow-none">
          <CardHeader>
            <CardTitle>Resumen de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary bcvPrice={bcvPrice} isPaymentStep={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
