import { Badge } from '@/components/shared/badge'

export interface ProductBadgesProps {
  facets: string[]
}

export const ProductBadges = ({ facets }: ProductBadgesProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {facets.length === 0 && (
      <Badge variant="default" className="rounded-full px-3 py-1 text-xs">
        Por encargo
      </Badge>
    )}
    {facets?.map((facet) => (
      <Badge
        key={facet}
        variant="default"
        className="rounded-full px-3 py-1 text-xs"
      >
        {facet}
      </Badge>
    ))}
  </div>
)
