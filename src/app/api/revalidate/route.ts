import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'No document type provided' },
        { status: 400 }
      )
    }

    // Map document types to paths that need revalidation
    const pathMap: Record<string, string[]> = {
      homepageSettings: ['/'],
      aboutPage: ['/about'],
      servicesPage: ['/services'],
      service: ['/services', '/book', '/'],
      policiesPage: ['/policies'],
      bookPage: ['/book'],
      siteSettings: ['/', '/about', '/services', '/policies', '/book'],
      footerSettings: ['/', '/about', '/services', '/policies', '/book'],
    }

    const paths = pathMap[body._type] || ['/']

    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}
