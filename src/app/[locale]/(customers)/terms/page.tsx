import { getTranslations } from 'next-intl/server'
import H1, { H5, H6 } from '@/components/shared/headings'

export default async function TermsPage() {
  const t = await getTranslations('TermsPage')
  const terms = Array.from({ length: 11 }, (_, index) => t(`item-${index + 1}`))

  return (
    <section className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-gradient-to-b from-secondary/70 via-background/60 to-background" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            {t('badge')}
          </span>
          <H1 className="mt-4 text-balance text-foreground">{t('title')}</H1>
          <H5 className="mt-4 text-base font-normal leading-7 text-muted-foreground md:text-lg">
            {t('description')}
          </H5>
        </div>

        <div className="rounded-[2rem] border border-border bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-8">
            <div className="border-b border-border pb-6">
              <H6 className="text-xl font-semibold text-foreground md:text-2xl">
                {t('sectionTitle')}
              </H6>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground md:text-base">
                {t('sectionDescription')}
              </p>
            </div>

            <ol className="space-y-5 text-sm leading-7 text-foreground md:text-base md:leading-8">
              {terms.map((term, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-border/80 bg-background/80 px-5 py-4"
                >
                  <span className="mr-2 font-semibold text-primary">
                    {index + 1}.
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
