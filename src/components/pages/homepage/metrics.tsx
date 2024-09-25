import { VerticalDivider } from '@/components/shared/divider'
import { getTranslations } from 'next-intl/server'

export const MetricsSection = async () => {
  const t = await getTranslations('homepage.metrics-section')

  return (
    <section className="flex gap-4 px-4 pb-24">
      <Heading title={t('satisfied-customers')} number={'+1.700'} />
      <div className="flex flex-col items-center justify-center gap-4">
        <VerticalDivider className="h-[50px] w-[3px]" />
      </div>
      <Heading title={t('successful-orders')} number={'+4.000'} />
      <div className="flex flex-col items-center justify-center gap-4">
        <VerticalDivider className="h-[50px] w-[3px]" />
      </div>
      <Heading title={t('custom-made-products')} number={'+100'} />
    </section>
  )
}

type FeatureCardProps = {
  title: string
  number: string
}

const Heading = ({ title, number }: FeatureCardProps) => {
  return (
    <div className="flex w-[33%] flex-col gap-2">
      <p className="text-center text-xl font-bold text-primary md:text-3xl">
        {number}
      </p>
      <p className="text-center text-sm md:text-lg">{title}</p>
    </div>
  )
}
