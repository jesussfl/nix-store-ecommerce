import Hero from '../hero'

import { CarouselPlugin } from './carousel'

const Header = async () => {
  return (
    <header className="mx-2 mt-24 flex flex-col overflow-hidden rounded-3xl md:mx-8 md:mt-36 md:flex-row">
      <Hero />
      <CarouselPlugin />
      {/* <div className="flex h-[550px] items-center justify-center bg-gray-200 md:w-[50%] lg:h-[650px]">
      </div> */}
    </header>
  )
}

export default Header
