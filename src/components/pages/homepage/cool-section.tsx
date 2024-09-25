import React from 'react'

import { NixAnimation } from './nix-animation'

const CoolSection = async () => {
  return (
    <div className="max-w-screen my-4 flex flex-col items-center justify-center overflow-hidden py-8 md:my-24 md:overflow-visible">
      <NixAnimation
        direction="left"
        speed="slow"
        className="top-8 rotate-[16deg] border-dark bg-white md:top-12 md:rotate-12"
        isDark
      />
      <NixAnimation
        direction="right"
        speed="slow"
        className="bottom-16 -rotate-[16deg] md:bottom-12 md:-rotate-12"
      />
    </div>
  )
}

export default CoolSection
