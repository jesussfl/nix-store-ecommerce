import { getTranslations } from 'next-intl/server'
import H1 from '../../shared/headings'
import { buttonVariants } from '../../shared/button'
import { RiArrowRightCircleLine } from '@remixicon/react'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import Logo from '../../shared/logo'

const Hero = async () => {
  const t = await getTranslations('homepage.hero-section')

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Logo
        variant="white"
        width={300}
        height={300}
        classname="w-36 sm:w-44 md:w-52 lg:w-56"
      />
      <div className="space-y-4">
        <H1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {t('title')}
        </H1>
        <p className="max-w-prose text-base text-dark-foreground/70 sm:text-lg lg:text-xl">
          {t('description')}
        </p>
      </div>
      <div>
        <Link
          href="/catalog"
          className={cn(
            buttonVariants({ variant: 'default', size: 'lg' }),
            'w-full sm:w-auto'
          )}
        >
          {t('CTA')} <RiArrowRightCircleLine className="ml-2" />
        </Link>
      </div>
    </div>
  )
}

export default Hero
