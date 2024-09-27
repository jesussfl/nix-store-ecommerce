import Hero from './hero'

import { CarouselPlugin } from '../../shared/header/carousel'
import Image from 'next/image'

const Header = async () => {
  return (
    <header className="mx-2 flex flex-col overflow-hidden rounded-md bg-dark bg-hero-texture bg-cover bg-no-repeat md:mx-8 md:flex-row md:rounded-3xl">
      <Hero />

      <CarouselPlugin />
    </header>
  )
}

export default Header
