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
                icon={<RiFacebookLine />}
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
            <H6 className="mb-4">Quick Links</H6>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <H6 className="mb-4">Customer Service</H6>
            <nav className="flex flex-col space-y-2">
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
              <Link href="/shipping" className="hover:underline">
                Shipping & Returns
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </nav>
          </div>
          <div>
            <H6 className="mb-4">{t('need-help')}</H6>
            <ContactButtons />
            <div className="mt-4">
              <H6 className="mb-2">Newsletter</H6>
              <form onSubmit={(e) => e.preventDefault()} className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow rounded-l-md border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        <HorizontalDivider className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <p>© 2024 Nix Store - All rights reserved</p>
          <p>Website developed by: @Jesuss_dev</p>
          <Button
            variant="ghost"
            size="sm"
            className="group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
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
