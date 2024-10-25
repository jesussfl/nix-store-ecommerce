'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { RiSearchLine, RiCloseLine } from '@remixicon/react'
import { Input } from '@/components/shared/input/input'
import { cn } from '@/libs/utils'
import { Button } from '@/components/shared/button'
import { FormEvent, useState, useEffect, useCallback, useRef } from 'react'
import { GET_SEARCH_SUGGESTIONS } from '@/libs/queries/products'
import { vendureFetch } from '@/libs/vendure'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/shared/command/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shared/popover/popover'
import debounce from 'lodash.debounce'

interface SearchProps {
  className?: string
  onSearchSubmit?: () => void
}

interface Product {
  productName: string
}

export default function Search({ className, onSearchSubmit }: SearchProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || '')
  }, [searchParams])

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true)

    try {
      const response = await vendureFetch({
        query: GET_SEARCH_SUGGESTIONS,
        variables: {
          input: {
            term: query,
            take: 10,
            groupByProduct: true,
          },
        },
      })
      setSuggestions(response.data?.search.items || [])
      setOpen(true)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        fetchSuggestions(query.trim())
      } else {
        setSuggestions([])
        setOpen(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedFetchSuggestions(searchQuery)
    return () => {
      debouncedFetchSuggestions.cancel()
    }
  }, [searchQuery, debouncedFetchSuggestions])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      if (onSearchSubmit) onSearchSubmit()
      setOpen(false)
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    setSuggestions([])
    setOpen(false)
    router.push('/catalog?q=')
  }

  const handleSelect = (selectedItem: string) => {
    setSearchQuery(selectedItem)
    router.push(`/catalog?q=${encodeURIComponent(selectedItem.trim())}`)
    if (onSearchSubmit) onSearchSubmit()
    setOpen(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(`relative w-full max-w-[550px]`, className)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-[52px] rounded-r-none md:h-auto"
                  // ref={inputRef}
                  onFocus={() => setOpen(true)}
                  // onBlur={onInputBlur}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="PopoverContent p-0"
              align="start"
              sideOffset={5}
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup heading="Sugerencias">
                    {suggestions.map((item, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSelect(item.productName)}
                      >
                        {item.productName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {searchQuery ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-[52px] rounded-none md:h-auto"
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
