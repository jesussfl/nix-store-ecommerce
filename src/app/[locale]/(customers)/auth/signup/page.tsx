import Image from 'next/image'
import AuthForm from './auth-form'
import H1 from '@/components/shared/headings'
import Link from 'next/link'

export default function AuthPage() {
  return (
    <div className="w-full">
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
        <H1 className="text-center">Acceso a Nix Store</H1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
