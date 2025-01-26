'use client'

import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/table/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/dropdown-menu/dropdown-menu'
import { Button } from '@/components/shared/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared/tabs/tabs'

import { MoreHorizontal, CreditCard, LogOut } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import { useUserSesion } from '@/hooks/use-user-sesion'

import H1 from '@/components/shared/headings'
import { OrderDetailsModal } from './order-details-modal'
import { ItemsModal } from './items-modal'

import { priceFormatter } from '@/utils/price-formatter'
import { formatDate } from '@/utils/format-date'
import { getOrderStatusBadge } from '@/utils/get-order-status-badge'

import { PaymentsModal } from './payments-modal'
import { usePayments } from './use-payments'
import { AdditionalPaymentModal } from './additional-payment-modal'

export interface Payment {
  id: string
  method: string
  amount: number
  state: string
  transactionId: string
  referencia?: string
  fecha_de_pago?: string
  telefono?: string
  errorMessage?: string
  createdAt: string
}

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('orders')

  const { currentCustomer } = useCart()
  const {
    selectedOrder,
    handleViewPayments,
    setShowRemainingPayment,
    handlePayRemaining,
    calculateTotalPaid,
    showPaymentsModal,
    setShowPaymentsModal,
    currentPayments,
    showRemainingPayment,
  } = usePayments()
  const { handleLogOut } = useUserSesion()

  const orders = currentCustomer?.orders?.items || []
  const sortedOrders = orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="container mx-auto py-6">
      {/* Heading + Logout button */}
      <div className="my-4 flex items-center justify-between">
        <H1>Mi cuenta</H1>
        <Button onClick={handleLogOut} variant="secondary">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {/* Tabs for Orders/Account */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="orders">Mis órdenes</TabsTrigger>
          <TabsTrigger value="account">Información de la cuenta</TabsTrigger>
        </TabsList>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de orden</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Pagado</TableHead>
                    <TableHead>Pendiente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Pagos</TableHead> {/* Nueva columna */}
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders?.map((order) => {
                    const totalPaid = calculateTotalPaid(order.payments ?? [])
                    const pendingAmount = order.totalWithTax - totalPaid

                    // Verificar si todos los pagos están en estado 'settled'
                    const allPaymentsSettled = (order.payments || []).every(
                      (payment) => payment.state === 'settled'
                    )

                    // Verificar si la orden está en estado 'arrangingAditionalPayments'
                    const isArrangingAdditional =
                      order.state === 'arrangingAditionalPayments'

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.code}
                        </TableCell>
                        <TableCell>
                          {priceFormatter(
                            order.totalWithTax,
                            order.currencyCode
                          )}
                        </TableCell>
                        <TableCell>
                          {priceFormatter(totalPaid, order.currencyCode)}
                        </TableCell>
                        <TableCell>
                          {priceFormatter(pendingAmount, order.currencyCode)}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          {getOrderStatusBadge(order.state)}
                        </TableCell>
                        <TableCell>
                          <ItemsModal order={order} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewPayments(order.payments ?? [])
                            }
                            disabled={(order.payments ?? []).length === 0}
                          >
                            Ver Pagos
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menú</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Mostrar opción de pago adicional solo si la orden está en el estado correcto y todos los pagos están en 'settled' */}
                              {isArrangingAdditional && allPaymentsSettled && (
                                <DropdownMenuItem
                                  onClick={() => handlePayRemaining(order)}
                                  disabled={pendingAmount <= 0}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Pagar adicional
                                </DropdownMenuItem>
                              )}

                              {/* Otras opciones de menú */}
                              <DropdownMenuItem asChild>
                                <OrderDetailsModal order={order} />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCOUNT INFO TAB */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              {currentCustomer && (
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Nombre:</span>{' '}
                    {currentCustomer.firstName} {currentCustomer.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{' '}
                    {currentCustomer.emailAddress}
                  </div>
                  {/* Añade más información del cliente si lo deseas */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver los pagos realizados */}
      <PaymentsModal
        isOpen={showPaymentsModal}
        onClose={() => setShowPaymentsModal(false)}
        payments={currentPayments}
      />

      {/* Dialog para pagar el monto adicional */}
      <AdditionalPaymentModal
        selectedOrder={selectedOrder}
        showRemainingPayment={showRemainingPayment}
        setShowRemainingPayment={setShowRemainingPayment}
      />
    </div>
  )
}
