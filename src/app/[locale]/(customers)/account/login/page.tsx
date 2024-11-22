import Image from 'next/image'
import AuthForm from './auth-form'
import H1 from '@/components/shared/headings'
import Link from 'next/link'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { redirect } from 'next/navigation'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'

export default async function AuthPage({
  searchParams,
}: {
  searchParams: {
    callback?: string
  }
}) {
  const { data } = await vendureFetchSSR({
    query: GET_ACTIVE_CUSTOMER,
  })

  if (data?.activeCustomer) {
    if (searchParams.callback) {
      redirect(searchParams.callback)
    }

    if (!searchParams.callback) {
      redirect('/')
    }
  }
  return (
    <div className="mt-24 w-full">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo/nix-logo-color-dark.svg"
            alt="Nix Logo"
            width={92}
            height={92}
            className="mx-auto"
          />
        </Link>
        <H1
          className={`bg-text-gradient bg-clip-text text-center text-transparent`}
        >
          Accede a Nix Store
        </H1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
