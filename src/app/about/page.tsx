export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import AboutContent from '@/page-content/About'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { generatePageMetadata } from '@/lib/metadata'
import { StructuredData, generateTherapistSchema } from '@/lib/structured-data'
import { getCroppedImageUrl } from '@/sanity/lib/image'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const aboutData = await sanityFetch<any>(ABOUT_PAGE_QUERY)
  return generatePageMetadata({
    title: 'About',
    description: aboutData?.intro || 'Meet Destiny, a third-generation healer bringing family wisdom and modern therapeutic techniques to Kizmet Massage.',
    seo: aboutData?.seo,
    path: '/about',
  })
}

export default async function AboutPage() {
  const isDraft = (await draftMode()).isEnabled

  const [aboutData, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(ABOUT_PAGE_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  // Generate therapist schema for structured data
  const therapistSchema = generateTherapistSchema(
    {
      name: 'Destiny',
      role: 'Licensed Massage Therapist',
      bio: aboutData?.intro,
      photoUrl: aboutData?.heroImage
        ? getCroppedImageUrl(aboutData.heroImage, 800, 1000)
        : undefined,
      credentials: aboutData?.credentials,
    },
    siteSettings
  )

  return (
    <>
      <StructuredData data={therapistSchema} />
      <AboutContent
        data={aboutData}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
      {isDraft && <VisualEditing />}
    </>
  )
}
