import Image from 'next/image'

import { H2 } from '../../headings'
import { Button } from '../../button'
import { RiArrowRightLine } from '@remixicon/react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/libs/utils'
const sectionVariants = cva(
  'flex flex-col items-center gap-12 px-4 pt-12 pb-32 md:items-start md:px-12 md:py-24 lg:px-36 lg:py-32',
  {
    variants: {
      variant: {
        default: 'bg-background',
        dark: 'bg-dark text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {}
export const Section = ({
  children,
  title,
  variant,
  className,
}: SectionProps) => {
  const textStyle =
    variant === 'dark' ? 'bg-dark-text-gradient' : 'bg-text-gradient'
  return (
    <section className={cn(sectionVariants({ variant }), className)}>
      <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center justify-center md:justify-start md:gap-2">
          <Image
            src={`/assets/${variant === 'dark' ? 'decoration-dark.svg' : 'decoration.svg'}`}
            width={32}
            height={32}
            alt="Nix Logo"
            className="scale-75 md:scale-100"
          />
          <H2
            className={`bg-clip-text text-transparent ${textStyle} text-center md:text-left`}
          >
            {title}
          </H2>
          <Image
            src={`/assets/${variant === 'dark' ? 'decoration-dark.svg' : 'decoration.svg'}`}
            width={32}
            height={32}
            alt="Nix Logo"
            className="scale-75 md:hidden md:scale-100"
          />
        </div>
        <Button variant="outline" className="w-auto" size={'lg'}>
          Ver más <RiArrowRightLine className="ml-2 h-5 w-5" />
        </Button>
      </div>
      {children}
    </section>
  )
}
