import React from 'react'

import { InfiniteMovingCards } from './infinite-cards'
import { Section } from '@/components/shared/carousel/section'
import { getTranslations } from 'next-intl/server'

const BrandsSection = async () => {
  const t = await getTranslations('homepage.brands-section')

  return (
    <Section title={t('title')} centered id="brands" className="mb-0 pb-8">
      <div className="flex flex-col items-center">
        <InfiniteMovingCards direction="right" speed="fast" />
      </div>
      <p className="mx-2 text-center text-base font-semibold">
        {t('description')}
      </p>
    </Section>
  )
}

export default BrandsSection
