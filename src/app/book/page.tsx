import type { Metadata } from 'next'
import { Suspense } from 'react'
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
    <Suspense fallback={<BookLoadingState />}>
      <BookContent
        data={bookData}
        services={services}
        siteSettings={siteSettings}
        footerSettings={footerSettings}
      />
    </Suspense>
  )
}

// Loading state while useSearchParams resolves
function BookLoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6 text-center">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mb-4" />
            <div className="h-12 w-80 bg-muted animate-pulse rounded mx-auto mb-6" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
          </div>
        </section>
      </div>
    </div>
  )
}
