import { getTranslations } from 'next-intl/server'
import { Card, CardContent } from '@/components/shared/card/card'

export const MetricsSection = async () => {
  const t = await getTranslations('homepage.metrics-section')

  const metrics = [
    { title: t('satisfied-customers'), number: '+1,700' },
    { title: t('successful-orders'), number: '+4,000' },
    { title: t('custom-made-products'), number: '+100' },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Card className="rounded-2xl border border-border/40 shadow-sm md:rounded-3xl">
        <CardContent className="p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center"
              >
                <Metric title={metric.title} number={metric.number} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

type MetricProps = {
  title: string
  number: string
}

const Metric = ({ title, number }: MetricProps) => {
  return (
    <div className="space-y-3">
      <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">{number}</p>
      <p className="text-sm font-medium text-gray-600 sm:text-base uppercase tracking-wider">{title}</p>
    </div>
  )
}
