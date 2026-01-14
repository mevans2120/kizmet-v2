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
  servicesHeading: 'Our Services',
  servicesDescription: 'Therapeutic massage tailored to your needs',
  ctaHeadline: "It's Time to Feel Good",
  ctaDescription: 'Book your first session today and experience the transformative power of therapeutic massage.',
  ctaButtonText: 'Book Your Appointment',
}

const aboutPage = {
  _type: 'aboutPage',
  _id: 'aboutPage',
  eyebrow: 'About',
  headline: 'Destiny Pugh',
  intro: 'Licensed Massage Therapist dedicated to helping you feel your best.',
  quoteText: 'Touch is the first sense we develop and the last one we lose.',
  quoteAttribution: 'Tiffany Field',
  bioTitle: 'Your Therapist',
  credentials: [
    'Licensed Massage Therapist (WA License #MA12345)',
    'Graduate of Port Angeles School of Massage',
    'Specialized training in Deep Tissue and Swedish Massage',
  ],
  bioParagraphs: [
    'With over 5 years of experience, I bring a holistic approach to massage therapy that addresses both physical tension and overall wellness.',
    'My practice focuses on creating a calm, healing environment where you can truly relax and let go of stress.',
  ],
  journeyTitle: 'Your Session Journey',
  journeyIntro: 'What to expect during your visit',
  journeySteps: [
    { _key: 'step1', title: 'Consultation', description: 'We discuss your needs and any areas of concern.' },
    { _key: 'step2', title: 'Treatment', description: 'Customized massage focused on your specific goals.' },
    { _key: 'step3', title: 'Aftercare', description: 'Recommendations for maintaining the benefits of your session.' },
  ],
  ctaHeadline: 'Ready to Feel Better?',
  ctaButtonText: 'Book a Session',
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
    description: 'A focused session targeting specific areas of tension. Perfect for a quick reset or targeting problem areas.',
    featured: true,
    order: 1,
  },
  {
    _type: 'service',
    name: '60 Minute Session',
    slug: { _type: 'slug', current: '60-minute-session' },
    duration: '60 min',
    price: '$100',
    description: 'Our most popular option. A full-body massage with extra attention to areas of concern.',
    featured: true,
    order: 2,
  },
  {
    _type: 'service',
    name: '90 Minute Session',
    slug: { _type: 'slug', current: '90-minute-session' },
    duration: '90 min',
    price: '$145',
    description: 'The ultimate relaxation experience. Extended time for comprehensive bodywork and deep relaxation.',
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
