'use server'

import { jsPDF } from 'jspdf'
import { vendureFetch } from '@/libs/vendure'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
import { priceFormatter } from '@/utils/price-formatter'

const getAbsoluteUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  return new URL(path, baseUrl).toString()
}

const logoUrl = getAbsoluteUrl('/assets/logo/nix-logo.png')

// Helper function to fetch the image and convert it to Base64
async function getImageAsBase64(relativePath) {
  const absoluteUrl = getAbsoluteUrl(relativePath)
  const response = await fetch(absoluteUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

/**
 * Helper: Draws multiple lines of text at (x, y), returning
 * the updated y position after printing all lines.
 */
function drawMultiLineText(doc, text, x, startY, maxWidth, lineHeight = 5) {
  // splitTextToSize returns an array of lines that fit within maxWidth
  const lines = doc.splitTextToSize(text, maxWidth)
  let currentY = startY
  lines.forEach((line) => {
    doc.text(line, x, currentY)
    currentY += lineHeight
  })
  return currentY
}

export async function generateReceipt(orderCode) {
  const { data, error } = await vendureFetch({
    query: GET_ORDER_BY_CODE,
    variables: { code: orderCode },
  })

  if (error || !data?.orderByCode) {
    throw new Error('Pedido no encontrado')
  }

  const order = data.orderByCode

  // Colors
  const blackColor = '#000000'
  const primaryPurple = '#641ec8'

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Increase line-height for better spacing
  doc.setLineHeightFactor(1.2)

  // Utility to draw a filled rectangle
  function drawRect(x, y, width, height, color) {
    doc.setFillColor(color)
    doc.rect(x, y, width, height, 'F')
  }

  // Utility to draw a thin horizontal line in light gray
  function drawHorizontalLine(x1, y, x2) {
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(x1, y, x2, y)
  }

  // ---------------------------------
  // HEADER (Black background)
  // ---------------------------------
  drawRect(0, 0, 210, 35, blackColor)

  // Logo on the left
  const logoBase64 = await getImageAsBase64(logoUrl)
  doc.addImage(logoBase64, 'PNG', 20, 5, 35, 25)

  // “NOTA DE ENTREGA” on the right
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('NOTA DE ENTREGA', 135, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const emitDate = new Date(order.createdAt).toLocaleDateString('es-ES')
  doc.text(`Fecha de emisión: ${emitDate}`, 135, 18)
  doc.text(`N° de Pedido: ${order.code}`, 135, 23)

  // We'll track separate Y positions for left and right columns
  let leftColumnY = 42
  let rightColumnY = 42

  // ---------------------------------
  // DATOS DEL CLIENTE (Left column)
  // ---------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(primaryPurple)
  doc.text('Datos del cliente', 20, leftColumnY)
  leftColumnY += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  // Nombre y Apellido
  leftColumnY = drawMultiLineText(
    doc,
    `Nombre y Apellido: ${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}`,
    20,
    leftColumnY,
    90 // max width for left column
  )

  // Teléfono
  if (order.customer?.phoneNumber) {
    leftColumnY = drawMultiLineText(
      doc,
      `Teléfono: ${order.customer.phoneNumber}`,
      20,
      leftColumnY,
      90
    )
  }

  // Dirección de envío
  // Combine the relevant address fields in one string
  const addressString = [
    order.shippingAddress?.streetLine1 ?? '',
    order.shippingAddress?.streetLine2 ?? '',
    order.shippingAddress?.city ?? '',
    order.shippingAddress?.province ?? '',
    order.shippingAddress?.postalCode ?? '',
  ]
    .filter(Boolean)
    .join(', ')

  leftColumnY = drawMultiLineText(
    doc,
    `Dirección de envío: ${addressString}`,
    20,
    leftColumnY,
    90
  )

  // Add a bit of space after
  leftColumnY += 5

  // ---------------------------------
  // PLAZO DE LLEGADA (Right column)
  // ---------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(primaryPurple)
  doc.text('Plazo de llegada', 130, rightColumnY)
  rightColumnY += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  // Lote name + description, each wrapped
  const loteName = `Lote: ${order.customFields?.lote?.name ?? ''}`
  rightColumnY = drawMultiLineText(doc, loteName, 130, rightColumnY, 60)

  const loteDesc = order.customFields?.lote?.description ?? ''
  rightColumnY = drawMultiLineText(doc, loteDesc, 130, rightColumnY, 60)

  // Final Y after columns
  let currentY = Math.max(leftColumnY, rightColumnY) + 5

  // ------------------------------------------------
  // TABLE HEADERS: Descripción | Uds. | Proveedor...
  // ------------------------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)

  drawRect(20, currentY, 170, 8, primaryPurple)
  const tableHeaderY = currentY + 5
  doc.text('Descripción', 22, tableHeaderY)
  doc.text('Uds.', 78, tableHeaderY)
  doc.text('Proveedor', 100, tableHeaderY)
  doc.text('Precio Unitario', 130, tableHeaderY)
  doc.text('Precio', 170, tableHeaderY, { align: 'right' })

  currentY += 8

  // ---------------------------------
  // TABLE BODY
  // ---------------------------------
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  order.lines.forEach((line) => {
    const unitPrice = (line.unitPriceWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    })
    const lineTotal = (line.linePriceWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    })
    const provider = line.productVariant.customFields?.provider || 'N/A'

    const rowY = currentY + 5
    // If the product name is very long, split it to size so it won't overflow
    const splittedName = doc.splitTextToSize(line.productVariant.name, 50)

    // Print name (multi-line if needed)
    let tempY = rowY
    splittedName.forEach((txt) => {
      doc.text(txt, 22, tempY)
      tempY += 4
    })

    // We only print quantity, provider, and prices on the first line
    // but if the name took multiple lines, we shift them accordingly
    doc.text(String(line.quantity), 78, rowY)
    doc.text(provider, 100, rowY)
    doc.text(unitPrice, 130, rowY)
    doc.text(lineTotal, 170, rowY, { align: 'right' })

    // The next row starts where the largest multi-line block ended
    const lineHeightUsed = Math.max(tempY - rowY, 4) // at least 4 if name is short
    currentY += lineHeightUsed + 2

    drawHorizontalLine(20, currentY, 190)
  })

  currentY += 5

  // ----------------------
  // DETALLES DE PAGO
  // ----------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(primaryPurple)
  doc.text('Detalles de pago', 20, currentY)
  currentY += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  // Payment info
  const partialPaid =
    order.payments?.reduce((total, payment) => total + payment.amount, 0) ?? 0
  const partialRemaining = order.totalWithTax - partialPaid

  doc.text(
    `Abonado: ${priceFormatter(partialPaid, order.currencyCode)}`,
    20,
    currentY
  )
  currentY += 5
  doc.text(
    `Restan: ${priceFormatter(partialRemaining, order.currencyCode)}`,
    20,
    currentY
  )

  // Right side totals
  let summaryY = currentY - 5
  const rightX = 150

  doc.text('SUBTOTAL:', rightX, summaryY)
  doc.text(
    (order.subTotalWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    rightX + 40,
    summaryY,
    { align: 'right' }
  )
  summaryY += 5

  doc.text('Descuento:', rightX, summaryY)
  const totalDiscount =
    order.discounts?.reduce((acc, d) => acc + d.amountWithTax, 0) || 0
  doc.text(
    (totalDiscount / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    rightX + 40,
    summaryY,
    { align: 'right' }
  )
  summaryY += 5

  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', rightX, summaryY)
  doc.text(
    (order.totalWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    rightX + 40,
    summaryY,
    { align: 'right' }
  )

  doc.setFont('helvetica', 'normal')

  currentY += 12

  // ----------------------
  // COMENTARIOS
  // ----------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(primaryPurple)
  doc.text('Comentarios', 20, currentY)
  currentY += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  const comments = [
    'El plazo de llegada ha sido ajustado como resultado de los recientes cambios en los procesos aduaneros y está',
    'sujeto a modificaciones por factores externos que escapan a nuestro control. La nota de entrega puede sufrir',
    'modificaciones en caso de que se añadan nuevos productos, se realicen pagos al saldo pendiente (si lo hay)',
    'o ante cualquier otro cambio.',
  ]
  comments.forEach((line) => {
    doc.text(line, 20, currentY)
    currentY += 5
  })

  currentY += 10

  // ----------------------
  // FOOTER (Black)
  // ----------------------
  const footerHeight = 15
  const footerY = 285 - footerHeight
  drawRect(0, footerY, 210, footerHeight, blackColor)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text('¡Gracias por tu compra!', 105, footerY + 5, { align: 'center' })
  doc.text(
    '0412 3761604 | @nixstore.mcy | Maracay, edo. Aragua',
    105,
    footerY + 10,
    {
      align: 'center',
    }
  )

  // Output the PDF
  const pdfBuffer = doc.output('arraybuffer')
  return {
    pdfBuffer: Array.from(new Uint8Array(pdfBuffer)),
    fileName: `recibo-pedido-${order.code}.pdf`,
  }
}
