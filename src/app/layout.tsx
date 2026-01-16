import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { generateSiteMetadata, getSiteSettings } from '@/lib/metadata'
import { StructuredData, generateSiteSchemaGraph } from '@/lib/structured-data'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

// Dynamic metadata from CMS
export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata()
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch site settings for structured data
  const siteSettings = await getSiteSettings()
  const schemaGraph = generateSiteSchemaGraph(siteSettings)

  // Get GA measurement ID from environment (only enable in production)
  const gaId = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : undefined

  return (
    <html lang="en" className={`${plusJakarta.variable} ${fraunces.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <StructuredData data={schemaGraph} />
        {/* Preconnect to Sanity CDN */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={gaId} />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
