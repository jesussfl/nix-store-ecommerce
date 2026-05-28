'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/button'
import { generateReceipt } from '@/app/actions/generate-receipt'

const DownloadReceipt = ({ orderCode }: { orderCode: string }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const downloadReceipt = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const { pdfBuffer, fileName } = await generateReceipt(orderCode)
      const blob = new Blob([new Uint8Array(pdfBuffer)], {
        type: 'application/pdf',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      setErrorMessage(
        'No pudimos generar la nota de entrega. Intenta de nuevo.'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={downloadReceipt}
        disabled={isGenerating}
        className="mt-4"
      >
        {isGenerating ? 'Generando...' : 'Descargar Nota'}
      </Button>
      {errorMessage && (
        <p className="max-w-56 text-right text-xs text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default DownloadReceipt
