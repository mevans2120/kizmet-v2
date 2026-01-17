import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepageSettings',
  title: 'Homepage',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'services', title: 'Services Preview' },
    { name: 'aboutPreview', title: 'About Preview Section' },
    { name: 'testimonials', title: 'Testimonials Section' },
    { name: 'cta', title: 'Call to Action Section' },
    { name: 'seo', title: 'SEO Settings' },
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
    defineField({
      name: 'heroCtaLink',
      title: 'CTA Button Link',
      type: 'string',
      fieldset: 'hero',
      description: 'URL for the main call-to-action button',
      initialValue: '/book',
    }),
    defineField({
      name: 'heroSecondaryCta',
      title: 'Secondary Button Text',
      type: 'string',
      fieldset: 'hero',
      description: 'Text for the secondary button',
      initialValue: 'View Services',
    }),
    defineField({
      name: 'heroSecondaryCtaLink',
      title: 'Secondary Button Link',
      type: 'string',
      fieldset: 'hero',
      description: 'URL for the secondary button',
      initialValue: '/services',
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

    // About Preview Section
    defineField({
      name: 'aboutPreviewImage',
      title: 'Photo',
      type: 'image',
      fieldset: 'aboutPreview',
      options: { hotspot: true },
      description: 'Portrait photo of Destiny (4:5 ratio recommended)',
    }),
    defineField({
      name: 'aboutPreviewEyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'aboutPreview',
      initialValue: 'Meet Your Therapist',
    }),
    defineField({
      name: 'aboutPreviewQuote',
      title: 'Quote',
      type: 'text',
      fieldset: 'aboutPreview',
      rows: 3,
      description: 'The main quote to display',
    }),
    defineField({
      name: 'aboutPreviewAttributionName',
      title: 'Attribution Name',
      type: 'string',
      fieldset: 'aboutPreview',
      initialValue: 'Destiny',
    }),
    defineField({
      name: 'aboutPreviewAttributionTitle',
      title: 'Attribution Title',
      type: 'string',
      fieldset: 'aboutPreview',
      initialValue: 'Third-Generation Healer',
    }),
    defineField({
      name: 'aboutPreviewCtaText',
      title: 'CTA Button Text',
      type: 'string',
      fieldset: 'aboutPreview',
      initialValue: 'Read My Story',
    }),
    defineField({
      name: 'aboutPreviewCtaLink',
      title: 'CTA Link',
      type: 'string',
      fieldset: 'aboutPreview',
      initialValue: '/about',
    }),

    // Testimonials Section
    defineField({
      name: 'testimonialsEyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'testimonials',
      initialValue: 'Kind Words',
    }),
    defineField({
      name: 'testimonialsTitle',
      title: 'Section Title',
      type: 'string',
      fieldset: 'testimonials',
      initialValue: 'What Clients Say',
    }),
    defineField({
      name: 'testimonialsSubtitle',
      title: 'Subtitle',
      type: 'text',
      fieldset: 'testimonials',
      rows: 2,
      initialValue: 'Real experiences from people who\'ve found relief and relaxation',
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
    defineField({
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'string',
      fieldset: 'cta',
      description: 'URL for the call-to-action button',
      initialValue: '/book',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      fieldset: 'seo',
      description: 'Custom SEO for homepage (overrides site defaults)',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
