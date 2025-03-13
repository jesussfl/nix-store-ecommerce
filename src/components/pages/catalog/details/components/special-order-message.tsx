import { Alert, AlertDescription, AlertTitle } from '@/components/shared/alert'
import { InfoIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const SpecialOrderMessage = () => {
  const t = useTranslations('product_details')
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>{t('special_order_title')}</AlertTitle>
      <AlertDescription>{t('special_order_description')}</AlertDescription>
    </Alert>
  )
}
