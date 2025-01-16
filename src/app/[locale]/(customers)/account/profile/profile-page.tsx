'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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
import { useToast } from '@/components/shared/toast/use-toast'

import H1 from '@/components/shared/headings'
import { Order } from '@/graphql/graphql'
import { OrderDetailsModal } from './order-details-modal'
import { ItemsModal } from './items-modal'

import { priceFormatter } from '@/utils/price-formatter'
import { formatDate } from '@/utils/format-date'
import { getOrderStatusBadge } from '@/utils/get-order-status-badge'
import { paymentDetailsSchema } from '@/utils/schemas/payment'
import { vendureFetch } from '@/libs/vendure'
import {
  ADD_ADDITIONAL_PAYMENT_TO_ORDER,
  ADD_PAYMENT_TO_ORDER,
} from '@/libs/queries/payment'
import { TRANSITION_ORDER_STATE } from '@/libs/queries/order'
import { GetBCVPrice } from '@/utils/get-bcv-price'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/dialog/dialog'
import { PaymentFields } from './payment-fields' // Ajusta la ruta de importación
import { Form } from '@/components/shared/form'

// Tipos para los pagos
interface Payment {
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

// Esquema de validación para el formulario de pago parcial
const formSchema = z.object({
  paymentDetails: paymentDetailsSchema,
})

type FormSchema = z.infer<typeof formSchema>

// Componente para mostrar los pagos de una orden en un modal
interface PaymentsModalProps {
  isOpen: boolean
  onClose: () => void
  payments: Payment[]
}

const PaymentsModal: React.FC<PaymentsModalProps> = ({
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

export default function OrderManagement() {
  // Estado para el modal de pagos
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [currentPayments, setCurrentPayments] = useState<Payment[]>([])

  // Estado para el modal de pagos adicionales
  const [showRemainingPayment, setShowRemainingPayment] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Tabs
  const [activeTab, setActiveTab] = useState('orders')

  // Hooks personalizados
  const { currentCustomer } = useCart()
  const { handleLogOut } = useUserSesion()
  const { toast } = useToast()

  const isOrderEmpty = currentCustomer?.orders?.items.length === 0

  // Obtener y ordenar las órdenes
  const orders = currentCustomer?.orders?.items || []
  const sortedOrders = orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Configuración del formulario para pagos
  const form = useForm<FormSchema>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentDetails: {
        paymentMethod: 'pago-movil', // Asegúrate de usar el código correcto del método de pago
        totalPaid: '',
        reference: '',
        date: '',
        phone: '',
      },
    },
  })

  /**
   * Función para calcular el total pagado
   */
  const calculateTotalPaid = (payments: Payment[]) => {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  /**
   * Abrir el modal para pagar el restante
   */
  function handlePayRemaining(order: Order) {
    setSelectedOrder(order)

    const totalPaidSoFar = calculateTotalPaid(order.payments ?? [])
    const pendingAmount = order.totalWithTax - totalPaidSoFar

    // Prellenar el formulario con el monto pendiente
    form.reset({
      paymentDetails: {
        paymentMethod: 'pago-movil',
        totalPaid: String(pendingAmount / 100), // Convertir a decimal
        reference: '',
        date: '',
        phone: '',
      },
    })

    setShowRemainingPayment(true)
  }

  /**
   * Abrir el modal para ver los pagos
   */
  function handleViewPayments(payments: Payment[]) {
    setCurrentPayments(payments)
    setShowPaymentsModal(true)
  }

  /**
   * Manejar el envío del formulario de pago
   */
  const onSubmit = async (values: FormSchema) => {
    if (!selectedOrder) {
      toast({
        title: 'Error',
        description: 'No se ha seleccionado ninguna orden.',
        variant: 'destructive',
      })
      return
    }

    const bcvDolar = await GetBCVPrice()
    if (!bcvDolar || isNaN(bcvDolar)) {
      toast({
        title: 'Error',
        description:
          'No se pudo obtener el precio del dólar. Intenta de nuevo.',
        variant: 'destructive',
      })
      return
    }

    const isAmountInBS =
      values.paymentDetails.paymentMethod === 'pago-movil' ||
      values.paymentDetails.paymentMethod === 'transferencia'

    let amount = Number(values.paymentDetails.totalPaid)
    if (isAmountInBS) {
      // Convertir BS a USD
      amount = Math.round((amount / bcvDolar) * 100) / 100 // Redondear a dos decimales
    }

    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'El monto pagado debe ser mayor que 0.',
        variant: 'destructive',
      })
      return
    }

    console.log('amount', amount)

    const { data, error } = await vendureFetch({
      query: ADD_ADDITIONAL_PAYMENT_TO_ORDER, // Asegúrate de tener esta mutation definida
      variables: {
        orderCode: selectedOrder.code,
        paymentMethodCode: values.paymentDetails.paymentMethod,
        metadata: {
          referencia: values.paymentDetails.reference,
          monto: amount, // En decimal
          'fecha de pago': values.paymentDetails.date,
          telefono: values.paymentDetails.phone,
        },
      },
    })

    console.log(data, error, 'payment')

    if (data?.addPaymentToExistingOrder) {
      // Asegúrate de que esta respuesta exista
      const { data: transitionData, error: transitionError } =
        await vendureFetch({
          query: TRANSITION_ORDER_STATE,
          variables: {
            state: 'ValidatingPayment',
          },
        })

      console.log(data, error, 'transition')
      toast({
        title: 'Pago exitoso',
        description: 'El pago adicional se ha realizado correctamente.',
        variant: 'default',
      })
      setShowRemainingPayment(false)
    }

    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error || 'Error al realizar el pago.',
        variant: 'destructive',
      })
      return
    }

    console.log('Payment details:', values.paymentDetails)
  }

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
      <Dialog
        open={showRemainingPayment}
        onOpenChange={setShowRemainingPayment}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pagar Monto Adicional</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Campos de pago */}
              <PaymentFields />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRemainingPayment(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? 'Procesando...'
                    : 'Pagar Adicional'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
