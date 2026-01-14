import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'brandDescription',
      title: 'Brand Description',
      type: 'text',
      rows: 2,
      description: 'Short description displayed in the footer',
    }),
    defineField({
      name: 'therapistName',
      title: 'Therapist Name',
      type: 'string',
      description: 'Name with credentials (e.g., "Destiny Pugh, LMT")',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer Settings' }
    },
  },
})
