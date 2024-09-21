import { getTranslations } from 'next-intl/server'
import H1 from '../headings'
import { Button, buttonVariants } from '../button'
import { RiArrowRightCircleLine } from '@remixicon/react'
import Link from 'next/link'
import { cn } from '@/libs/utils'
import Logo from '../logo'
const Hero = async () => {
  const t = await getTranslations('homepage')

  return (
    <div className="flex h-[550px] flex-col justify-center gap-8 bg-dark px-4 md:w-[50%] md:px-8 lg:h-[650px] lg:px-12">
      <div className="flex flex-col items-center justify-center space-y-4 md:items-start">
        <Logo
          variant="white"
          width={300}
          height={300}
          classname="w-[156px] md:w-[200px] md: lg:w-[224px]"
        />
        <H1> {t('hero-h1')}</H1>
        <p className="md:text-md text-center text-sm text-dark-foreground opacity-70 md:text-left lg:text-lg">
          {t('hero-description')}
        </p>
      </div>

      <Link
        href="/dashboard"
        className={cn(
          'w-full lg:w-[350px]',
          buttonVariants({ variant: 'default', size: 'xl' })
        )}
      >
        {t('hero-button')} <RiArrowRightCircleLine className="ml-2" />
      </Link>
    </div>
  )
}

export default Hero
