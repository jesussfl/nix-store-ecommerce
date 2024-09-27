import H1 from '@/components/shared/headings'

type CatalogHeadingsProps = {
  totalItems: number
}
export const CatalogHeadings = ({ totalItems }: CatalogHeadingsProps) => {
  return (
    <div className="my-12 flex flex-col items-center justify-center gap-2 px-6">
      <H1
        className={`bg-text-gradient bg-clip-text text-center text-transparent`}
      >
        {'Catálogo'}
      </H1>
      <p className="text-center text-base font-medium md:text-lg">{`Tenemos ${totalItems} productos disponibles para tí`}</p>
    </div>
  )
}
