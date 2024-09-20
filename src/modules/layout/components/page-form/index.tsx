import { buttonVariants } from '@/components/shared/button'

import {
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type PageFormProps = {
  children: React.ReactNode
  title: string
  backLink: string
}

export default async function PageForm({
  children,
  title,
  backLink,
}: PageFormProps) {
  return (
    <>
      <PageHeader className="justify-start gap-8">
        <Link
          href={backLink}
          className={buttonVariants({ variant: 'outline' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
        <PageHeaderTitle>{title}</PageHeaderTitle>
      </PageHeader>
      <PageContent className="space-y-4 pt-5 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        {children}
      </PageContent>
    </>
  )
}
