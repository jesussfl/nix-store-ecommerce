'use client'

import { cn } from '@/libs/utils'
import { H5, H6 } from '../headings'
import { useTranslations } from 'next-intl'
import { Button, buttonVariants } from '../button'
import Logo from '../logo'
import Link from 'next/link'
import {
  RiArrowRightUpLine,
  RiArrowUpLine,
  RiFacebookLine,
  RiInstagramLine,
  RiMailLine,
  RiWhatsappLine,
  RiTwitterLine,
  RiLinkedinLine,
  RiFacebookCircleLine,
} from '@remixicon/react'
import { HorizontalDivider } from '../divider'

export default function Footer() {
  const t = useTranslations('homepage.footer')

  return (
    <footer className="mt-24 max-w-[120rem] px-4 md:px-8">
      <div className="rounded-lg border border-border bg-footer-texture bg-cover bg-left bg-no-repeat p-6 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo
              variant="dark"
              width={200}
              height={80}
              classname="w-40 md:w-48"
            />
            <H5 className="mt-4">{t('slogan')}</H5>
            <div className="mt-6 flex gap-4">
              <SocialButton
                href="https://www.instagram.com/nixstore.co/"
                icon={<RiInstagramLine />}
                label="Instagram"
              />
              <SocialButton
                href="https://www.facebook.com/nixstore.co/"
                icon={<RiFacebookCircleLine />}
                label="Facebook"
              />
              <SocialButton
                href="https://twitter.com/nixstore_co"
                icon={<RiTwitterLine />}
                label="Twitter"
              />
              <SocialButton
                href="https://www.linkedin.com/company/nixstore"
                icon={<RiLinkedinLine />}
                label="LinkedIn"
              />
            </div>
          </div>
          <div>
            <H6 className="mb-4">{t(`quick-links`)}</H6>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="hover:underline">
                Sobre nosotros
              </Link>
              <Link href="/catalog" className="hover:underline">
                Catálogo
              </Link>

              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <H6 className="mb-4">{t('customer-service')}</H6>
            <nav className="flex flex-col space-y-2">
              <Link href="/faq" className="hover:underline">
                Preguntas Frecuentes
              </Link>
              {/* <Link href="/shipping" className="hover:underline">
                Shipping & Returns
              </Link> */}
              <Link href="/terms" className="hover:underline">
                Nuestras políticas de la tienda
              </Link>
              {/* <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link> */}
            </nav>
          </div>
          <div>
            <H6 className="mb-4">{t('need-help')}</H6>
            <ContactButtons />
          </div>
        </div>
        <HorizontalDivider className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>© 2024 Nix Store - Todos los derechos reservados</p>
          <p>Sitio desarrollado por: @Jesuss_dev</p>
          <Button
            variant="ghost"
            size="sm"
            className="group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Volver arriba
            <RiArrowUpLine className="ml-2 transition-transform group-hover:-translate-y-1" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string
  icon: JSX.Element
  label: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'icon' }),
        'transition-colors hover:bg-primary hover:text-primary-foreground'
      )}
      aria-label={label}
    >
      {icon}
    </Link>
  )
}

function ContactButtons() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="https://wa.me/1234567890"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'justify-start'
        )}
      >
        <RiWhatsappLine className="mr-2 h-4 w-4" />
        WhatsApp
      </Link>
      <Link
        href="mailto:info@nixstore.co"
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'justify-start'
        )}
      >
        <RiMailLine className="mr-2 h-4 w-4" />
        Email
      </Link>
    </div>
  )
}
