'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useCallback } from 'react'
import { ImageOff, RefreshCw } from 'lucide-react'
import { cn } from '@/libs/utils'

type ImageWithFallbackProps = Omit<ImageProps, 'onError'> & {
  fallbackClassName?: string
  /** Set to false to hide the retry button (e.g. inside a Link-wrapped card) */
  showRetry?: boolean
}

/**
 * A Next/Image wrapper that shows a gray placeholder when the image fails to
 * load, with a manual retry button – preventing the browser from hammering a
 * broken URL in an infinite loop.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  showRetry = true,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  const handleError = useCallback(() => {
    setError(true)
  }, [])

  const handleRetry = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      setError(false)
      setRetryKey((k) => k + 1)
    },
    []
  )

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400',
          fallbackClassName ?? className
        )}
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        {showRetry && (
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-500 shadow-sm transition hover:bg-gray-50 active:scale-95"
            aria-label="Reintentar cargar imagen"
          >
            <RefreshCw className="h-3 w-3" />
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return (
    <Image
      key={retryKey}
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  )
}
