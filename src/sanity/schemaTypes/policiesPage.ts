import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'policiesPage',
  title: 'Policies Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      description: 'Introductory text at the top of the page',
    }),
    defineField({
      name: 'policies',
      title: 'Policies',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Policy Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Policy Items',
              type: 'array',
              of: [{ type: 'text' }],
              description: 'Individual policy points',
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Policies Page' }
    },
  },
})
