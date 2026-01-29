import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  fieldsets: [
    { name: 'content', title: 'Content' },
    { name: 'sectionLabels', title: 'Section Labels' },
    { name: 'legal', title: 'Legal' },
  ],
  fields: [
    defineField({
      name: 'brandDescription',
      title: 'Brand Description',
      type: 'text',
      rows: 2,
      fieldset: 'content',
      description: 'Short description displayed in the footer',
    }),
    defineField({
      name: 'therapistName',
      title: 'Therapist Name',
      type: 'string',
      fieldset: 'content',
      description: 'Name with credentials (e.g., "Destiny Pugh, LMT")',
    }),
    defineField({
      name: 'quickLinksHeading',
      title: 'Quick Links Heading',
      type: 'string',
      fieldset: 'sectionLabels',
      initialValue: 'Quick Links',
      description: 'Heading for the quick links section',
    }),
    defineField({
      name: 'locationHeading',
      title: 'Location Heading',
      type: 'string',
      fieldset: 'sectionLabels',
      initialValue: 'Location',
      description: 'Heading for the address section',
    }),
    defineField({
      name: 'therapistHeading',
      title: 'Therapist Section Heading',
      type: 'string',
      fieldset: 'sectionLabels',
      initialValue: 'Your Therapist',
      description: 'Heading for the therapist section',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      fieldset: 'legal',
      initialValue: '© {year} Kizmet Massage. All rights reserved.',
      description: 'Copyright text. Use {year} for current year.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer Settings' }
    },
  },
})
