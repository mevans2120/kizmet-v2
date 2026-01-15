import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ServicesPreview from '@/components/ServicesPreview'
import AboutPreview from '@/components/AboutPreview'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import { client } from '@/sanity/lib/client'
import { HOMEPAGE_SETTINGS_QUERY, FEATURED_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export default async function HomePage() {
  const [homepage, services, siteSettings, footerSettings] = await Promise.all([
    client.fetch(HOMEPAGE_SETTINGS_QUERY),
    client.fetch(FEATURED_SERVICES_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation siteSettings={siteSettings} />
      <Hero data={homepage} />
      <ServicesPreview services={services} data={homepage} />
      <AboutPreview data={homepage} />
      <CTASection data={homepage} />
      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  )
}
