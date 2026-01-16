/**
 * Migration script to update services with rich content from design concept
 * Source: docs/design/booking-page-concepts-011426/booking-concept-4-refined.html
 *
 * Run with: npx tsx scripts/migrate-services-content.ts
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

interface ServiceContent {
  name: string
  description: string
  extendedDescription: string
  techniques: string[]
  bestFor: string[]
}

const servicesContent: ServiceContent[] = [
  {
    name: '30 Minute Session',
    description: 'Targeted work on a single area of concern. I use focused pressure and trigger point techniques to address specific tension in the neck, shoulders, or lower back.',
    extendedDescription: "This session works well for maintenance between longer appointments, addressing a flare-up, or when your schedule is tight. We'll spend the full time on your priority area rather than spreading attention thin.",
    techniques: ['Trigger point therapy', 'Focused deep tissue', 'Myofascial release'],
    bestFor: ['Desk workers with neck tension', 'Runners with tight calves', 'Maintenance between sessions'],
  },
  {
    name: '60 Minute Session',
    description: "A complete full-body treatment combining Swedish strokes, kneading, and deeper pressure where needed. This is my most popular session—enough time to address your back, neck, shoulders, and legs while promoting full-body relaxation.",
    extendedDescription: "I'll check in about pressure throughout and adjust my approach based on what your body needs that day. Whether you want relaxation or more therapeutic work, an hour gives us the flexibility to do both.",
    techniques: ['Swedish massage', 'Deep tissue', 'Kneading', 'Long flowing strokes'],
    bestFor: ['Regular wellness maintenance', 'Stress relief', 'First-time clients', 'General tension'],
  },
  {
    name: '90 Minute Session',
    description: 'An unhurried, comprehensive session with time for detailed work on problem areas. The extra thirty minutes allows me to thoroughly address chronic tension without rushing, incorporating hot towel application and optional stretching or aromatherapy.',
    extendedDescription: "This is my most thorough treatment—ideal when you're carrying significant tension, recovering from an event, or simply want to fully disconnect. We can spend extra time on stubborn areas while still providing complete full-body coverage.",
    techniques: ['Combined modalities', 'Hot towels', 'Assisted stretching', 'Aromatherapy (optional)'],
    bestFor: ['Chronic pain', 'Athletes', 'High-stress periods', 'Complete restoration', 'Treating yourself'],
  },
]

async function migrateServices() {
  console.log('Starting services content migration...\n')

  // Fetch existing services
  const existingServices = await client.fetch(`*[_type == "service"] { _id, name }`)
  console.log(`Found ${existingServices.length} existing services in Sanity\n`)

  for (const content of servicesContent) {
    // Find matching service by name
    const existingService = existingServices.find(
      (s: { name: string }) => s.name === content.name
    )

    if (existingService) {
      // Update existing service
      console.log(`Updating: ${content.name}`)
      await client
        .patch(existingService._id)
        .set({
          description: content.description,
          extendedDescription: content.extendedDescription,
          techniques: content.techniques,
          bestFor: content.bestFor,
        })
        .commit()
      console.log(`  ✓ Updated successfully\n`)
    } else {
      // Create new service
      console.log(`Creating: ${content.name}`)
      await client.create({
        _type: 'service',
        name: content.name,
        slug: { _type: 'slug', current: content.name.toLowerCase().replace(/\s+/g, '-') },
        duration: content.name.split(' ')[0] + ' min',
        price: content.name === '30 Minute Session' ? '$60' : content.name === '60 Minute Session' ? '$100' : '$145',
        description: content.description,
        extendedDescription: content.extendedDescription,
        techniques: content.techniques,
        bestFor: content.bestFor,
        featured: true,
        order: content.name === '30 Minute Session' ? 1 : content.name === '60 Minute Session' ? 2 : 3,
      })
      console.log(`  ✓ Created successfully\n`)
    }
  }

  console.log('Migration complete!')
}

migrateServices().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
