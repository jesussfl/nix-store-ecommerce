import { getTranslations } from 'next-intl/server'
import {
  RiExternalLinkLine,
  RiLinksLine,
  RiFileList3Line,
  RiWallet3Line,
  RiNotification3Line,
  RiAlertLine,
} from '@remixicon/react'

const stepIcons = [
  RiExternalLinkLine,
  RiLinksLine,
  RiFileList3Line,
  RiWallet3Line,
  RiNotification3Line,
]

export default async function StepsPage() {
  const t = await getTranslations('StepsPage')
  const steps = Array.from({ length: 5 }, (_, index) => ({
    title: t(`item-${index + 1}-title`),
    description: t(`item-${index + 1}-description`),
    accent: t(`item-${index + 1}-accent`),
    Icon: stepIcons[index],
  }))

  return (
    <section className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(126,58,242,0.20),_transparent_42%),linear-gradient(180deg,_rgba(100,30,200,0.10)_0%,_rgba(255,255,255,0)_100%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-border bg-white shadow-[0_24px_100px_rgba(56,24,94,0.10)]">
          <div className="border-b border-border px-6 py-8 md:px-10 md:py-10">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {t('eyebrow')}
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-foreground md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {t('description')}
            </p>
          </div>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-4">
              {steps.map((step, index) => {
                const Icon = step.Icon

                return (
                  <article
                    key={index}
                    className="group grid gap-4 rounded-[1.75rem] border border-border bg-[linear-gradient(135deg,_rgba(255,255,255,1)_0%,_rgba(248,243,255,0.92)_100%)] p-5 transition-transform duration-200 hover:-translate-y-1 md:grid-cols-[84px_1fr]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-button-primary text-white shadow-[0_12px_30px_rgba(100,30,200,0.22)] md:h-[84px] md:w-[84px]">
                      <Icon className="h-9 w-9" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="mb-2 inline-flex w-fit rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {t('stepLabel', { number: index + 1 })}
                      </div>
                      <h2 className="text-2xl font-bold leading-tight text-foreground">
                        {step.title}{' '}
                        <span className="text-primary">{step.accent}</span>
                      </h2>
                      <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-primary/20 bg-[linear-gradient(135deg,_rgba(100,30,200,0.08)_0%,_rgba(255,255,255,1)_65%)] p-6 shadow-[0_18px_60px_rgba(100,30,200,0.10)] md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
              <RiAlertLine className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                {t('disclaimerTitle')}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {t('disclaimer-1')}
              </p>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {t('disclaimer-2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
