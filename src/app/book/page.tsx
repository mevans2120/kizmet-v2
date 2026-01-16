export const revalidate = 300 // Revalidate every 5 minutes as fallback

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import BookContent from '@/page-content/Book'
import { sanityFetch } from '@/sanity/lib/fetch'
import { BOOK_PAGE_QUERY, ALL_SERVICES_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { generatePageMetadata } from '@/lib/metadata'

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  const bookData = await sanityFetch<any>(BOOK_PAGE_QUERY)
  return generatePageMetadata({
    title: 'Book an Appointment',
    description: bookData?.description || 'Schedule your massage therapy session at Kizmet Massage.',
    seo: bookData?.seo,
    path: '/book',
  })
}

export default async function BookPage() {
  const isDraft = (await draftMode()).isEnabled

  const [bookData, services, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<any>(BOOK_PAGE_QUERY),
    sanityFetch<any>(ALL_SERVICES_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <>
      <Suspense fallback={<BookLoadingState />}>
        <BookContent
          data={bookData}
          services={services}
          siteSettings={siteSettings}
          footerSettings={footerSettings}
        />
      </Suspense>
      {isDraft && <VisualEditing />}
    </>
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
