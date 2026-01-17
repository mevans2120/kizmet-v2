export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ServicesPreview from '@/components/ServicesPreview'
import AboutPreview from '@/components/AboutPreview'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { sanityFetch } from '@/sanity/lib/fetch'
import { HOMEPAGE_SETTINGS_QUERY, FEATURED_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY, ABOUT_PAGE_QUERY, TESTIMONIALS_QUERY } from '@/sanity/lib/queries'
import { generatePageMetadata } from '@/lib/metadata'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await sanityFetch<any>(HOMEPAGE_SETTINGS_QUERY)
  return generatePageMetadata({
    title: homepage?.seo?.metaTitle || undefined,
    description: homepage?.heroSubheadline,
    seo: homepage?.seo,
    path: '/',
  })
}

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled

  const [homepage, services, siteSettings, footerSettings, aboutPage, testimonials] = await Promise.all([
    sanityFetch<any>(HOMEPAGE_SETTINGS_QUERY),
    sanityFetch<any>(FEATURED_SERVICES_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
    sanityFetch<any>(ABOUT_PAGE_QUERY),
    sanityFetch<any>(TESTIMONIALS_QUERY),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation siteSettings={siteSettings} />
      <Hero data={homepage} />
      <ServicesPreview services={services} data={homepage} />
      <AboutPreview data={homepage} aboutData={aboutPage} />
      {homepage?.testimonialsEnabled !== false && (
        <Testimonials data={homepage} testimonials={testimonials} />
      )}
      <CTASection data={homepage} />
      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
      {isDraft && <VisualEditing />}
    </div>
  )
}
