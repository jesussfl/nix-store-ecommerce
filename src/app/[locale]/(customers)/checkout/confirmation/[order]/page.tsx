import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import { Separator } from '@/components/shared/separator/separator'
import { CheckCircle2, Package, Truck, User, MapPin } from 'lucide-react'
import Image from 'next/image'
import { vendureFetch } from '@/libs/vendure'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
import DownloadReceipt from './download-button'

export default async function ConfirmationPage({
  params,
}: {
  params: { order: string }
}) {
  // Fetch order from Vendure
  const { data, error } = await vendureFetch({
    query: GET_ORDER_BY_CODE,
    variables: {
      code: params.order,
    },
  })

  const order = data?.orderByCode

  // Show error state if order not found
  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <CheckCircle2 className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-red-600 dark:text-red-400">
            ¡Ha ocurrido un error!
          </h1>
          <p className="mt-2 text-muted-foreground">
            No hemos podido encontrar tu pedido.
          </p>
        </div>
      </div>
    )
  }

  // Extract "lote" info for "Plazo de llegada"
  const loteName = order.customFields?.lote?.name ?? ''
  const loteDescription = order.customFields?.lote?.description ?? ''

  // Calculate paid vs. remaining
  const partialPaid =
    order.payments?.reduce((total, p) => total + p.amount, 0) ?? 0
  const partialRemaining = order.totalWithTax - partialPaid

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Banner */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">
          ¡Se ha enviado tu pedido con éxito!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Número de pedido: <span className="font-medium">{order.code}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Detalles del Cliente */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalles del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customer?.emailAddress}
              </p>
              {order.customer?.phoneNumber && (
                <p className="text-sm text-muted-foreground">
                  {order.customer?.phoneNumber}
                </p>
              )}
              {order.shippingAddress && (
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.streetLine1 || ''} <br />
                  {order.shippingAddress.streetLine2 || ''} <br />
                  {order.shippingAddress.city || ''},{' '}
                  {order.shippingAddress.province || ''}{' '}
                  {order.shippingAddress.postalCode || ''}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plazo de Llegada */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Plazo de Llegada
            </CardTitle>
            {loteName && (
              <CardDescription>
                <span className="text-sm font-medium">{loteName}</span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loteDescription && (
                <p className="text-sm text-muted-foreground">
                  {loteDescription}
                </p>
              )}
              {/* <p className="text-xs text-muted-foreground">
                De cuatro a seis semanas aprox. (de mediados a finales de
                octubre).
              </p> */}
            </div>
          </CardContent>
        </Card>

        {/* Detalles de Envío */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalles de Envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.shippingLines.map((line) => (
                <div key={line.shippingMethod.id}>
                  <p className="font-medium">{line.shippingMethod.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {line.shippingMethod.description}
                  </p>
                  <p className="mt-1 font-medium">
                    {(line.priceWithTax / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: order.currencyCode,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Pedido */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ordered Items */}
              {order.lines.map((line) => (
                <div key={line.id} className="flex items-start gap-4">
                  {line.featuredAsset && (
                    <Image
                      width={64}
                      height={64}
                      src={line.featuredAsset.preview}
                      alt={line.productVariant.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{line.productVariant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {line.quantity}
                    </p>
                    <p className="mt-1 font-medium">
                      {(line.linePriceWithTax / 100).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: order.currencyCode,
                      })}
                    </p>
                  </div>
                </div>
              ))}

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {(order.subTotalWithTax / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: order.currencyCode,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {(order.shippingWithTax / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: order.currencyCode,
                    })}
                  </span>
                </div>
                {order.discounts.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuentos</span>
                    <span>
                      -
                      {(
                        order.discounts.reduce(
                          (acc, d) => acc + d.amountWithTax,
                          0
                        ) / 100
                      ).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: order.currencyCode,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {(order.totalWithTax / 100).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: order.currencyCode,
                    })}
                  </span>
                </div>
              </div>

              {/* Abonado / Restan (if there's any payment) */}
              {partialPaid > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abonado</span>
                      <span>
                        {(partialPaid / 100).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: order.currencyCode,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Restan</span>
                      <span>
                        {(partialRemaining / 100).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: order.currencyCode,
                        })}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Separator className="my-4" />

            {/* Comentarios, matching PDF disclaimers */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                El plazo de llegada ha sido ajustado como resultado de los
                recientes cambios en los procesos aduaneros y está sujeto a
                modificaciones por factores externos que escapan a nuestro
                control.
              </p>
              <p>
                La nota de entrega puede sufrir modificaciones en caso de que se
                añadan nuevos productos, se realicen pagos al saldo pendiente
                (si lo hay) o ante cualquier otro cambio.
              </p>
            </div>

            <Separator className="my-4" />

            {/* PDF Download Button */}
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Para ver o imprimir tu orden de compra, descarga la{' '}
                <strong>Nota de Entrega</strong> en PDF:
              </p>
              <DownloadReceipt orderCode={order.code} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
