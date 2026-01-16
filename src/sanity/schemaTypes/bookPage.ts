import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'bookPage',
  title: 'Book Page',
  type: 'document',
  fieldsets: [
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      fieldset: 'seo',
      description: 'Custom SEO for this page (overrides site defaults)',
    }),

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
