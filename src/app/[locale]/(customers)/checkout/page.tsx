import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import ShippingForm from '@/components/pages/checkout/checkout-form'
import OrderSummary from '@/components/pages/checkout/order-summary'
import { BackLink } from '@/components/shared/back-link'
import { GetBCVPrice } from '@/utils/get-bcv-price'

export default async function CheckoutPage() {
  const bcvPrice = await GetBCVPrice()
  return (
    <div className="-mt-16 space-y-4 md:mx-24">
      <BackLink />

      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Datos de envío</CardTitle>
          </CardHeader>
          <CardContent>
            <ShippingForm />
          </CardContent>
        </Card>
        <Card className="h-auto shadow-none">
          <CardHeader>
            <CardTitle>Resumen de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary bcvPrice={bcvPrice} isPaymentStep={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
