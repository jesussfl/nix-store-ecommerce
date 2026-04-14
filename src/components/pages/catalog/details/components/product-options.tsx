import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group'
import { Label } from '@/components/shared/label/label'
import { cn } from '@/libs/utils'
import { ProductOption } from '../hooks/use-product-details'

interface OptionLabelProps {
  option: ProductOption
  group: { code: string; id: string }
  isSelected: boolean
  isDisabled: boolean
}

export const OptionLabel = ({
  option,
  group,
  isSelected,
  isDisabled,
}: OptionLabelProps) => (
  <div key={option.id}>
    <RadioGroupItem
      value={option.id}
      id={`${group.code}-${option.id}`}
      className="sr-only"
      disabled={isDisabled}
    />
    <Label
      htmlFor={`${group.code}-${option.id}`}
      className={cn(
        'inline-flex min-h-10 min-w-[3.75rem] items-center justify-center rounded-full border px-3 py-2 text-[13px] font-medium transition-colors sm:min-h-11 sm:min-w-[4.5rem] sm:px-4 sm:text-sm',
        isSelected
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50',
        isDisabled &&
          'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60'
      )}
    >
      {option.name}
    </Label>
  </div>
)

interface ProductOptionGroup {
  code: string
  id: string
  name: string
  options: ProductOption[]
}

export interface ProductOptionsProps {
  optionGroups: ProductOptionGroup[]
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
  <div className="space-y-4 sm:space-y-5">
    {optionGroups.map((group, groupIndex) => {
      const availableOptions = getAvailableOptions(group.id)
      const isFirstGroup = groupIndex === 0

      return (
        <div key={group.id} className="space-y-2.5 sm:space-y-3">
          <p className="text-sm font-semibold text-slate-900">{group.name}:</p>
          <RadioGroup
            value={selectedOptions[group.id] || ''}
            onValueChange={(value) => handleOptionChange(group.id, value)}
            className="flex flex-wrap gap-1.5 sm:gap-2"
          >
            {group.options.map((option) => (
              <OptionLabel
                key={option.id}
                option={option}
                group={group}
                isSelected={selectedOptions[group.id] === option.id}
                isDisabled={!availableOptions.has(option.id) && !isFirstGroup}
              />
            ))}
          </RadioGroup>
        </div>
      )
    })}
  </div>
)
