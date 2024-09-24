import { VerticalDivider } from '@/components/shared/divider'
import { getTranslations } from 'next-intl/server'

export const MetricsSection = async () => {
  const t = await getTranslations('homepage.metrics-section')

  return (
    <section className="mx-auto my-12 flex flex-col items-center gap-4 md:my-32">
      <div className="flex gap-8">
        <Heading title={t('satisfied-customers')} number={'+1.700'} />
        <div className="flex flex-col items-center justify-center gap-4">
          <VerticalDivider className="h-[50px] w-[4px]" />
        </div>
        <Heading title={t('successful-orders')} number={'+4.000'} />
        <div className="flex flex-col items-center justify-center gap-4">
          <VerticalDivider className="h-[50px] w-[4px]" />
        </div>
        <Heading title={t('custom-made-products')} number={'+100'} />
      </div>
    </section>
  )
}

type FeatureCardProps = {
  title: string
  number: string
}

const Heading = ({ title, number }: FeatureCardProps) => {
  return (
    <div className="space-y-2">
      <p className="text-center font-bold text-primary md:text-3xl">{number}</p>
      <p className="text-center text-xs md:text-lg">{title}</p>
    </div>
  )
}
