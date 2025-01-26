import { useState } from 'react'
import { Payment } from './profile-page'
import { Order } from '@/graphql/graphql'

export const usePayments = () => {
  // Estado para el modal de pagos
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [currentPayments, setCurrentPayments] = useState<Payment[]>([])

  // Estado para el modal de pagos adicionales
  const [showRemainingPayment, setShowRemainingPayment] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

    //   // Prellenar el formulario con el monto pendiente
    //   form.reset({
    //     paymentDetails: {
    //       paymentMethod: 'pago-movil',
    //       totalPaid: String(pendingAmount / 100), // Convertir a decimal
    //       reference: '',
    //       date: '',
    //       phone: '',
    //     },
    //   })

    setShowRemainingPayment(true)
  }

  /**
   * Abrir el modal para ver los pagos
   */
  function handleViewPayments(payments: Payment[]) {
    setCurrentPayments(payments)
    setShowPaymentsModal(true)
  }
  return {
    showPaymentsModal,
    setShowPaymentsModal,
    currentPayments,
    setCurrentPayments,
    showRemainingPayment,
    setShowRemainingPayment,
    selectedOrder,
    setSelectedOrder,
    handlePayRemaining,
    handleViewPayments,
    calculateTotalPaid,
  }
}
