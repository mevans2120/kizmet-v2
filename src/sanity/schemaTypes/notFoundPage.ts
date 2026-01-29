import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: '404',
      description: 'Large heading text (typically "404")',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      initialValue: 'Page not found',
      description: 'Message shown below the heading',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Return Home',
      description: 'Text for the return home button',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      initialValue: '/',
      description: 'URL for the button (defaults to home)',
    }),
  ],
  preview: {
    prepare() {
      return { title: '404 Page' }
    },
  },
})
