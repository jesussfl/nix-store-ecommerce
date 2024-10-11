export const formatFacetValueFilters = (dynamicFacets: [any, any][]) => {
  dynamicFacets.flatMap(([facetKey, facetValues]) => {
    const valuesArray =
      typeof facetValues === 'string'
        ? facetValues.split(',')
        : facetValues || []
    return valuesArray.map((value: string) => ({
      and: value,
    }))
  })
}
