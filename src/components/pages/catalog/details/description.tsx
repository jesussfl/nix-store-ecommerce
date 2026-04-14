'use client'
import { useId, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DescriptionProps {
  content: string
}

export function Description({ content }: DescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const contentId = useId()

  return (
    <div className="w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left font-medium text-slate-900"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="text-base font-semibold">Descripción</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      <div
        id={contentId}
        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        <div
          className="pt-3 text-sm leading-7 text-slate-600 lg:text-[0.95rem] [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}
