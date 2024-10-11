'use client'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DescriptionProps {
  content: string
}

export function Description({ content }: DescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-lg border p-4">
      <button
        className="flex w-full items-center justify-between text-left font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Descripción</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isExpanded && <p className="mt-2 text-gray-600">{content}</p>}
    </div>
  )
}
