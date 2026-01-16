import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'branding', title: 'Branding & Identity' },
    { name: 'contact', title: 'Contact Information' },
    { name: 'seo', title: 'SEO & Social Media' },
    { name: 'business', title: 'Business Information (Google)' },
  ],
  fields: [
    // Branding
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      fieldset: 'branding',
      description: 'The business name displayed in navigation and footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      fieldset: 'branding',
      description: 'Short tagline under the brand name',
    }),

    // Contact
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      fieldset: 'contact',
      description: 'Business phone number',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      fieldset: 'contact',
      description: 'Business email address',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fieldset: 'contact',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({ name: 'state', title: 'State', type: 'string' }),
        defineField({ name: 'zip', title: 'ZIP Code', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'string',
      fieldset: 'contact',
      description: 'Link to booking page (internal like /book or external URL)',
    }),

    // SEO & Social Media
    defineField({
      name: 'seo',
      title: 'Default SEO Settings',
      type: 'object',
      fieldset: 'seo',
      description: 'Default values used when pages don\'t specify their own',
      fields: [
        defineField({
          name: 'siteUrl',
          title: 'Site URL',
          type: 'url',
          description: 'The canonical URL of your website (e.g., https://kizmetmassage.com)',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          description: 'Default title for search engines',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 2,
          description: 'Default description for search results',
        }),
        defineField({
          name: 'socialImage',
          title: 'Default Social Share Image',
          type: 'image',
          options: { hotspot: true },
          description: '1200x630px recommended for optimal social media display',
        }),
        defineField({
          name: 'twitterHandle',
          title: 'Twitter/X Handle',
          type: 'string',
          description: 'Without the @ symbol (e.g., kizmetmassage)',
        }),
        defineField({
          name: 'instagramHandle',
          title: 'Instagram Handle',
          type: 'string',
          description: 'Without the @ symbol',
        }),
        defineField({
          name: 'facebookUrl',
          title: 'Facebook Page URL',
          type: 'url',
        }),
      ],
    }),

    // Business Information for Google
    defineField({
      name: 'businessInfo',
      title: 'Business Information',
      type: 'object',
      fieldset: 'business',
      description: 'Used for Google Business Profile and structured data',
      fields: [
        defineField({
          name: 'businessType',
          title: 'Business Type',
          type: 'string',
          options: {
            list: [
              { title: 'Health & Beauty Business', value: 'HealthAndBeautyBusiness' },
              { title: 'Day Spa', value: 'DaySpa' },
              { title: 'Local Business', value: 'LocalBusiness' },
            ],
          },
          initialValue: 'HealthAndBeautyBusiness',
        }),
        defineField({
          name: 'priceRange',
          title: 'Price Range',
          type: 'string',
          options: {
            list: [
              { title: '$', value: '$' },
              { title: '$$', value: '$$' },
              { title: '$$$', value: '$$$' },
            ],
          },
          initialValue: '$$',
        }),
        defineField({
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'days',
                  title: 'Days',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      { title: 'Monday', value: 'Monday' },
                      { title: 'Tuesday', value: 'Tuesday' },
                      { title: 'Wednesday', value: 'Wednesday' },
                      { title: 'Thursday', value: 'Thursday' },
                      { title: 'Friday', value: 'Friday' },
                      { title: 'Saturday', value: 'Saturday' },
                      { title: 'Sunday', value: 'Sunday' },
                    ],
                  },
                }),
                defineField({ name: 'opens', title: 'Opens', type: 'string', description: 'e.g., 09:00' }),
                defineField({ name: 'closes', title: 'Closes', type: 'string', description: 'e.g., 17:00' }),
              ],
              preview: {
                select: { days: 'days', opens: 'opens', closes: 'closes' },
                prepare({ days, opens, closes }) {
                  return {
                    title: days?.join(', ') || 'Days',
                    subtitle: `${opens || '?'} - ${closes || '?'}`,
                  }
                },
              },
            },
          ],
        }),
        defineField({
          name: 'geoCoordinates',
          title: 'Location Coordinates',
          type: 'object',
          description: 'For Google Maps and local SEO',
          fields: [
            defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
            defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
          ],
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
          description: 'Link to your Google Maps listing',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
