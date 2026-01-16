export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import PoliciesContent from '@/page-content/Policies'
import { sanityFetch } from '@/sanity/lib/fetch'
import { POLICIES_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { generatePageMetadata } from '@/lib/metadata'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const policiesData = await sanityFetch<any>(POLICIES_PAGE_QUERY)
  return generatePageMetadata({
    title: 'What to Know',
    description: policiesData?.pageDescription || 'Review our booking, cancellation, and session policies for Kizmet Massage.',
    seo: policiesData?.seo,
    path: '/policies',
  })
}

export default async function PoliciesPage() {
  const isDraft = (await draftMode()).isEnabled

  const [policiesData, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(POLICIES_PAGE_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <>
      <PoliciesContent
        data={policiesData}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
      {isDraft && <VisualEditing />}
    </>
  )
}
