import { buttonVariants } from '@/modules/common/components/button'
import { PackagePlus } from 'lucide-react'
import {
  HeaderLeftSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import Link from 'next/link'
import { auth } from '@/auth'
import { DataTable } from '@/modules/common/components/table/data-table'

export const metadata: Metadata = {
  title: 'Administrador',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}

export default async function Page() {
  const session = await auth()
  const isBasic = session?.user.rol_nombre === 'Básico'

  if (isBasic || !session?.user) {
    return (
      <PageTemplate className="flex h-[90vh] items-center justify-center">
        {' '}
        <div className="flex w-[600px] flex-col gap-4 text-center text-gray-700">
          <h1 className="text-4xl font-bold leading-[3rem]">
            Solo tienes permisos para registrar tu hora de entrada y salida.
          </h1>
          <p className="text-md leading-7 text-gray-500">
            Para acceder a otras secciones, solicita a un administrador los
            permisos correspondientes.
          </p>
          <Link
            href="/asistencias"
            className={buttonVariants({ variant: 'default' })}
          >
            Ir al control de Asistencias
          </Link>
        </div>
      </PageTemplate>
    )
  }

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Bienvenido, {session.user.nombre}
          </PageHeaderTitle>
          <PageHeaderDescription>
            {`Correo: ${session.user.email} | Rol: ${session.user.rol_nombre}`}
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>

      <PageContent>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Tus asistencias</CardTitle>
          </CardHeader>
          <CardContent>{/* @ts-ignore */}</CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-xl">Información Actual</CardTitle>
            </CardHeader>
            <CardContent>{/* @ts-ignore */}</CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-xl">Tu actividad reciente</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </PageContent>
    </>
  )
}
