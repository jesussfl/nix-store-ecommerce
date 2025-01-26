import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/table/table'

import { priceFormatter } from '@/utils/price-formatter'
import { formatDate } from '@/utils/format-date'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/dialog/dialog'
import { Payment } from './profile-page'
interface PaymentsModalProps {
  isOpen: boolean
  onClose: () => void
  payments: Payment[]
}

export const PaymentsModal: React.FC<PaymentsModalProps> = ({
  isOpen,
  onClose,
  payments,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pagos Realizados</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {payments.length === 0 ? (
            <p>No hay pagos realizados para esta orden.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Referencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      {priceFormatter(payment.amount, 'USD')}
                    </TableCell>
                    <TableCell>{payment.state}</TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                    <TableCell>{payment.transactionId || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
