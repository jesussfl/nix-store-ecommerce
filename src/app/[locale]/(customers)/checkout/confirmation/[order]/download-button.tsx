'use client'

import { Button } from '@/components/shared/button'
import { generateReceipt } from '@/app/actions/generate-receipt'

const DownloadReceipt = ({ orderCode }: { orderCode: string }) => {
  const downloadReceipt = async () => {
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
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  return (
    <Button onClick={downloadReceipt} className="mt-4">
      Descargar Recibo
    </Button>
  )
}

export default DownloadReceipt
