import type { Metadata } from 'next'
import AboutContent from '@/page-content/About'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Destiny, a third-generation healer bringing family wisdom and modern therapeutic techniques to Kizmet Massage & Wellness.',
}

export default function AboutPage() {
  return <AboutContent />
}
