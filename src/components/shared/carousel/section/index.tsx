import Image from 'next/image'

import { H2 } from '../../headings'
import { Button } from '../../button'
import { RiArrowRightLine } from '@remixicon/react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/libs/utils'
const sectionVariants = cva(
  'flex flex-col items-center justify-center gap-12 pt-12 pb-32 md:py-24 md:mt-16 lg:py-24 relative left-1/2 -translate-x-1/2 w-screen',
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
  link,
  centered = false,
  description,
}: SectionProps & {
  link?: string
  centered?: boolean
  description?: string
}) => {
  const textStyle =
    variant === 'dark' ? 'bg-dark-text-gradient' : 'bg-text-gradient'
  return (
    <section className={cn(sectionVariants({ variant }), className)}>
      <div className="w-full max-w-[90rem] space-y-8 px-2 md:px-8">
        <div
          className={`flex w-full flex-col items-center justify-center gap-4 md:flex-row ${centered ? '' : 'md:justify-between'}`}
        >
          <div className={`flex items-center justify-center md:gap-2`}>
            <Image
              src={`/assets/${variant === 'dark' ? 'decoration-dark.svg' : 'decoration.svg'}`}
              width={32}
              height={32}
              alt="Nix Logo"
              className={`${centered ? 'md:hidden' : ''} hidden scale-50 md:block md:scale-75`}
            />
            <div className="flex flex-col items-center justify-center">
              <H2
                className={`bg-clip-text text-center text-transparent ${textStyle} ${centered ? 'md:text-center' : 'md:text-left'} `}
              >
                {title}
              </H2>
              <p className={`${centered ? 'text-center' : ''} text-base`}>
                {description}
              </p>
            </div>
            <Image
              src={`/assets/${variant === 'dark' ? 'decoration-dark.svg' : 'decoration.svg'}`}
              width={32}
              height={32}
              alt="Nix Logo"
              className="hidden scale-50 md:hidden"
            />
          </div>
          {!link ? null : (
            <Button variant="link" className="w-auto" size={'sm'}>
              Ver más <RiArrowRightLine className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
