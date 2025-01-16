import { Badge } from '@/components/shared/badge'

export const getOrderStatusBadge = (status: string) => {
  const statusStyles = {
    PaymentSettled: { variant: 'default', label: 'Pagado' },
    PaymentAuthorized: { variant: 'success', label: 'Autorizado' },
    PaymentPending: { variant: 'warning', label: 'Pendiente' },
    PartiallyPaid: { variant: 'warning', label: 'Pago Parcial' },
  } as const

  const style = statusStyles[status as keyof typeof statusStyles] || {
    variant: 'outline',
    label: status,
  }

  return (
    <Badge
      variant={style.variant as 'default' | 'success' | 'warning' | 'outline'}
    >
      {style.label}
    </Badge>
  )
}
