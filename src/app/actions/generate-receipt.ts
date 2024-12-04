'use server'

import { jsPDF } from 'jspdf'
import { vendureFetch } from '@/libs/vendure'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
const getAbsoluteUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001' // Replace with your app's base URL
  return new URL(path, baseUrl).toString()
}

const logoUrl = getAbsoluteUrl('/assets/logo/nix-logo.png')

// Helper function to fetch the image and convert it to Base64
async function getImageAsBase64(relativePath) {
  const absoluteUrl = getAbsoluteUrl(relativePath)
  console.log('absoluteUrl', absoluteUrl)
  const response = await fetch(absoluteUrl)
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  const buffer = await response.arrayBuffer()
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
}

// Update your function to load the image and add it
export async function generateReceipt(orderCode) {
  const { data, error } = await vendureFetch({
    query: GET_ORDER_BY_CODE,
    variables: { code: orderCode },
  })

  if (error || !data?.orderByCode) {
    throw new Error('Pedido no encontrado')
  }

  const order = data.orderByCode
  const primaryColor = '#641ec8'
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })
  function drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    doc.setFillColor(color)
    doc.rect(x, y, width, height, 'F') // 'F' is for filled rectangles in jsPDF
  }
  // Add header background
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, 210, 40, 'F')

  // Add logo
  const logoX = 10,
    logoY = 5,
    logoWidth = 40,
    logoHeight = 30

  const logoBase64 = await getImageAsBase64(logoUrl)
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight)

  // Add company details
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('Nix Store', 50, 20)
  doc.setFontSize(10)
  doc.text('nixstore.mcy@gmail.com', 50, 25)
  doc.text('@nixstore.mcy', 50, 30)
  doc.text('+58 412-3761604', 50, 35)

  // Reset text color and continue your existing logic...
  doc.setTextColor(0, 0, 0)
  // Add receipt details
  doc.setFontSize(12)
  doc.text(`Número de Pedido: ${order.code}`, 20, 55)
  doc.text(
    `Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES')}`,
    20,
    60
  )

  // Customer details
  doc.setFontSize(14)
  doc.text('Detalles del Cliente:', 20, 70)
  doc.setFontSize(12)
  doc.text(`${order.customer.firstName} ${order.customer.lastName}`, 20, 75)
  doc.text(`Email: ${order.customer.emailAddress}`, 20, 80)
  if (order.customer.phoneNumber) {
    doc.text(`Teléfono: ${order.customer.phoneNumber}`, 20, 85)
  }

  // Order items header
  let yPos = 95
  drawRect(20, yPos, 170, 8, primaryColor)
  doc.setTextColor(255, 255, 255)
  doc.text('Producto', 25, yPos + 6)
  doc.text('Cantidad', 100, yPos + 6)
  doc.text('Precio', 130, yPos + 6)
  doc.text('Total', 160, yPos + 6)

  // Reset text color to black
  doc.setTextColor(0, 0, 0)
  yPos += 15

  // Order items
  order.lines.forEach((line) => {
    doc.text(line.productVariant.name, 25, yPos)
    doc.text(line.quantity.toString(), 105, yPos)
    doc.text(
      (line.unitPriceWithTax / 100).toLocaleString('es-ES', {
        style: 'currency',
        currency: order.currencyCode,
      }),
      130,
      yPos
    )
    doc.text(
      (line.linePriceWithTax / 100).toLocaleString('es-ES', {
        style: 'currency',
        currency: order.currencyCode,
      }),
      160,
      yPos
    )
    yPos += 8
  })

  yPos += 10

  // Totals
  doc.text('Subtotal:', 130, yPos)
  doc.text(
    (order.subTotalWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    160,
    yPos
  )
  yPos += 8

  doc.text('Envío:', 130, yPos)
  doc.text(
    (order.shippingWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    160,
    yPos
  )
  yPos += 8

  if (order.discounts.length > 0) {
    const totalDiscount = order.discounts.reduce(
      (acc, d) => acc + d.amountWithTax,
      0
    )
    doc.text('Descuentos:', 130, yPos)
    doc.text(
      `-${(totalDiscount / 100).toLocaleString('es-ES', {
        style: 'currency',
        currency: order.currencyCode,
      })}`,
      160,
      yPos
    )
    yPos += 8
  }

  // Final total with colored background
  drawRect(120, yPos - 4, 70, 10, primaryColor)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('Total:', 130, yPos + 3)
  doc.text(
    (order.totalWithTax / 100).toLocaleString('es-ES', {
      style: 'currency',
      currency: order.currencyCode,
    }),
    160,
    yPos + 3
  )

  // Footer
  doc.setTextColor(128, 128, 128)
  doc.setFontSize(10)
  const footerText = '¡Gracias por tu compra!'
  doc.text(footerText, 105, 280, { align: 'center' })

  const pdfBuffer = doc.output('arraybuffer')

  return {
    pdfBuffer: Array.from(new Uint8Array(pdfBuffer)),
    fileName: `recibo-pedido-${order.code}.pdf`,
  }
}
