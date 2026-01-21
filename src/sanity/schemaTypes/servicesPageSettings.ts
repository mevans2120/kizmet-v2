import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicesPageSettings',
  title: 'Services Page',
  type: 'document',
  fieldsets: [
    { name: 'header', title: 'Page Header' },
    { name: 'content', title: 'Content Section' },
    { name: 'cta', title: 'Call to Action' },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    // Header Section
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'header',
      initialValue: 'What I Offer',
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      fieldset: 'header',
      initialValue: 'Services & Pricing',
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      fieldset: 'header',
      rows: 2,
      initialValue: 'Every massage is customized to your individual needs. Let me know your goals and I\'ll create the perfect treatment for you.',
    }),

    // Content Section
    defineField({
      name: 'sectionTitle',
      title: 'Services Section Title',
      type: 'string',
      fieldset: 'content',
      initialValue: 'Massage Sessions',
    }),
    defineField({
      name: 'bookButtonText',
      title: 'Book Button Text',
      type: 'string',
      fieldset: 'content',
      initialValue: 'Book',
      description: 'Text for the book button on each service card',
    }),

    // CTA Section
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading',
      type: 'string',
      fieldset: 'cta',
      initialValue: 'Ready to Feel Your Best?',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      fieldset: 'cta',
      rows: 2,
      initialValue: 'Not sure which session length is right for you? I\'m happy to help you choose.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      fieldset: 'cta',
      initialValue: 'Book Your Session',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      fieldset: 'cta',
      initialValue: '/book',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      fieldset: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Services Page Settings' }
    },
  },
})
