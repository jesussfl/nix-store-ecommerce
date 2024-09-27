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
    <div className="flex h-[550px] flex-col justify-center gap-8 px-4 md:h-[750px] md:w-[50%] md:px-8 lg:pl-12">
      <div className="flex flex-col items-center justify-center space-y-4 md:items-start">
        <Logo
          variant="white"
          width={300}
          height={300}
          classname="w-[156px] md:w-[200px] md: lg:w-[224px]"
        />
        <H1 className="text-center text-white md:text-left"> {t('title')}</H1>
        <p className="md:text-md text-center text-sm text-dark-foreground opacity-70 md:text-left lg:text-lg">
          {t('description')}
        </p>
      </div>

      <Link
        href="/dashboard"
        className={cn(
          'w-full lg:w-[350px]',
          buttonVariants({ variant: 'default', size: 'xl' })
        )}
      >
        {t('CTA')} <RiArrowRightCircleLine className="ml-2" />
      </Link>
    </div>
  )
}

export default Hero
