import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'policiesPage',
  title: 'Policies Page',
  type: 'document',
  fieldsets: [
    { name: 'header', title: 'Page Header' },
    { name: 'questions', title: 'Questions Section' },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'header',
      initialValue: 'Important Information',
      description: 'Small text above the page title',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      fieldset: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageDescription',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      fieldset: 'header',
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

    // Questions Section
    defineField({
      name: 'questionsHeading',
      title: 'Questions Heading',
      type: 'string',
      fieldset: 'questions',
      initialValue: 'Questions?',
    }),
    defineField({
      name: 'questionsDescription',
      title: 'Questions Description',
      type: 'text',
      rows: 2,
      fieldset: 'questions',
      initialValue:
        "If you have any questions about our policies or need to discuss special circumstances, please don't hesitate to reach out.",
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      fieldset: 'seo',
      description: 'Custom SEO for this page (overrides site defaults)',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Policies Page' }
    },
  },
})
