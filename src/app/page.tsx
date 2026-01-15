export const revalidate = 300 // Revalidate every 5 minutes as fallback

import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ServicesPreview from '@/components/ServicesPreview'
import AboutPreview from '@/components/AboutPreview'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOMEPAGE_SETTINGS_QUERY, FEATURED_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled

  const [homepage, services, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(HOMEPAGE_SETTINGS_QUERY),
    sanityFetch<any>(FEATURED_SERVICES_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation siteSettings={siteSettings} />
      <Hero data={homepage} />
      <ServicesPreview services={services} data={homepage} />
      <AboutPreview data={homepage} />
      <CTASection data={homepage} />
      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
      {isDraft && <VisualEditing />}
    </div>
  )
}
