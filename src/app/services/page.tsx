export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import ServicesContent from '@/page-content/Services'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_SERVICES_QUERY, SERVICES_PAGE_SETTINGS_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { generatePageMetadata } from '@/lib/metadata'
import { StructuredData, generateServiceSchema } from '@/lib/structured-data'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const servicesPageSettings = await sanityFetch<any>(SERVICES_PAGE_SETTINGS_QUERY)

  return generatePageMetadata({
    title: servicesPageSettings?.seo?.metaTitle || servicesPageSettings?.title || 'Services & Pricing',
    description: servicesPageSettings?.seo?.metaDescription || servicesPageSettings?.description || 'Explore our massage therapy services: 30, 60, and 90-minute sessions tailored to your wellness needs.',
    path: '/services',
  })
}

export default async function ServicesPage() {
  const isDraft = (await draftMode()).isEnabled

  const [services, servicesPageSettings, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(ALL_SERVICES_QUERY),
    sanityFetch<any>(SERVICES_PAGE_SETTINGS_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  // Get site URL for service schemas
  const siteUrl = siteSettings?.seo?.siteUrl || 'https://kizmetmassage.com'

  // Generate schema for each service
  const serviceSchemas =
    services?.map((service: { name: string; description?: string; price?: string }) =>
      generateServiceSchema(
        {
          name: service.name,
          description: service.description,
          price: service.price,
        },
        siteUrl
      )
    ) || []

  return (
    <>
      {serviceSchemas.map((schema: object, index: number) => (
        <StructuredData key={index} data={schema} />
      ))}
      <ServicesContent
        services={services}
        servicesPageSettings={servicesPageSettings}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
      {isDraft && <VisualEditing />}
    </>
  )
}
