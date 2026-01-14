import type { Metadata } from 'next'
import PoliciesContent from '@/page-content/Policies'
import { client } from '@/sanity/lib/client'
import { POLICIES_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Review our booking, cancellation, and session policies for Kizmet Massage & Wellness.',
}

export default async function PoliciesPage() {
  const [policiesData, siteSettings, footerSettings] = await Promise.all([
    client.fetch(POLICIES_PAGE_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <PoliciesContent
      data={policiesData}
      siteSettings={siteSettings}
      footerSettings={footerSettings}
    />
  )
}
