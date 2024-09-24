import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/accordion'
import { Section } from '@/components/shared/carousel/section'

export const FaqsSection = async () => {
  return (
    <Section
      title="Preguntas Frecuentes"
      description="Si tienes más dudas contáctanos"
      centered
    >
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            {` Yes. It's animated by default, but you can disable it if you prefer.`}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  )
}
