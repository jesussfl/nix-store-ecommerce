import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import { ProductOption } from '../hooks/use-product-details'

interface OptionLabelProps {
  option: ProductOption
  group: { code: string; id: string }
  isSelected: boolean
  isAvailable: boolean
  index: number
}

export const OptionLabel = ({
  option,
  group,
  isSelected,
  isAvailable,
  index,
}: OptionLabelProps) => (
  <div key={option.id}>
    <RadioGroupItem
      value={option.id}
      id={`${group.code}-${option.id}`}
      className="sr-only"
      disabled={!isAvailable && index !== 0}
    />
    <Label
      htmlFor={`${group.code}-${option.id}`}
      className={`cursor-pointer rounded-md border px-4 py-2 ${
        isSelected ? 'border-purple-500 bg-purple-100' : 'hover:bg-gray-100'
      } ${!isAvailable && index !== 0 ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {option.name}
    </Label>
  </div>
)

export interface ProductOptionsProps {
  optionGroups: any[]
  selectedOptions: Record<string, string>
  getAvailableOptions: (groupId: string) => Set<string>
  handleOptionChange: (groupId: string, optionId: string) => void
}

export const ProductOptions = ({
  optionGroups,
  selectedOptions,
  getAvailableOptions,
  handleOptionChange,
}: ProductOptionsProps) => (
  <div className="space-y-4">
    {optionGroups.map((group, index) => {
      const availableOptions = getAvailableOptions(group.id)
      return (
        <div key={group.id} className="space-y-2">
          <p className="text-sm font-semibold">{group.name}:</p>
          <RadioGroup
            value={selectedOptions[group.id] || ''}
            onValueChange={(value) => handleOptionChange(group.id, value)}
            className="flex flex-wrap gap-2"
          >
            {group.options.map((option: ProductOption) => (
              <OptionLabel
                key={option.id}
                option={option}
                group={group}
                isSelected={selectedOptions[group.id] === option.id}
                isAvailable={availableOptions.has(option.id)}
                index={index}
              />
            ))}
          </RadioGroup>
        </div>
      )
    })}
  </div>
)
