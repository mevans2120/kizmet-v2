import type { Metadata } from 'next'
import BookContent from '@/page-content/Book'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your massage therapy session at Kizmet Massage & Wellness.',
}

export default function BookPage() {
  return <BookContent />
}
