import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/accordion'
import { Section } from '@/components/shared/carousel/section'
import { getTranslations } from 'next-intl/server'

export const FaqsSection = async () => {
  const t = await getTranslations('homepage.faqs-section')
  return (
    <Section title={t('title')} description={t('description')} centered>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t('question-1')}</AccordionTrigger>
          <AccordionContent>{t('answer-1')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t('question-2')}</AccordionTrigger>
          <AccordionContent>{t('answer-2')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t('question-3')}</AccordionTrigger>
          <AccordionContent>{t('answer-3')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>{t('question-4')}</AccordionTrigger>
          <AccordionContent>{t('answer-4')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>{t('question-5')}</AccordionTrigger>
          <AccordionContent>{t('answer-5')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  )
}
