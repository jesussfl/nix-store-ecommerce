import { Alert, AlertDescription, AlertTitle } from '@/components/shared/alert'
import { InfoIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SpecialOrderMessageProps {
  isImmediatelyAvailable?: boolean
}

export const SpecialOrderMessage = ({
  isImmediatelyAvailable = false,
}: SpecialOrderMessageProps) => {
  const t = useTranslations('product_details')

  // No mostrar el mensaje si el producto está disponible inmediatamente
  if (isImmediatelyAvailable) {
    return null
  }

  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>{t('special_order_title')}</AlertTitle>
      <AlertDescription>{t('special_order_description')}</AlertDescription>
    </Alert>
  )
}
