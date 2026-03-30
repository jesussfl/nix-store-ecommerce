import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RiArrowRightUpLine, RiSparklingLine } from '@remixicon/react'

export default async function StepsCtaSection() {
  const t = await getTranslations('homepage.steps-cta')

  return (
    <section className="px-4 md:px-8">
      <div className="mx-auto max-w-[120rem] lg:px-10 xl:px-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,_rgba(100,30,200,0.18),_transparent_34%),linear-gradient(135deg,_#12071F_0%,_#24103D_48%,_#FFFFFF_220%)] p-[1px] shadow-[0_28px_90px_rgba(74,0,144,0.18)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[linear-gradient(135deg,_rgba(17,7,31,0.95)_0%,_rgba(41,18,70,0.92)_44%,_rgba(252,249,255,0.98)_180%)] px-6 py-8 text-white md:px-10 md:py-10">
            <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-300/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold tracking-[0.16em] text-white/85 uppercase">
                  <RiSparklingLine className="h-4 w-4" />
                  {t('eyebrow')}
                </div>
                <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-4xl lg:text-[2.9rem]">
                  {t('title')}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                  {t('description')}
                </p>
              </div>

              <div className="relative">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/15 bg-black/15 px-4 py-3 text-sm text-white/80">
                      {t('highlight-1')}
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-black/15 px-4 py-3 text-sm text-white/80">
                      {t('highlight-2')}
                    </div>
                    <Link
                      href="/steps"
                      className="group inline-flex items-center justify-between rounded-2xl border border-primary/30 bg-white px-5 py-4 text-base font-semibold text-primary transition-transform duration-200 hover:-translate-y-1"
                    >
                      <span>{t('button')}</span>
                      <RiArrowRightUpLine className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
