'use client'

import { Button } from '@/components/shared/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/dropdown-menu/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
]

export default function SortBy() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || ''

  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (sortValue) {
      params.set('sort', sortValue)
    } else {
      params.delete('sort')
    }
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ||
    'Sort By'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          {currentSortLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => handleSort(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
