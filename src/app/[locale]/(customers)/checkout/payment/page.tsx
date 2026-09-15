import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import PaymentOrderSummary from '@/components/pages/checkout/payment-order-summary'
import PaymentForm from '@/components/pages/checkout/payment-form'
import { getBcvRate } from '@/libs/bcv/rate.server'
import { BcvRateProvider } from '@/libs/context/bcv-price-context'

export default async function PaymentPage() {
  const bcvRate = await getBcvRate()
  return (
    <BcvRateProvider initialState={bcvRate}>
      <div className="mx-auto w-full max-w-6xl px-4 mt-4 space-y-4 sm:mt-6">
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
              <PaymentOrderSummary fallbackBcvPrice={bcvRate.rate} />
            </CardContent>
          </Card>
        </div>
      </div>
    </BcvRateProvider>
  )
}
