import type { Metadata } from 'next'
import ServicesContent from '@/page-content/Services'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'Explore our massage therapy services: 30, 60, and 90-minute sessions tailored to your wellness needs.',
}

export default function ServicesPage() {
  return <ServicesContent />
}
