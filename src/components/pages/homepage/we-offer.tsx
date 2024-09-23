import { Card, CardContent } from '@/components/shared/card/card'
import { RiMotorbikeLine, RiPercentLine, RiTruckLine } from '@remixicon/react'
const features = [
  {
    title: 'Delivery en toda maracay',
    description: 'Podemos llevar tu pedido a cualquier zona de Maracay',
    icon: <RiMotorbikeLine className="h-8 w-8" />,
  },
  {
    title: 'Envíos nacionales en todo el país',
    description:
      'Tu pedido llegará en cualquier estado en el que te encuentres',
    icon: <RiTruckLine className="h-8 w-8" />,
  },
  {
    title: 'Paga el 50% en pedidos personalizados',
    description:
      'Puedes encargar con solo el 50% y pagar el resto para retirar.',
    icon: <RiPercentLine className="h-8 w-8" />,
  },
]
export const WeOfferSection = () => {
  return (
    <section className="mx-auto my-36 flex flex-col items-center gap-4">
      <div className="flex w-[200px] flex-col items-center justify-center rounded-full border border-border bg-gray-50 py-2">
        <p>Te ofrecemos</p>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        {features.map((feature, index) => (
          <FeatureCard {...feature} key={index} />
        ))}
      </div>
    </section>
  )
}

type FeatureCardProps = {
  title: string
  description: string
  icon: JSX.Element
}
const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="flex max-w-[200px] flex-col items-center justify-center gap-4 rounded-md border-2 border-border bg-gray-50 p-4 py-4 md:max-w-none md:flex-1 md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary text-primary">
        {icon}
      </div>
      <div className="">
        <p className="text-center text-base font-semibold md:text-lg">
          {title}
        </p>
        <p className="text-center text-xs md:text-sm">{description}</p>
      </div>
    </div>
  )
}
