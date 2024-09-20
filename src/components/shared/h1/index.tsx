import { cn } from '@/libs/utils'

const H1 = async ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={cn(
        `text-center text-3xl font-bold text-dark-foreground md:text-left md:text-4xl lg:text-5xl lg:leading-[3.5rem]`,
        className
      )}
    >
      {children}
    </h1>
  )
}

export default H1
