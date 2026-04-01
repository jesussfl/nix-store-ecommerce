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
    <section className="mx-auto my-12 flex flex-col items-center gap-4 md:my-24 md:px-8">
      <div className="mb-4 inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-6 py-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t('title')}</p>
      </div>
      <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3 md:gap-8 md:px-0">
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
    <div className="flex flex-row items-center justify-center gap-2 rounded-full border border-border/40 bg-white px-5 py-2.5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <div className="text-primary">{icon}</div>
      <p className="text-sm font-medium text-gray-700 md:text-base">{title}</p>
    </div>
  )
}
const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="group flex flex-1 flex-col items-center justify-start gap-5 rounded-2xl border border-border/40 bg-gray-50 bg-feature-texture bg-cover bg-no-repeat p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md md:p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
        <div className="scale-[1.2] md:scale-[1.5]">{icon}</div>
      </div>
      <div className="space-y-3">
        <p className="text-center text-base font-bold text-gray-800 md:text-lg">
          {title}
        </p>
        <p className="hidden text-center text-sm leading-relaxed text-gray-600 md:block md:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}
