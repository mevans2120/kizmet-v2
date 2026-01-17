import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'e.g., "Sarah M."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorLocation',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Port Angeles, WA"',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorLocation',
    },
  },
})
