# Plan: Services Page CMS Editable Content — Kizmet Booking Site

**Date:** 2026-01-20
**Tags:** sanity, cms, services, content-management

## Objective

Make all hardcoded text on the Services page (`/services`) editable through Sanity CMS, giving the site owner full control over page content without code changes.

## Background

The Services page currently has service data (name, price, description, techniques, bestFor) coming from Sanity, but structural text elements are hardcoded in the React component. This creates inconsistency—some content requires a developer to change while other content can be edited in the CMS.

**Currently Hardcoded:**
- Page eyebrow: "What I Offer"
- Page title: "Services & Pricing"
- Page description: "Every massage is customized to your individual needs..."
- Section title: "Massage Sessions"
- CTA heading: "Ready to Feel Your Best?"
- CTA description: "Not sure which session length is right for you?..."
- CTA button text: "Book Your Session"
- Service card button text: "Book"

## Requirements

### Must Have
- [ ] Create `servicesPageSettings` Sanity schema with all editable fields
- [ ] Add schema to Sanity configuration
- [ ] Create Sanity query to fetch services page settings
- [ ] Update Services page component to accept and use CMS content
- [ ] Provide sensible fallback values if CMS data unavailable
- [ ] Add services page settings to Sanity desk structure as singleton

### Nice to Have
- [ ] Add SEO fields specific to services page
- [ ] Add ability to customize the section title ("Massage Sessions" could be renamed)
- [ ] Add ability to hide/show the CTA section

## Approach

### Step 1: Create Sanity Schema

Create `src/sanity/schemaTypes/servicesPageSettings.ts` following the pattern of `homepageSettings.ts`:

```typescript
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
```

### Step 2: Register Schema

Update `src/sanity/schemaTypes/index.ts` to include the new schema:

```typescript
import servicesPageSettings from './servicesPageSettings'
// ... other imports

export const schemaTypes = [
  // ... existing schemas
  servicesPageSettings,
]
```

### Step 3: Add to Desk Structure

Update `src/sanity/deskStructure.ts` to add as singleton alongside other page settings:

```typescript
S.listItem()
  .title('Services Page')
  .child(
    S.document()
      .schemaType('servicesPageSettings')
      .documentId('servicesPageSettings')
  ),
```

### Step 4: Create Sanity Query

Add to `src/sanity/lib/queries.ts`:

```typescript
export const SERVICES_PAGE_SETTINGS_QUERY = groq`
  *[_type == "servicesPageSettings"][0] {
    eyebrow,
    title,
    description,
    sectionTitle,
    bookButtonText,
    ctaHeading,
    ctaDescription,
    ctaButtonText,
    ctaButtonLink,
    seo
  }
`
```

### Step 5: Update Services Page

Update `src/app/services/page.tsx` to fetch and pass settings:

```typescript
const servicesPageSettings = await sanityFetch({
  query: SERVICES_PAGE_SETTINGS_QUERY
})

return (
  <Services
    services={services}
    servicesPageSettings={servicesPageSettings}
    siteSettings={siteSettings}
    footerSettings={footerSettings}
  />
)
```

### Step 6: Update Services Component

Update `src/page-content/Services.tsx` to use CMS content with fallbacks:

```typescript
interface ServicesPageSettings {
  eyebrow?: string;
  title?: string;
  description?: string;
  sectionTitle?: string;
  bookButtonText?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

// In component, use with fallbacks:
const eyebrow = servicesPageSettings?.eyebrow || "What I Offer";
const title = servicesPageSettings?.title || "Services & Pricing";
// etc.
```

## Files to Modify

| File | Change |
|------|--------|
| `src/sanity/schemaTypes/servicesPageSettings.ts` | **Create** - New schema |
| `src/sanity/schemaTypes/index.ts` | Add schema import/export |
| `src/sanity/deskStructure.ts` | Add singleton to desk |
| `src/sanity/lib/queries.ts` | Add query |
| `src/app/services/page.tsx` | Fetch settings, pass to component |
| `src/page-content/Services.tsx` | Accept props, replace hardcoded text |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing page if CMS empty | Low | High | Provide fallback values for all fields |
| Schema migration issues | Low | Medium | Use `initialValue` for defaults, test in dev first |
| Inconsistent content between environments | Low | Low | Document that content must be added in production Sanity |

## Success Criteria

- [ ] All text on Services page is editable in Sanity Studio
- [ ] Page renders correctly with no CMS data (fallbacks work)
- [ ] Page renders correctly with partial CMS data
- [ ] Services Page Settings appears in Sanity Studio sidebar
- [ ] Changes in Sanity reflect on the live page

## Open Questions

- Should the "Techniques" and "Best For" labels also be editable, or are they structural enough to remain hardcoded?
- Should there be an option to hide the CTA section entirely?

## Related Research

- [Sanity CMS Implementation](../research/RESEARCH_2026-01-14_sanity-cms-implementation.md)
- [Sanity SEO Metadata](../research/RESEARCH_2026-01-15_sanity-seo-metadata.md)
- [Services Sanity Audit](../SERVICES_SANITY_AUDIT.md)
