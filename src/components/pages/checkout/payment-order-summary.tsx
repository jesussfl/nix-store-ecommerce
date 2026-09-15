'use client'

/**
 * Thin wrapper so `OrderSummary` (also used, with a plain `bcvPrice` prop,
 * by the shipping step and the mobile bottom bar) reads the same rate as
 * `PaymentFields`/`PaymentForm` during the payment step, via
 * `BcvRateProvider` (see `checkout/payment/page.tsx`).
 */
import OrderSummary from '@/components/pages/checkout/order-summary'
import { useBcvRate } from '@/libs/context/bcv-price-context'

export default function PaymentOrderSummary({
  fallbackBcvPrice,
}: {
  fallbackBcvPrice: number
}) {
  const { rateInfo } = useBcvRate()

  return (
    <OrderSummary
      bcvPrice={rateInfo?.rate || fallbackBcvPrice}
      isPaymentStep={true}
    />
  )
}
