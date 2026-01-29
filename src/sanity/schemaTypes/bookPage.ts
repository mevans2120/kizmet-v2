import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'bookPage',
  title: 'Book Page',
  type: 'document',
  fieldsets: [
    { name: 'header', title: 'Page Header' },
    { name: 'booking', title: 'Booking Section' },
    { name: 'contact', title: 'Contact Labels' },
    { name: 'policies', title: 'Policy Preview' },
    { name: 'seo', title: 'SEO Settings' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      fieldset: 'header',
      description: 'Small text above the headline (e.g., "Schedule")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      fieldset: 'header',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      fieldset: 'header',
      description: 'Text below the headline',
    }),

    // Booking Section
    defineField({
      name: 'sessionSelectorLabel',
      title: 'Session Selector Label',
      type: 'string',
      fieldset: 'booking',
      initialValue: 'Select your session:',
      description: 'Label above the session selector',
    }),

    // Contact Labels
    defineField({
      name: 'callLabel',
      title: 'Call Label',
      type: 'string',
      fieldset: 'contact',
      initialValue: 'Call',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email Label',
      type: 'string',
      fieldset: 'contact',
      initialValue: 'Email',
    }),
    defineField({
      name: 'locationLabel',
      title: 'Location Label',
      type: 'string',
      fieldset: 'contact',
      initialValue: 'Location',
    }),

    // Policy Preview
    defineField({
      name: 'policiesHeading',
      title: 'Policies Section Heading',
      type: 'string',
      fieldset: 'policies',
      initialValue: 'Before Your Visit',
      description: 'Heading for the policies preview section',
    }),
    defineField({
      name: 'viewPoliciesLinkText',
      title: 'View Policies Link Text',
      type: 'string',
      fieldset: 'policies',
      initialValue: 'View All Policies',
    }),
    defineField({
      name: 'policyPreviews',
      title: 'Policy Previews',
      type: 'array',
      fieldset: 'policies',
      description: 'Quick policy reminders (3 recommended)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'summary' },
          },
        },
      ],
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
      return { title: 'Book Page' }
    },
  },
})
