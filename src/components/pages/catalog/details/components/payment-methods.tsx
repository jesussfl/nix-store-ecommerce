import { useTranslations } from 'next-intl'

export const PaymentMethods = () => {
  const t = useTranslations('product_details')
  return (
    <div className="space-y-2">
      {/* <p className="text-sm font-semibold">{t('accepted_payment_methods')}</p> */}
      <div className="flex space-x-2">
        {/* Insert icons for payment methods here */}
      </div>
    </div>
  )
}
