import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { NOT_FOUND_PAGE_QUERY, SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from '@/sanity/lib/queries'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'

interface NotFoundData {
  heading?: string;
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default async function NotFound() {
  const [notFoundData, siteSettings, footerSettings] = await Promise.all([
    sanityFetch<NotFoundData | null>(NOT_FOUND_PAGE_QUERY),
    sanityFetch<any>(SITE_SETTINGS_QUERY),
    sanityFetch<any>(FOOTER_SETTINGS_QUERY),
  ]);

  const heading = notFoundData?.heading || "404";
  const message = notFoundData?.message || "Page not found";
  const buttonText = notFoundData?.buttonText || "Return Home";
  const buttonLink = notFoundData?.buttonLink || "/";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation siteSettings={siteSettings} />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-heading text-5xl md:text-6xl font-medium text-secondary-foreground mb-4">{heading}</h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            {message}
          </p>
          <Button asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
      </main>
      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  )
}
