import { cn } from '@/libs/utils'

export const PageTemplate = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      style={{ scrollbarGutter: 'stable both-edges' }}
      className={cn(
        'h-full overflow-y-auto rounded-md bg-background',
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
}

export const PageHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'mb-5 flex w-full items-center justify-between border-b bg-background p-5',
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  )
}
PageHeader.displayName = 'PageHeader'

export const PageHeaderTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn(
        'flex items-center gap-2 text-2xl font-semibold tracking-tight',
        className
      )}
      {...props}
    >
      {props.children}
    </h1>
  )
}
PageHeaderTitle.displayName = 'PageHeaderTitle'

export const PageHeaderDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)
PageHeaderDescription.displayName = 'PageHeaderDescription'

export const HeaderLeftSide = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col justify-start space-y-1', className)}
    {...props}
  />
)
HeaderLeftSide.displayName = 'HeaderLeftSide'

export const HeaderRightSide = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end space-x-4', className)}
    {...props}
  />
)

export const PageContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{ scrollbarGutter: 'stable both-edges' }}
    className={cn('space-y-4 px-5', className)}
    {...props}
  >
    {props.children}
  </div>
)
PageContent.displayName = 'PageContent'
