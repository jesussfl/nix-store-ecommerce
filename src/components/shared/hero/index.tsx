import { getTranslations } from 'next-intl/server'
import H1 from '../h1'
import { Button } from '../button'

const Hero = async () => {
  const t = await getTranslations('homepage')

  return (
    <div className="flex h-[550px] flex-col justify-center gap-8 bg-dark px-4 md:w-[50%] md:px-8 lg:h-[650px] lg:px-12">
      <div className="space-y-4">
        <H1> {t('hero-h1')}</H1>
        <p className="md:text-md text-center text-sm text-dark-foreground opacity-70 md:text-left lg:text-lg">
          {t('hero-description')}
        </p>
      </div>

      <Button size={'lg'} variant={'default'}>
        {t('hero-button')}
      </Button>
    </div>
  )
}

export default Hero
