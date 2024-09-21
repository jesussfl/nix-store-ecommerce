import NixColorLight from '@public/assets/logo/nix-logo-color-light.svg'
import NixColorDark from '@public/assets/logo/nix-logo-color-dark.svg'
import NixWhite from '@public/assets/logo/nix-logo-white.svg'
import NixBlack from '@public/assets/logo/nix-logo-black.svg'
import Image from 'next/image'

const logoMap = {
  light: NixColorLight,
  dark: NixColorDark,
  white: NixWhite,
  black: NixBlack,
}

const Logo = async ({
  classname,
  variant,
  height = 56,
  width = 56,
}: {
  classname?: string
  width?: number
  variant: 'light' | 'dark' | 'white' | 'black'
  height?: number
}) => {
  const logoSrc = logoMap[variant]

  return (
    <Image
      className={classname}
      width={width}
      height={height}
      src={logoSrc}
      alt="Nix Logo"
    />
  )
}

export default Logo
