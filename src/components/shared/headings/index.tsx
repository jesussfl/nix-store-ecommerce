import { cn } from '@/libs/utils'

const H1 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={cn(
        `text-3xl font-bold md:text-4xl lg:text-5xl lg:leading-[3.5rem]`,
        className
      )}
    >
      {children}
    </h1>
  )
}

export default H1

export const H2 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2 className={cn(`text-2xl font-bold md:text-3xl lg:text-4xl`, className)}>
      {children}
    </h2>
  )
}

export const H5 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h5 className={cn(`text-lg font-medium md:text-xl lg:text-2xl`, className)}>
      {children}
    </h5>
  )
}

export const H6 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h6
      className={cn(
        `text-[1.060rem] font-medium md:text-lg lg:text-xl`,
        className
      )}
    >
      {children}
    </h6>
  )
}
