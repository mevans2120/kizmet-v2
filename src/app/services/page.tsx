export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import ServicesContent from '@/page-content/Services'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'Explore our massage therapy services: 30, 60, and 90-minute sessions tailored to your wellness needs.',
}

export default async function ServicesPage() {
  const isDraft = (await draftMode()).isEnabled

  const [services, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(ALL_SERVICES_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <>
      <ServicesContent
        services={services}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
      {isDraft && <VisualEditing />}
    </>
  )
}
