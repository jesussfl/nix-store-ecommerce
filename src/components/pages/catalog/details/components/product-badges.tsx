import { Badge } from '@/components/shared/badge'

export interface ProductBadgesProps {
  facets: string[]
}

export const ProductBadges = ({ facets }: ProductBadgesProps) => (
  <div className="flex flex-wrap items-center gap-2">
    {facets.length === 0 && (
      <Badge variant="default" className="text-xs">
        Por encargo
      </Badge>
    )}
    {facets?.map((facet) => (
      <Badge key={facet} variant="default" className="text-xs">
        {facet}
      </Badge>
    ))}
    {/* <Button variant="secondary" size="icon">
      <Share2 className="h-4 w-4" />
    </Button> */}
  </div>
)
