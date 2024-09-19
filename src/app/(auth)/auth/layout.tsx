import Image from 'next/image'
import Ceserlodai from '@public/imagen_principal.jpg'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col-reverse bg-gray-50 p-4 md:p-5 lg:max-h-screen lg:min-h-screen lg:flex-row lg:p-8">
      <div className="relative flex w-[100px] flex-1 rounded-md">
        {/* <Image
          fill={true}
          style={{ objectFit: 'cover' }}
          src={Ceserlodai}
          alt="background"
          className="rounded-lg"
        /> */}
        <div className="absolute left-4 top-4 rounded-lg bg-white p-3">
          <span className="tex-sm self-center whitespace-nowrap px-3 font-extrabold text-blue-700 dark:text-blue-700 md:text-2xl">
            SIGECAI
          </span>
        </div>
      </div>
      <div className="flex lg:flex-1">{children}</div>
    </div>
  )
}
