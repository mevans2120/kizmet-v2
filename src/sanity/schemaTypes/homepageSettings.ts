import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepageSettings',
  title: 'Homepage',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'services', title: 'Services Preview' },
    { name: 'cta', title: 'Call to Action Section' },
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      fieldset: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      fieldset: 'hero',
      description: 'Main headline text',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Subheadline',
      type: 'text',
      fieldset: 'hero',
      rows: 2,
      description: 'Supporting text below the headline',
    }),
    defineField({
      name: 'heroCta',
      title: 'CTA Button Text',
      type: 'string',
      fieldset: 'hero',
      description: 'Text for the main call-to-action button',
    }),

    // Services Preview
    defineField({
      name: 'servicesHeading',
      title: 'Services Heading',
      type: 'string',
      fieldset: 'services',
    }),
    defineField({
      name: 'servicesDescription',
      title: 'Services Description',
      type: 'text',
      fieldset: 'services',
      rows: 2,
    }),

    // CTA Section
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      fieldset: 'cta',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      fieldset: 'cta',
      rows: 2,
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      fieldset: 'cta',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
