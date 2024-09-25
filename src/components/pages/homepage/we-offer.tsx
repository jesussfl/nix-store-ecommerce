import {
  RiBankCard2Line,
  RiMotorbikeLine,
  RiPercentLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiTruckLine,
} from '@remixicon/react'
import { getTranslations } from 'next-intl/server'

export const WeOfferSection = async () => {
  const t = await getTranslations('homepage.we-offer-section')

  const features = [
    {
      title: t('offer-1-title'),
      description: t('offer-1-description'),
      icon: <RiMotorbikeLine className="h-8 w-8" />,
    },
    {
      title: t('offer-2-title'),
      description: t('offer-2-description'),
      icon: <RiTruckLine className="h-8 w-8" />,
    },
    {
      title: t('offer-3-title'),
      description: t('offer-3-description'),
      icon: <RiPercentLine className="h-8 w-8" />,
    },
  ]
  return (
    <section className="mx-auto my-12 flex flex-col items-center gap-4 md:my-24">
      <div className="flex w-[150px] flex-col items-center justify-center rounded-full border border-border bg-gray-50 py-2">
        <p>{t('title')}</p>
      </div>
      <div className="grid grid-cols-3 items-stretch gap-x-1 px-1 md:gap-x-4">
        {features.map((feature, index) => (
          <FeatureCard {...feature} key={index} />
        ))}
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <FeatureChip
          title={t(`chip1`)}
          icon={<RiShieldCheckLine className="h-4 w-4" />}
        />
        <FeatureChip
          title={t(`chip2`)}
          icon={<RiBankCard2Line className="h-4 w-4" />}
        />
        <FeatureChip
          title={t(`chip3`)}
          icon={<RiTimeLine className="h-4 w-4" />}
        />
      </div>
    </section>
  )
}

type FeatureCardProps = {
  title: string
  description: string
  icon: JSX.Element
}

const FeatureChip = ({ title, icon }: { title: string; icon: JSX.Element }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 rounded-full border border-border bg-gray-50 px-4 py-2">
      {icon}
      <p className="text-xs md:text-lg">{title}</p>
    </div>
  )
}
const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-4 rounded-md border-2 border-border bg-gray-50 bg-feature-texture bg-cover bg-no-repeat p-1 md:p-4">
      <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-md border border-primary text-primary md:scale-100">
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-center text-xs font-semibold md:text-lg">{title}</p>
        <p className="hidden text-center text-xs md:block md:text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}
