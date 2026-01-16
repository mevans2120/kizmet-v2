/**
 * Migration script to populate SEO and business settings in Sanity
 *
 * Run with: npx tsx scripts/migrate-seo-settings.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const siteSettingsData = {
  // Branding
  brandName: 'Kizmet Massage',
  tagline: 'Therapeutic Massage in Port Angeles',

  // Contact
  phone: '(360) 555-0123', // Update with real phone
  email: 'destiny@kizmetmassage.studio', // Update with real email
  address: {
    street: '105 1/2 E 1st St',
    city: 'Port Angeles',
    state: 'WA',
    zip: '98362',
  },

  // SEO
  seo: {
    siteUrl: 'https://kizmetmassage.studio',
    metaTitle: 'Kizmet Massage | Therapeutic Massage in Port Angeles',
    metaDescription: 'Professional therapeutic massage services in Port Angeles, WA. Destiny Pugh offers personalized 30, 60, and 90-minute sessions combining traditional healing wisdom with modern techniques.',
    twitterHandle: '', // Add if available
    instagramHandle: '', // Add if available
    facebookUrl: '', // Add if available
  },

  // Business Info for Google
  businessInfo: {
    businessType: 'HealthAndBeautyBusiness',
    priceRange: '$$',
    businessHours: [
      {
        _type: 'object',
        _key: 'weekdays',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
      {
        _type: 'object',
        _key: 'saturday',
        days: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    geoCoordinates: {
      // Port Angeles coordinates (approximate - update with exact location)
      latitude: 48.1181,
      longitude: -123.4307,
    },
    googleMapsUrl: 'https://maps.google.com/?q=105+1/2+E+1st+St,+Port+Angeles,+WA+98362',
  },
}

async function migrateSeoSettings() {
  console.log('Starting SEO settings migration...\n')

  // Check if site settings document exists
  const existingSettings = await client.fetch(`*[_type == "siteSettings"][0] { _id }`)

  if (existingSettings) {
    console.log('Updating existing site settings...')
    await client
      .patch(existingSettings._id)
      .set(siteSettingsData)
      .commit()
    console.log('✓ Site settings updated successfully\n')
  } else {
    console.log('Creating new site settings document...')
    await client.create({
      _type: 'siteSettings',
      ...siteSettingsData,
    })
    console.log('✓ Site settings created successfully\n')
  }

  // Update footer settings brand description
  const footerSettings = await client.fetch(`*[_type == "footerSettings"][0] { _id }`)
  if (footerSettings) {
    console.log('Updating footer settings...')
    await client
      .patch(footerSettings._id)
      .set({
        brandDescription: 'Nurturing your body and mind through the healing power of touch.',
        therapistName: 'Destiny',
      })
      .commit()
    console.log('✓ Footer settings updated\n')
  }

  console.log('Migration complete!')
  console.log('\nNext steps:')
  console.log('1. Go to /studio to review and adjust settings')
  console.log('2. Upload a social share image (1200x630) in Site Settings → SEO')
  console.log('3. Update phone/email with real contact info')
  console.log('4. Add social media handles if available')
  console.log('5. Verify geo coordinates are accurate')
}

migrateSeoSettings().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
