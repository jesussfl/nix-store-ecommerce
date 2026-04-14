import React from 'react'

import { NixAnimation } from './nix-animation'

const CoolSection = async () => {
  return (
    <div className="max-w-screen my-4 flex flex-col items-center justify-center overflow-hidden py-8 md:my-24 md:overflow-visible">
      <NixAnimation
        direction="left"
        speed="slow"
        className="top-4 rotate-6 border-dark bg-white md:top-12 md:rotate-[8deg] scale-110"
        isDark
      />
      <NixAnimation
        direction="right"
        speed="slow"
        className="bottom-4 -rotate-6 md:bottom-12 md:-rotate-[8deg] scale-110"
      />
    </div>
  )
}

export default CoolSection
