/**
 * Migration script to move About Preview content from separate singleton
 * into the Homepage Settings singleton.
 *
 * Run with: npx tsx scripts/migrate-about-preview-to-homepage.ts
 */
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function migrate() {
  console.log('Starting migration: aboutPreview → homepageSettings...\n')

  // 1. Fetch existing aboutPreview content
  const aboutPreview = await client.fetch(`*[_type == "aboutPreview"][0]`)

  if (!aboutPreview) {
    console.log('No aboutPreview document found, using defaults')
  } else {
    console.log('✓ Found existing aboutPreview document')
    console.log('  - eyebrow:', aboutPreview.eyebrow)
    console.log('  - quote:', aboutPreview.quote?.substring(0, 50) + '...')
  }

  // 2. Update homepageSettings with aboutPreview fields
  const patchData = {
    aboutPreviewEyebrow: aboutPreview?.eyebrow || 'Meet Your Therapist',
    aboutPreviewQuote: aboutPreview?.quote || 'In my family, healing was never something you learned from a textbook. It was passed down through touch, through presence, through care.',
    aboutPreviewAttributionName: aboutPreview?.attributionName || 'Destiny',
    aboutPreviewAttributionTitle: aboutPreview?.attributionTitle || 'Third-Generation Healer',
    aboutPreviewCtaText: aboutPreview?.ctaText || 'Read My Story',
    aboutPreviewCtaLink: aboutPreview?.ctaLink || '/about',
  }

  console.log('\nPatching homepageSettings with:')
  Object.entries(patchData).forEach(([key, value]) => {
    const displayValue = typeof value === 'string' && value.length > 50
      ? value.substring(0, 50) + '...'
      : value
    console.log(`  - ${key}: ${displayValue}`)
  })

  await client
    .patch('homepageSettings')
    .set(patchData)
    .commit()

  console.log('\n✓ Migrated aboutPreview fields to homepageSettings')

  // 3. Delete the old aboutPreview document
  if (aboutPreview?._id) {
    await client.delete(aboutPreview._id)
    console.log('✓ Deleted old aboutPreview document')
  }

  console.log('\n✅ Migration complete!')
  console.log('\nNext steps:')
  console.log('  1. Delete src/sanity/schemaTypes/aboutPreview.ts')
  console.log('  2. Remove aboutPreview from schemaTypes/index.ts')
  console.log('  3. Remove aboutPreview from deskStructure.ts')
  console.log('  4. Update frontend queries and components')
}

migrate().catch(console.error)
