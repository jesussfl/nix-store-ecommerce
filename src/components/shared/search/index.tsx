'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { RiSearchLine, RiCloseLine } from '@remixicon/react'
import { Input } from '../input/input'
import { cn } from '@/libs/utils'
import { Button } from '../button'
import { FormEvent, useState, useEffect } from 'react'

interface SearchProps {
  className?: string
  onSearchSubmit?: () => void
}

export default function Search({ className, onSearchSubmit }: SearchProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')

  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || '')
  }, [searchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      if (onSearchSubmit) onSearchSubmit()
    }
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(`relative w-full max-w-[550px]`, className)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex">
          <Input
            type="text"
            name="q"
            placeholder="Buscar productos..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[52px] rounded-r-none md:h-auto"
          />
          {searchQuery ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="rounded-none border-l-0"
            >
              <RiCloseLine className="h-5 w-5" />
            </Button>
          ) : null}
          <Button type="submit" className="h-[52px] rounded-l-none md:h-auto">
            <RiSearchLine className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground md:hidden">
          Encuentra los mejores productos aquí
        </p>
      </div>
    </form>
  )
}
