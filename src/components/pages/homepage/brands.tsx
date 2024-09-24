'use client'

import React from 'react'

import { InfiniteMovingCards } from './infinite-cards'
import { Section } from '@/components/shared/carousel/section'
export const testimonials = [
  {
    image: '/assets/brands/Adidas-logo.png',
  },
  {
    image: '/assets/brands/Aliexpress.png',
  },
  {
    image: '/assets/brands/Amazon-logo.png',
  },
  {
    image: '/assets/brands/Shein.png',
  },
]
export const companies = [
  {
    id: 1,
    name: 'cloudinary',
    img: '/cloud.svg',
    nameImg: '/cloudName.svg',
  },
  {
    id: 2,
    name: 'appwrite',
    img: '/app.svg',
    nameImg: '/appName.svg',
  },
  {
    id: 3,
    name: 'HOSTINGER',
    img: '/host.svg',
    nameImg: '/hostName.svg',
  },
  {
    id: 4,
    name: 'stream',
    img: '/s.svg',
    nameImg: '/streamName.svg',
  },
  {
    id: 5,
    name: 'docker.',
    img: '/dock.svg',
    nameImg: '/dockerName.svg',
  },
]

const BrandsSection = () => {
  return (
    <Section
      title="Trabajamos con las siguientes páginas y muchas más"
      centered
      id="testimonials"
    >
      <div className="flex flex-col items-center">
        <InfiniteMovingCards direction="right" speed="fast" />
      </div>
      <p className="mx-2 text-center text-lg font-semibold">
        Encarga desde cualquier página que tenga envío a Estados Unidos
      </p>
    </Section>
  )
}

export default BrandsSection
