'use client'

import { Button } from '@/components/shared/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/dropdown-menu/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortBy() {
  const t = useTranslations('catalog.filters.sort')
  const router = useRouter()
  const searchParams = useSearchParams()

  const sortOptions = [
    { label: t('relevance'), value: '' },
    { label: t('priceLowToHigh'), value: 'price-asc' },
    { label: t('priceHighToLow'), value: 'price-desc' },
    { label: t('nameAToZ'), value: 'name-asc' },
    { label: t('nameZToA'), value: 'name-desc' },
  ]

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
    t('placeholder')

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
