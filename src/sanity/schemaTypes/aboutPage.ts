import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'quote', title: 'Quote Section' },
    { name: 'bio', title: 'Bio Section' },
    { name: 'journey', title: 'Session Journey' },
    { name: 'cta', title: 'Call to Action' },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    // Hero Section
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'hero',
      description: 'Small text above the headline (e.g., "About")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      fieldset: 'hero',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      fieldset: 'hero',
      options: { hotspot: true },
    }),

    // Quote Section
    defineField({
      name: 'quoteText',
      title: 'Quote',
      type: 'text',
      fieldset: 'quote',
      rows: 3,
    }),
    defineField({
      name: 'quoteAttribution',
      title: 'Attribution',
      type: 'string',
      fieldset: 'quote',
      description: 'Who said the quote',
    }),

    // Bio Section
    defineField({
      name: 'bioTitle',
      title: 'Bio Section Title',
      type: 'string',
      fieldset: 'bio',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      fieldset: 'bio',
      of: [{ type: 'string' }],
      description: 'List of credentials, certifications, etc.',
    }),
    defineField({
      name: 'bioParagraphs',
      title: 'Bio Paragraphs',
      type: 'array',
      fieldset: 'bio',
      of: [{ type: 'text' }],
      description: 'Bio text paragraphs',
    }),

    // Session Journey
    defineField({
      name: 'journeyTitle',
      title: 'Journey Section Title',
      type: 'string',
      fieldset: 'journey',
    }),
    defineField({
      name: 'journeyIntro',
      title: 'Journey Introduction',
      type: 'text',
      fieldset: 'journey',
      rows: 2,
    }),
    defineField({
      name: 'journeySteps',
      title: 'Journey Steps',
      type: 'array',
      fieldset: 'journey',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),

    // CTA Section
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      type: 'string',
      fieldset: 'cta',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      fieldset: 'cta',
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
      return { title: 'About Page' }
    },
  },
})
