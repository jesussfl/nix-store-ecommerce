import { cn } from '@/libs/utils'
import { H5, H6 } from '../headings'
import { getTranslations } from 'next-intl/server'
import { Button, buttonVariants } from '../button'
import Logo from '../logo'
import Link from 'next/link'
import {
  RiArrowRightUpLine,
  RiArrowUpWideLine,
  RiFacebookLine,
  RiInstagramLine,
  RiMailLine,
  RiWhatsappLine,
} from '@remixicon/react'
import { HorizontalDivider, VerticalDivider } from '../divider'

const Footer = async () => {
  return (
    <footer className="mt-24 flex flex-col gap-4 px-2 md:h-[560px] md:px-8">
      <div
        className={`flex h-full flex-col rounded-sm border border-border bg-footer-texture bg-cover bg-left bg-no-repeat px-4 pb-3 md:rounded-md md:px-8 lg:rounded-lg lg:px-12`}
      >
        <TopFooterContainer />
        <HorizontalDivider className="mt-4" />
        <BottomFooterContainer />
      </div>
    </footer>
  )
}

export default Footer
const TopFooterContainer = async () => {
  const t = await getTranslations('homepage.footer')
  return (
    <div className="flex flex-1 flex-col p-8 md:flex-row">
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 md:w-[50%]">
        <Logo
          variant="dark"
          width={300}
          height={300}
          classname="w-[156px] md:w-[200px] md: lg:w-[256px] "
        />
        <H5 className="text-center">{t('slogan')}</H5>
        <H6 className="text-center">{t('social-networks')}</H6>
        <SocialButtons />
      </div>
      <VerticalDivider />
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 md:w-[50%]">
        <H6>Necesitas Ayuda?</H6>
      </div>
    </div>
  )
}
const BottomFooterContainer = async () => {
  return (
    <div className="flex flex-col items-center gap-4 py-4 md:flex-row md:justify-between">
      <p className="text-center md:text-left">
        @2024 Nix Store - Todos los derechos reservados
      </p>
      <p className="text-center md:text-right">
        Sitio web desarrollado por: @Jesuss_dev
      </p>
    </div>
  )
}

const SocialButtons = async () => {
  return (
    <div className="flex gap-4">
      <Link
        href={'https://www.instagram.com/nixstore.co/'}
        className={cn(
          'w-full',
          buttonVariants({ variant: 'default', size: 'icon' })
        )}
      >
        <RiInstagramLine className="h-6 w-6" />
      </Link>
      <Link
        href={'https://www.instagram.com/nixstore.co/'}
        className={cn(
          'w-full',
          buttonVariants({ variant: 'default', size: 'icon' })
        )}
      >
        <RiFacebookLine className="h-6 w-6" />
      </Link>
    </div>
  )
}

const ContactButtons = async () => {
  return (
    <div className="flex flex-1 gap-2">
      <Link
        href={'https://www.instagram.com/nixstore.co/'}
        className={cn(
          'w-full',
          buttonVariants({ variant: 'outline', size: 'lg' })
        )}
      >
        Whatsapp
        <RiWhatsappLine className="ml-2 h-4 w-4" />
      </Link>
      <Link
        href={'https://www.instagram.com/nixstore.co/'}
        className={cn(
          'w-full',
          buttonVariants({ variant: 'outline', size: 'lg' })
        )}
      >
        Email
        <RiMailLine className="ml-2 h-4 w-4" />
      </Link>
    </div>
  )
}
