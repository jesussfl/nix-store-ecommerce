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
    <div className="flex flex-col gap-8 lg:gap-12 py-10 lg:py-16">
      <Logo
        variant="white"
        width={300}
        height={300}
        classname="w-36 sm:w-44 md:w-52 lg:w-56"
      />
      <div className="space-y-5 md:space-y-6">
        <H1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
          {t('title')}
        </H1>
        <p className="max-w-prose text-base text-dark-foreground/80 sm:text-lg lg:text-xl leading-relaxed">
          {t('description')}
        </p>
      </div>
      <div>
        <Link
          href="/catalog"
          className={cn(
            buttonVariants({ variant: 'default', size: 'lg' }),
            'w-full sm:w-auto text-lg px-8 py-6 rounded-full font-semibold'
          )}
        >
          {t('CTA')} <RiArrowRightCircleLine className="ml-2 h-6 w-6" />
        </Link>
      </div>
    </div>
  )
}

export default Hero
