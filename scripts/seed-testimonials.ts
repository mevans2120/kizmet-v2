/**
 * Migration script to seed testimonials from design concept
 * Source: docs/design/testimonials-concepts-011626/testimonials-concept-3-two-up-compact.html
 *
 * Run with: npx tsx scripts/seed-testimonials.ts
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

interface TestimonialContent {
  authorName: string
  authorLocation: string
  quote: string
  order: number
}

const testimonials: TestimonialContent[] = [
  {
    authorName: 'Sarah M.',
    authorLocation: 'Port Angeles, WA',
    quote: 'After years of chronic shoulder pain from desk work, I finally found relief. Destiny has an incredible intuition for finding exactly where the tension lives.',
    order: 1,
  },
  {
    authorName: 'James T.',
    authorLocation: 'Sequim, WA',
    quote: "I was skeptical about massage therapy until I tried Kizmet. The 90-minute session is pure magic. It's become my monthly reset button.",
    order: 2,
  },
  {
    authorName: 'Rachel L.',
    authorLocation: 'Port Townsend, WA',
    quote: 'During my pregnancy, Destiny was a lifesaver. She knew exactly how to adjust her technique for each trimester. Highly recommend!',
    order: 3,
  },
  {
    authorName: 'Michael K.',
    authorLocation: 'Forks, WA',
    quote: "Best deep tissue massage I've ever had. Destiny listens to what you need and delivers exactly that. My lower back has never felt better.",
    order: 4,
  },
]

async function seedTestimonials() {
  console.log('Starting testimonials seed...\n')

  // Check for existing testimonials
  const existingTestimonials = await client.fetch(`*[_type == "testimonial"] { _id, authorName }`)
  console.log(`Found ${existingTestimonials.length} existing testimonials in Sanity\n`)

  if (existingTestimonials.length > 0) {
    console.log('Existing testimonials found. Skipping seed to avoid duplicates.')
    console.log('To re-seed, first delete existing testimonials in Sanity Studio.\n')
    return
  }

  for (const testimonial of testimonials) {
    console.log(`Creating: ${testimonial.authorName}`)
    await client.create({
      _type: 'testimonial',
      authorName: testimonial.authorName,
      authorLocation: testimonial.authorLocation,
      quote: testimonial.quote,
      featured: true,
      order: testimonial.order,
    })
    console.log(`  ✓ Created successfully\n`)
  }

  console.log('Seed complete! Created', testimonials.length, 'testimonials.')
}

seedTestimonials().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
