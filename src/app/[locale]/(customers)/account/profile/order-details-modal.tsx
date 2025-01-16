'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/table/table'
import { Button } from '@/components/shared/button'
import { Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/dialog/dialog'
import { getOrderStatusBadge } from '@/utils/get-order-status-badge'
import { priceFormatter } from '@/utils/price-formatter'
import { GetCustomerOrdersQuery, Order } from '@/graphql/graphql'
import { formatDate } from '@/utils/format-date'

export const OrderDetailsModal = ({ order }: { order: Order }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm">
        <Eye className="mr-2 h-4 w-4" />
        Ver detalles
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detalles de la Orden {order.code}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Estado:</span>
          <span>{getOrderStatusBadge(order.state)}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Total:</span>
          <span>{priceFormatter(order.totalWithTax, order.currencyCode)}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Envío:</span>
          <span>
            {priceFormatter(order.shippingWithTax, order.currencyCode)}
          </span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Cantidad total:</span>
          <span>{order.totalQuantity}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Fecha de creación:</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <span className="font-medium">Última actualización:</span>
          <span>{formatDate(order.updatedAt)}</span>
        </div>
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Pagos</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    {priceFormatter(payment.amount, order.currencyCode)}
                  </TableCell>
                  <TableCell>{getOrderStatusBadge(payment.state)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)
