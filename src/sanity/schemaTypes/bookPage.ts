import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'bookPage',
  title: 'Book Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small text above the headline (e.g., "Schedule")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Text below the headline',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Book Page' }
    },
  },
})
