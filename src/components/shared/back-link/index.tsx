'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../button'
import { ArrowLeft } from 'lucide-react'

export const BackLink = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }
  return (
    <Button
      variant="secondary"
      size={'lg'}
      onClick={handleGoBack}
      //   className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Volver
    </Button>
  )
}
