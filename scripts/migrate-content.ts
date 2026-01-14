/**
 * Migration script to populate Sanity with existing hardcoded content.
 * Run with: npx tsx scripts/migrate-content.ts
 *
 * Prerequisites:
 * - Sanity project created and schemas deployed
 * - SANITY_API_TOKEN env var set (needs write permissions)
 */
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

// Load .env.local
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Content extracted from current components
const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  brandName: 'Kizmet',
  tagline: 'Massage and Wellness',
  phone: '(360) 123-4567',
  email: 'destiny@kizmetwellness.com',
  address: {
    street: '123 Main Street',
    city: 'Port Angeles',
    state: 'WA',
    zip: '98362',
  },
  bookingUrl: '/book',
}

const homepageSettings = {
  _type: 'homepageSettings',
  _id: 'homepageSettings',
  heroHeadline: 'Kizmet',
  heroSubheadline: 'Destiny Pugh offers therapeutic massage in Port Angeles. Reconnect with your body and find your balance.',
  heroCta: 'Book Your Session',
  servicesHeading: 'Signature Services',
  servicesDescription: 'Each session is tailored to your individual needs',
  ctaHeadline: "It's Time to Feel Good",
  ctaDescription: 'Book your first session today and experience the transformative power of therapeutic massage.',
  ctaButtonText: 'Book Your Appointment',
}

const aboutPage = {
  _type: 'aboutPage',
  _id: 'aboutPage',
  eyebrow: 'About Destiny',
  headline: 'Healing Hands, Open Heart',
  intro: "I grew up watching my grandmother's hands work magic on aching muscles and tired spirits. Now I'm carrying that tradition forward, blending generations of natural healing wisdom with modern therapeutic techniques.",
  quoteText: 'In my family, healing was never something you learned from a textbook. It was passed down through touch, through presence, through care.',
  quoteAttribution: 'Destiny, Founder of Kizmet',
  bioTitle: 'My Roots',
  credentials: [
    'Licensed Massage Therapist',
    'Third-Generation Healer',
    'Deep Tissue Certified',
    'Swedish Massage Trained',
    'Prenatal Massage Certified',
  ],
  bioParagraphs: [
    "Healing has always been the family business. My grandmother was the person everyone in our community called when their backs went out or their shoulders seized up. My mother inherited those same intuitive hands. I spent my childhood learning by watching—absorbing techniques that no school could teach.",
    "When I decided to make this my profession, formal training gave me the language and anatomy to understand what my hands already knew. The Pacific Northwest School of Massage helped me bridge generations of folk wisdom with evidence-based practice.",
    "Kizmet is the culmination of that journey—a place where heritage meets technique, where the old ways inform the new. Every session carries the weight of my grandmother's knowledge and the precision of modern therapeutic methods.",
  ],
  journeyTitle: 'What a Session Looks Like',
  journeyIntro: 'No two bodies are the same, but every session follows a rhythm that honors both tradition and your individual needs.',
  journeySteps: [
    { _key: 'step1', title: 'We Connect', description: "I want to hear what brought you in—not just the pain, but the life around it. Then my hands find what words sometimes can't." },
    { _key: 'step2', title: 'We Work', description: 'Drawing from deep tissue, Swedish, and techniques passed down through my family—whatever serves you best.' },
    { _key: 'step3', title: 'You Leave Transformed', description: 'Not just relaxed. More aware of your body, with tools to continue the work at home.' },
  ],
  ctaHeadline: 'Ready to Begin Your Journey?',
  ctaButtonText: 'Book Your Session',
}

const policiesPage = {
  _type: 'policiesPage',
  _id: 'policiesPage',
  pageTitle: 'Policies',
  pageDescription: 'Please review the following policies before booking your appointment.',
  policies: [
    {
      _key: 'policy1',
      title: 'Cancellation Policy',
      items: [
        '24-hour notice required for cancellations',
        'Late cancellations may be charged 50% of service fee',
        'No-shows will be charged the full service fee',
      ],
    },
    {
      _key: 'policy2',
      title: 'Arrival',
      items: [
        'Please arrive 10 minutes before your appointment',
        'Late arrivals may result in shortened session time',
      ],
    },
    {
      _key: 'policy3',
      title: 'Payment',
      items: [
        'Payment is due at time of service',
        'Cash, credit cards, and HSA/FSA cards accepted',
      ],
    },
    {
      _key: 'policy4',
      title: 'Health & Safety',
      items: [
        'Please reschedule if you are feeling unwell',
        'Inform your therapist of any medical conditions or injuries',
      ],
    },
  ],
}

const bookPage = {
  _type: 'bookPage',
  _id: 'bookPage',
  eyebrow: 'Schedule',
  headline: 'Book Your Session',
  description: 'Select a service and preferred time to begin your wellness journey.',
}

const footerSettings = {
  _type: 'footerSettings',
  _id: 'footerSettings',
  brandDescription: 'Therapeutic massage in Port Angeles, helping you reconnect with your body and find balance.',
  therapistName: 'Destiny Pugh, LMT',
}

const services = [
  {
    _type: 'service',
    name: '30 Minute Session',
    slug: { _type: 'slug', current: '30-minute-session' },
    duration: '30 min',
    price: '$60',
    description: "A focused session perfect for targeting a specific area of concern. Great for a quick tune-up or when you're short on time.",
    featured: true,
    order: 1,
  },
  {
    _type: 'service',
    name: '60 Minute Session',
    slug: { _type: 'slug', current: '60-minute-session' },
    duration: '60 min',
    price: '$100',
    description: 'The most popular choice. Enough time for a full-body massage or to thoroughly address multiple areas of tension and discomfort.',
    featured: true,
    order: 2,
  },
  {
    _type: 'service',
    name: '90 Minute Session',
    slug: { _type: 'slug', current: '90-minute-session' },
    duration: '90 min',
    price: '$145',
    description: 'The ultimate relaxation experience. Allows time for comprehensive full-body work with extra attention to problem areas.',
    featured: true,
    order: 3,
  },
]

async function migrate() {
  console.log('Starting content migration...\n')

  // Create singletons
  const singletons = [
    siteSettings,
    homepageSettings,
    aboutPage,
    policiesPage,
    bookPage,
    footerSettings,
  ]

  for (const doc of singletons) {
    try {
      await client.createOrReplace(doc)
      console.log(`✓ Created ${doc._type}`)
    } catch (error) {
      console.error(`✗ Failed to create ${doc._type}:`, error)
    }
  }

  // Create services
  console.log('\nCreating services...')
  for (const service of services) {
    try {
      // Delete existing services with same slug first to avoid duplicates
      const existing = await client.fetch(
        `*[_type == "service" && slug.current == $slug][0]._id`,
        { slug: service.slug.current }
      )
      if (existing) {
        await client.delete(existing)
      }
      await client.create(service)
      console.log(`✓ Created service: ${service.name}`)
    } catch (error) {
      console.error(`✗ Failed to create service ${service.name}:`, error)
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('\nNext steps:')
  console.log('1. Review content in Sanity Studio at /studio')
  console.log('2. Upload images manually (hero, about page)')
  console.log('3. Update placeholder contact info with real values')
}

migrate().catch(console.error)
