import Hero from './hero'

import { CarouselPlugin } from '../../shared/header/carousel'

const Header = async () => {
  return (
    <header className="mx-2 mt-24 flex flex-col overflow-hidden rounded-md md:mx-8 md:mt-36 md:flex-row md:rounded-3xl">
      <Hero />
      <CarouselPlugin />
    </header>
  )
}

export default Header
