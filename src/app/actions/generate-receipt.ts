'use server'

import { jsPDF } from 'jspdf'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { vendureFetch } from '@/libs/vendure'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
import { priceFormatter } from '@/utils/price-formatter'

type ReceiptResult = {
  pdfBuffer: number[]
  fileName: string
}

const getMimeType = (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase()

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    default:
      return 'image/png'
  }
}

async function getPublicImageAsBase64(publicPath: string) {
  const normalizedPath = publicPath.replace(/^\/+/, '')
  const imagePath = path.join(process.cwd(), 'public', normalizedPath)
  const buffer = await readFile(imagePath)

  return `data:${getMimeType(imagePath)};base64,${buffer.toString('base64')}`
}

/**
 * Helper: Draws multiple lines of text at (x, y), returning
 * the updated y position after printing all lines.
 */
function drawMultiLineText(
  doc: jsPDF,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight = 5
) {
  // splitTextToSize returns an array of lines that fit within maxWidth
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  let currentY = startY
  lines.forEach((line) => {
    doc.text(line, x, currentY)
    currentY += lineHeight
  })
  return currentY
}

export async function generateReceipt(
  orderCode: string
): Promise<ReceiptResult> {
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
  function drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    doc.setFillColor(color)
    doc.rect(x, y, width, height, 'F')
  }

  // Utility to draw a thin horizontal line in light gray
  function drawHorizontalLine(x1: number, y: number, x2: number) {
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(x1, y, x2, y)
  }

  // ---------------------------------
  // HEADER (Black background)
  // ---------------------------------
  drawRect(0, 0, 210, 35, blackColor)

  // Logo on the left
  const logoBase64 = await getPublicImageAsBase64('/assets/logo/nix-logo.png')
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

  // We'll track Y position for left column
  let leftColumnY = 42

  // ---------------------------------
  // DATOS DEL CLIENTE
  // ---------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(primaryPurple)
  doc.text('DATOS DEL CLIENTE', 20, leftColumnY)
  leftColumnY += 6

  doc.setFontSize(10)

  // Nombre y Apellido
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(80, 80, 80)
  doc.text('Nombre y Apellido:', 20, leftColumnY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text(`${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}`, 58, leftColumnY)
  leftColumnY += 5

  // Teléfono
  if (order.customer?.phoneNumber) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80, 80, 80)
    doc.text('Teléfono:', 20, leftColumnY)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(order.customer.phoneNumber, 58, leftColumnY)
    leftColumnY += 5
  }

  // Dirección de envío
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(80, 80, 80)
  doc.text('Dirección de envío:', 20, leftColumnY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)

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
    addressString,
    58,
    leftColumnY,
    132
  )

  // Final Y after columns
  let currentY = leftColumnY + 5

  // Column X Coordinates
  const colDescX = 22
  const colQtyX = 110
  const colUnitPriceX = 155
  const colTotalX = 188

  // ------------------------------------------------
  // TABLE HEADERS: Descripción | Uds. | SKU...
  // ------------------------------------------------
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)

  drawRect(20, currentY, 170, 8, primaryPurple)
  const tableHeaderY = currentY + 5
  doc.text('Descripción', colDescX, tableHeaderY)
  doc.text('Uds.', colQtyX, tableHeaderY, { align: 'center' })
  doc.text('Precio Unitario', colUnitPriceX, tableHeaderY, { align: 'right' })
  doc.text('Precio', colTotalX, tableHeaderY, { align: 'right' })

  currentY += 8

  // ---------------------------------
  // TABLE BODY
  // ---------------------------------
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  order.lines.forEach((line) => {
    const unitPrice = priceFormatter(line.unitPriceWithTax, order.currencyCode)
    const lineTotal = priceFormatter(line.linePriceWithTax, order.currencyCode)
    const rowY = currentY + 5
    // If the product name is very long, split it to size so it won't overflow
    const splittedName = doc.splitTextToSize(
      line.productVariant.name,
      78
    ) as string[]

    // Print name (multi-line if needed)
    let tempY = rowY
    splittedName.forEach((txt) => {
      doc.text(txt, colDescX, tempY)
      tempY += 4
    })

    // Print quantity and prices on the first line; SKU column removed
    doc.text(String(line.quantity), colQtyX, rowY, { align: 'center' })
    doc.text(unitPrice, colUnitPriceX, rowY, { align: 'right' })
    doc.text(lineTotal, colTotalX, rowY, { align: 'right' })

    // The next row starts where the largest multi-line block ended
    const lineHeightUsed = Math.max(tempY - rowY, 4) // at least 4 if name is short
    currentY += lineHeightUsed + 2

    drawHorizontalLine(20, currentY, 190)
  })

  currentY += 8

  // ----------------------
  // DETALLES DE PAGO & TOTALS
  // ----------------------
  const sectionY = currentY

  // Left side: Detalles de pago
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(primaryPurple)
  doc.text('DETALLES DE PAGO', 20, sectionY)

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
    sectionY + 7
  )
  doc.text(
    `Restan: ${priceFormatter(partialRemaining, order.currencyCode)}`,
    20,
    sectionY + 13
  )

  // Right side: Totals
  const rightLabelX = 140
  const rightValueX = 188

  doc.text('Subtotal:', rightLabelX, sectionY)
  doc.text(
    priceFormatter(order.subTotalWithTax, order.currencyCode),
    rightValueX,
    sectionY,
    { align: 'right' }
  )

  doc.text('Descuento:', rightLabelX, sectionY + 7)
  const totalDiscount =
    order.discounts?.reduce((acc, d) => acc + d.amountWithTax, 0) || 0
  doc.text(
    priceFormatter(totalDiscount, order.currencyCode),
    rightValueX,
    sectionY + 7,
    { align: 'right' }
  )

  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', rightLabelX, sectionY + 13)
  doc.text(
    priceFormatter(order.totalWithTax, order.currencyCode),
    rightValueX,
    sectionY + 13,
    { align: 'right' }
  )

  doc.setFont('helvetica', 'normal')

  currentY = sectionY + 25

  // (Comentarios section removed)

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
    '0412 3761604 | @nixstore.ve | Maracay, edo. Aragua',
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
