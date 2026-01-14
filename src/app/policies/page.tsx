import type { Metadata } from 'next'
import PoliciesContent from '@/page-content/Policies'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Review our booking, cancellation, and session policies for Kizmet Massage & Wellness.',
}

export default function PoliciesPage() {
  return <PoliciesContent />
}
