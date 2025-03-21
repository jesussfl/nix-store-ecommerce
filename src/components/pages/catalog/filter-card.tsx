'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card'
import { Checkbox } from '@/components/shared/checkbox/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/accordion'
import { SearchProductsQuery } from '@/graphql/graphql'
import { cn } from '@/libs/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { Button } from '@/components/shared/button'
import { FilterIcon, X } from 'lucide-react'
import SortBy from './sort-by'

export const Filters = ({
  children,
  results,
}: {
  children?: React.ReactNode
  results: SearchProductsQuery['search']['facetValues']
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeFilters, setActiveFilters] = useState<
    Record<string, { id: string; name: string }[]>
  >({})

  useEffect(() => {
    const newActiveFilters: Record<string, { id: string; name: string }[]> = {}
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'sort' && key !== 'q') {
        newActiveFilters[key] = value.split(',').map((id) => {
          const facet = results.find((f) => f.facetValue.id === id)
          return { id, name: facet ? facet.facetValue.name : id }
        })
      }
    })
    setActiveFilters(newActiveFilters)
  }, [searchParams, results])

  const updateUrlParams = (
    facetKey: string,
    facetId: string,
    facetName: string
  ) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    const existingFacet = currentParams.get(facetKey)

    if (existingFacet) {
      const facetValues = existingFacet.split(',')
      if (facetValues.includes(facetId)) {
        const updatedFacetValues = facetValues.filter((val) => val !== facetId)
        if (updatedFacetValues.length === 0) {
          currentParams.delete(facetKey)
        } else {
          currentParams.set(facetKey, updatedFacetValues.join(','))
        }
      } else {
        currentParams.set(facetKey, [...facetValues, facetId].join(','))
      }
    } else {
      currentParams.set(facetKey, facetId)
    }

    currentParams.set('page', '1')
    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const removeFilter = (facetKey: string, facetId: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    const existingFacet = currentParams.get(facetKey)

    if (existingFacet) {
      const facetValues = existingFacet.split(',')
      const updatedFacetValues = facetValues.filter((val) => val !== facetId)
      if (updatedFacetValues.length === 0) {
        currentParams.delete(facetKey)
      } else {
        currentParams.set(facetKey, updatedFacetValues.join(','))
      }
    }

    currentParams.set('page', '1')
    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(`${pathname}?page=1`)
  }

  const groupedFilters = results.reduce(
    (acc, f) => {
      const facetName = f.facetValue.facet.name
      if (!acc[facetName]) {
        acc[facetName] = []
      }
      acc[facetName].push(f)
      return acc
    },
    {} as Record<string, typeof results>
  )

  const FilterContent = () => (
    <>
      {Object.keys(activeFilters).length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map(({ id, name }) => (
                <Button
                  key={`${key}-${id}`}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeFilter(key, id)}
                  className="flex items-center gap-1"
                >
                  {name}
                  <X className="h-3 w-3" />
                </Button>
              ))
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="mt-2"
          >
            Limpiar todos los filtros
          </Button>
        </div>
      )}

      <FilterCard>
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedFilters).map(([facetName, facetValues]) => (
            <AccordionItem value={facetName} key={facetName}>
              <AccordionTrigger className="text-sm font-medium">
                {facetName}
              </AccordionTrigger>
              <AccordionContent>
                {facetValues.map((f) => (
                  <div
                    key={f.facetValue.id}
                    className="flex items-center gap-2 py-1"
                  >
                    <Checkbox
                      checked={activeFilters[f.facetValue.facet.name]?.some(
                        (filter) => filter.id === f.facetValue.id
                      )}
                      onClick={() =>
                        updateUrlParams(
                          f.facetValue.facet.name,
                          f.facetValue.id,
                          f.facetValue.name
                        )
                      }
                    />
                    <p className="text-xs font-medium">
                      {f.facetValue.name} ({f.count})
                    </p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <SortBy />
      </FilterCard>

      {children}
    </>
  )

  return (
    <>
      <aside className="sticky left-0 top-40 hidden min-w-[220px] flex-col gap-4 md:flex md:w-[15%]">
        <FilterContent />
      </aside>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="mb-4 ml-4">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export const FilterCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <Card className={cn(`p-0 shadow-none`, className)}>
      <CardHeader>
        <CardTitle className="text-base text-foreground">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  )
}
