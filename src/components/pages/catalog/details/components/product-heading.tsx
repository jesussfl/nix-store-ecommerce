import H1 from '@/components/shared/headings'
import { Variant } from '../hooks/use-product-details'

export interface ProductHeadingProps {
  productName: string
  currentVariant: Variant
}

export const ProductHeading = ({
  productName,
  currentVariant,
}: ProductHeadingProps) => {
  const stockLevels: Record<string, string> = {
    OUT_OF_STOCK: 'Agotado',
    LOW_STOCK: 'Pocas unidades',
    NOT_SPECIFIED: 'No especificado',
    IN_STOCK: 'Disponible',
  }

  return (
    <div className="space-y-2">
      <H1 className="text-base font-semibold lg:text-xl lg:font-semibold">
        {productName}
      </H1>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-medium text-primary">
          ${(currentVariant.priceWithTax / 100).toFixed(2)}{' '}
          {currentVariant.currencyCode}
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          Estado del producto:{' '}
          <span className="font-semibold text-gray-800">
            {currentVariant.stockLevel
              ? stockLevels[currentVariant.stockLevel]
              : 'No disponible'}
          </span>
        </p>
      </div>
    </div>
  )
}
