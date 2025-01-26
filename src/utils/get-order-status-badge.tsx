import { Badge } from '@/components/shared/badge'

export const getOrderStatusBadge = (status: string) => {
  const statusStyles = {
    PaymentSettled: { variant: 'default', label: 'Pagado' },
    PaymentAuthorized: { variant: 'success', label: 'Autorizado' },
    PaymentPending: { variant: 'warning', label: 'Pendiente' },
    PartiallyPaid: { variant: 'warning', label: 'Pago Parcial' },
    Cancelled: { variant: 'destructive', label: 'Cancelado' },
    ValidatingPayment: { variant: 'warning', label: 'Validando Pago' },
    ReceivedForShipping: { variant: 'success', label: 'Recibido para Envío' },
    ArrangingAdditionalPayment: {
      variant: 'warning',
      label: 'Esperando Pago Restante',
    },
    Delivered: { variant: 'success', label: 'Entregado' },
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
