'use client'

import { useEffect, useState } from 'react'
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
import { Badge } from '@/components/shared/badge'
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
} from '@/components/shared/tabs/basic-tabs'
import { MoreHorizontal, CreditCard, Eye, LogOut } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shared/dialog/dialog'
import { useRouter } from 'next/navigation'
import H1 from '@/components/shared/headings'

interface Payment {
  id: string
  method: string
  amount: number
  state: string
  transactionId: string
  errorMessage?: string
  createdAt: string
}

interface Order {
  id: string
  code: string
  state: string
  totalWithTax: number
  currencyCode: string
  createdAt: string
  updatedAt: string
  orderPlacedAt: string
  type: string
  shippingWithTax: number
  totalQuantity: number
  payments: Payment[]
}

export default function Component() {
  const [activeTab, setActiveTab] = useState('orders')
  const { currentCustomer, isLogged, isLoading, logOut } = useCart()
  const router = useRouter()
  const orders = currentCustomer?.orders?.items || []

  useEffect(() => {
    if (!isLogged && !isLoading) {
      router.push('/account/login?callback=/account/profile')
    }
  }, [isLogged, isLoading, router])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-VE')
  }

  const getOrderStatusBadge = (status: string) => {
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

  const handlePayRemaining = (orderId: string) => {
    console.log('Pay remaining for order:', orderId)
    // Implement payment logic here
  }

  const handleLogOut = () => {
    logOut()
    window.location.href = '/'
  }
  const calculateTotalPaid = (payments: Payment[]) => {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  const OrderDetailsModal = ({ order }: { order: Order }) => (
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
            <span>
              {formatCurrency(order.totalWithTax, order.currencyCode)}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Envío:</span>
            <span>
              {formatCurrency(order.shippingWithTax, order.currencyCode)}
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
                {order.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      {formatCurrency(payment.amount, order.currencyCode)}
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Inicio
        </a>
        <span>/</span>
        <span className="text-foreground">Mi cuenta</span>
      </div>
      <div className="my-4 flex items-center justify-between">
        <H1>Mi cuenta</H1>
        <Button onClick={handleLogOut} variant="secondary" className="mt-6">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="orders">Mis ordenes</TabsTrigger>
          <TabsTrigger value="account">Información de la cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis ordenes</CardTitle>
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
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order: Order) => {
                    const totalPaid = calculateTotalPaid(order.payments)
                    const pendingAmount = order.totalWithTax - totalPaid
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.code}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            order.totalWithTax,
                            order.currencyCode
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(totalPaid, order.currencyCode)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(pendingAmount, order.currencyCode)}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          {getOrderStatusBadge(order.state)}
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
                              <DropdownMenuItem
                                onClick={() => handlePayRemaining(order.id)}
                                disabled={
                                  order.state === 'PaymentSettled' ||
                                  pendingAmount <= 0
                                }
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pagar restante
                              </DropdownMenuItem>
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
                  {/* Add more customer information as needed */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
