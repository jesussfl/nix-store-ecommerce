import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import { Separator } from '@/components/shared/separator/separator'
import { CheckCircle2, Package, Truck, User } from 'lucide-react'
// import { formatDate } from '@/libs/utils'
import { vendureFetch } from '@/libs/vendure'
import { GET_ORDER_BY_CODE } from '@/libs/queries/order'
import { format } from 'date-fns'
import Image from 'next/image'

export default async function ConfirmationPage({
  params,
}: {
  params: { order: string }
}) {
  const { data, error } = await vendureFetch({
    query: GET_ORDER_BY_CODE,
    variables: {
      code: params.order,
    },
  })
  const order = data?.orderByCode

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

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
            </div>
          </CardContent>
        </Card>

        <Card>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
            {/* <CardDescription>
              Realizado el {format(order.createdAt, 'dd/MM/yyyy')}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
