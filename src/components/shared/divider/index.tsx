import { cn } from '@/libs/utils'

export const VerticalDivider = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('h-full w-[2px]', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(217, 217, 217, 0.00) 0%, rgba(202, 202, 202, 0.50) 54%, rgba(202, 202, 202, 0.00) 100%)',
      }}
    />
  )
}

export const HorizontalDivider = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('h-[2px] w-full', className)}
      style={{
        background:
          'linear-gradient(90deg, rgba(217, 217, 217, 0.00) 0%, rgba(202, 202, 202, 0.50) 54%, rgba(202, 202, 202, 0.00) 100%)',
      }}
    />
  )
}
