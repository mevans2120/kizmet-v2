import type { Metadata } from 'next'
import BookContent from '@/page-content/Book'
import { client } from '@/sanity/lib/client'
import { BOOK_PAGE_QUERY, ALL_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your massage therapy session at Kizmet Massage & Wellness.',
}

export default async function BookPage() {
  const [bookData, services, siteSettings, footerSettings] = await Promise.all([
    client.fetch(BOOK_PAGE_QUERY),
    client.fetch(ALL_SERVICES_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <BookContent
      data={bookData}
      services={services}
      siteSettings={siteSettings}
      footerSettings={footerSettings}
    />
  )
}
