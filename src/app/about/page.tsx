import type { Metadata } from 'next'
import AboutContent from '@/page-content/About'
import { client } from '@/sanity/lib/client'
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Destiny, a third-generation healer bringing family wisdom and modern therapeutic techniques to Kizmet Massage & Wellness.',
}

export default async function AboutPage() {
  const [aboutData, siteSettings, footerSettings] = await Promise.all([
    client.fetch(ABOUT_PAGE_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <AboutContent
      data={aboutData}
      siteSettings={siteSettings}
      footerSettings={footerSettings}
    />
  )
}
