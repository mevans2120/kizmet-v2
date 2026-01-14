import type { Metadata } from 'next'
import ServicesContent from '@/page-content/Services'
import { client } from '@/sanity/lib/client'
import { ALL_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'Explore our massage therapy services: 30, 60, and 90-minute sessions tailored to your wellness needs.',
}

export default async function ServicesPage() {
  const [services, siteSettings, footerSettings] = await Promise.all([
    client.fetch(ALL_SERVICES_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <ServicesContent
      services={services}
      siteSettings={siteSettings}
      footerSettings={footerSettings}
    />
  )
}
