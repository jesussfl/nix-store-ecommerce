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
import Link from 'next/link'
import { buttonVariants } from '@/components/shared/button'
import { cn } from '@/libs/utils'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
import DownloadReceipt from './download-button'
import { priceFormatter } from '@/utils/price-formatter'
import RefreshCart from './refresh-cart'
import { RiWhatsappLine } from '@remixicon/react'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ order: string }>
}) {
  const resolvedParams = await params
  // Fetch order from Vendure
  const { data, error } = await vendureFetchSSR({
    query: GET_ORDER_BY_CODE,
    variables: {
      code: resolvedParams.order,
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
  const orderCustomFields = (
    order as {
      customFields?: {
        lote?: {
          name?: string
          description?: string
        }
      }
    }
  ).customFields
  const loteName = orderCustomFields?.lote?.name ?? ''
  const loteDescription = orderCustomFields?.lote?.description ?? ''

  // Calculate paid vs. remaining
  const partialPaid =
    order.payments?.reduce((total, p) => total + p.amount, 0) ?? 0
  const partialRemaining = order.totalWithTax - partialPaid

  return (
    <div className="container mx-auto px-4 py-8">
      <RefreshCart />
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
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
          >
            Ir al Inicio
          </Link>
          <Link
            href="/catalog"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Seguir Comprando
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalles de Envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                Estamos procesando tu pedido. Si tienes alguna duda, no dudes en
                contactarnos a nuestro WhatsApp:
              </p>

              <p className="mt-2 font-medium">Detalles importantes:</p>

              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  Te contactaremos al número proporcionado una vez tu pedido
                  haya sido confirmado.
                </li>
                <li>
                  Si es un producto en disponibilidad inmediata, se coordinará
                  la forma de entrega.
                </li>
                <li>
                  Si es un producto por encargo, puedes hacer seguimiento de tu
                  pedido a través de nuestro WhatsApp.
                </li>
              </ul>
              <p>
                <Link
                  href="https://wa.me/+584123761604"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-button-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(100,30,200,0.22)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <RiWhatsappLine className="h-5 w-5" />
                  Whatsapp
                </Link>
              </p>
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
                      {priceFormatter(
                        line.linePriceWithTax,
                        order.currencyCode
                      )}
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
                    {priceFormatter(order.subTotalWithTax, order.currencyCode)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {priceFormatter(order.shippingWithTax, order.currencyCode)}
                  </span>
                </div>
                {order.discounts.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuentos</span>
                    <span>
                      -
                      {priceFormatter(
                        order.discounts.reduce(
                          (acc, d) => acc + d.amountWithTax,
                          0
                        ),
                        order.currencyCode
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {priceFormatter(order.totalWithTax, order.currencyCode)}
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
                        {priceFormatter(partialPaid, order.currencyCode)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Restan</span>
                      <span>
                        {priceFormatter(partialRemaining, order.currencyCode)}
                      </span>
                    </div>
                  </div>
                </>
              )}
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
