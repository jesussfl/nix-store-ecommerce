'use client'
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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/shared/sheet'
import { Button } from '@/components/shared/button'
import { FilterIcon, X } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  )

  useEffect(() => {
    const newActiveFilters: Record<string, string[]> = {}
    searchParams.forEach((value, key) => {
      newActiveFilters[key] = value.split(',')
    })
    setActiveFilters(newActiveFilters)
  }, [searchParams])

  const updateUrlParams = (facetKey: string, facetValue: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    const existingFacet = currentParams.get(facetKey)

    if (existingFacet) {
      const facetValues = existingFacet.split(',')
      if (facetValues.includes(facetValue)) {
        const updatedFacetValues = facetValues.filter(
          (val) => val !== facetValue
        )
        if (updatedFacetValues.length === 0) {
          currentParams.delete(facetKey)
        } else {
          currentParams.set(facetKey, updatedFacetValues.join(','))
        }
      } else {
        currentParams.set(facetKey, [...facetValues, facetValue].join(','))
      }
    } else {
      currentParams.set(facetKey, facetValue)
    }

    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const removeFilter = (facetKey: string, facetValue: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    const existingFacet = currentParams.get(facetKey)

    if (existingFacet) {
      const facetValues = existingFacet.split(',')
      const updatedFacetValues = facetValues.filter((val) => val !== facetValue)
      if (updatedFacetValues.length === 0) {
        currentParams.delete(facetKey)
      } else {
        currentParams.set(facetKey, updatedFacetValues.join(','))
      }
    }

    router.push(`${pathname}?${currentParams.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
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
          <h3 className="mb-2 text-sm font-semibold">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((value) => (
                <Button
                  key={`${key}-${value}`}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeFilter(key, value)}
                  className="flex items-center gap-1"
                >
                  {value}
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
            Clear All Filters
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
                      checked={activeFilters[f.facetValue.facet.name]?.includes(
                        f.facetValue.id
                      )}
                      onClick={() =>
                        updateUrlParams(
                          f.facetValue.facet.name,
                          f.facetValue.id
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
