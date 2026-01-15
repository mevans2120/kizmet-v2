# Plan: Consolidate About Preview into Homepage Settings

**Date:** 2026-01-14

## Objective

Move the About Preview fields from a separate `aboutPreview` singleton into the existing `homepageSettings` singleton, so all homepage content is managed in one place in Sanity Studio.

---

## Current State

- `homepageSettings` — Hero, Services section, CTA section
- `aboutPreview` — Separate singleton with quote fields

## Target State

- `homepageSettings` — Hero, Services section, **About Preview section**, CTA section
- `aboutPreview` — Deleted

---

## Phase 1: Update Sanity Schema

### Task 1.1: Add About Preview fields to homepageSettings

**File:** `src/sanity/schemaTypes/homepageSettings.ts`

Add new fieldset and fields:

```typescript
defineField({
  name: 'aboutPreviewEyebrow',
  title: 'Eyebrow Text',
  type: 'string',
  group: 'aboutPreview',
  initialValue: 'Meet Your Therapist',
}),
defineField({
  name: 'aboutPreviewQuote',
  title: 'Quote',
  type: 'text',
  rows: 3,
  group: 'aboutPreview',
}),
defineField({
  name: 'aboutPreviewAttributionName',
  title: 'Attribution Name',
  type: 'string',
  group: 'aboutPreview',
  initialValue: 'Destiny',
}),
defineField({
  name: 'aboutPreviewAttributionTitle',
  title: 'Attribution Title',
  type: 'string',
  group: 'aboutPreview',
  initialValue: 'Third-Generation Healer',
}),
defineField({
  name: 'aboutPreviewCtaText',
  title: 'CTA Button Text',
  type: 'string',
  group: 'aboutPreview',
  initialValue: 'Read My Story',
}),
defineField({
  name: 'aboutPreviewCtaLink',
  title: 'CTA Link',
  type: 'string',
  group: 'aboutPreview',
  initialValue: '/about',
}),
```

Add group definition:
```typescript
groups: [
  { name: 'hero', title: 'Hero Section' },
  { name: 'services', title: 'Services Section' },
  { name: 'aboutPreview', title: 'About Preview Section' },
  { name: 'cta', title: 'CTA Section' },
],
```

---

## Phase 2: Migration Script

### Task 2.1: Create migration script to move data

**File:** `scripts/migrate-about-preview-to-homepage.ts`

```typescript
import { createClient } from '@sanity/client'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function migrate() {
  // 1. Fetch existing aboutPreview content
  const aboutPreview = await client.fetch(`*[_type == "aboutPreview"][0]`)

  if (!aboutPreview) {
    console.log('No aboutPreview found, using defaults')
  }

  // 2. Update homepageSettings with aboutPreview fields
  await client
    .patch('homepageSettings')
    .set({
      aboutPreviewEyebrow: aboutPreview?.eyebrow || 'Meet Your Therapist',
      aboutPreviewQuote: aboutPreview?.quote || 'In my family, healing was never something you learned from a textbook. It was passed down through touch, through presence, through care.',
      aboutPreviewAttributionName: aboutPreview?.attributionName || 'Destiny',
      aboutPreviewAttributionTitle: aboutPreview?.attributionTitle || 'Third-Generation Healer',
      aboutPreviewCtaText: aboutPreview?.ctaText || 'Read My Story',
      aboutPreviewCtaLink: aboutPreview?.ctaLink || '/about',
    })
    .commit()

  console.log('✓ Migrated aboutPreview fields to homepageSettings')

  // 3. Delete the old aboutPreview document
  if (aboutPreview?._id) {
    await client.delete(aboutPreview._id)
    console.log('✓ Deleted old aboutPreview document')
  }
}

migrate().catch(console.error)
```

### Task 2.2: Run migration

```bash
npx tsx scripts/migrate-about-preview-to-homepage.ts
```

---

## Phase 3: Clean Up Schema Files

### Task 3.1: Delete aboutPreview schema

**Delete:** `src/sanity/schemaTypes/aboutPreview.ts`

### Task 3.2: Remove from schema index

**File:** `src/sanity/schemaTypes/index.ts`

Remove:
```typescript
import aboutPreview from './aboutPreview'
// and remove from schemaTypes array
```

### Task 3.3: Remove from desk structure

**File:** `src/sanity/deskStructure.ts`

Remove:
```typescript
'aboutPreview' from singletonTypes
singletonItem(S, 'aboutPreview', 'About Preview (Homepage)')
```

---

## Phase 4: Update Frontend

### Task 4.1: Remove ABOUT_PREVIEW_QUERY

**File:** `src/sanity/lib/queries.ts`

Delete:
```typescript
export const ABOUT_PREVIEW_QUERY = `*[_type == "aboutPreview"][0]`
```

### Task 4.2: Update homepage data fetching

**File:** `src/app/page.tsx`

Remove `aboutPreview` from Promise.all and pass homepage data to AboutPreview:

```typescript
// Before
<AboutPreview data={aboutPreview} />

// After
<AboutPreview data={homepage} />
```

### Task 4.3: Update AboutPreview component props

**File:** `src/components/AboutPreview.tsx`

Update to read from homepage fields:

```typescript
const content = {
  eyebrow: data?.aboutPreviewEyebrow || fallbackData.eyebrow,
  quote: data?.aboutPreviewQuote || fallbackData.quote,
  attributionName: data?.aboutPreviewAttributionName || fallbackData.attributionName,
  attributionTitle: data?.aboutPreviewAttributionTitle || fallbackData.attributionTitle,
  ctaText: data?.aboutPreviewCtaText || fallbackData.ctaText,
  ctaLink: data?.aboutPreviewCtaLink || fallbackData.ctaLink,
};
```

---

## Phase 5: Delete Migration Script

### Task 5.1: Delete old migration script

**Delete:** `scripts/migrate-about-preview.ts`

---

## Implementation Order

1. Update `homepageSettings.ts` schema with new fields + groups
2. Create and run migration script
3. Delete `aboutPreview.ts` schema
4. Update `schemaTypes/index.ts`
5. Update `deskStructure.ts`
6. Remove `ABOUT_PREVIEW_QUERY` from queries
7. Update `page.tsx` to pass `homepage` instead of `aboutPreview`
8. Update `AboutPreview.tsx` to read new field names
9. Delete old migration scripts
10. Test in browser and Sanity Studio

---

## Files to Modify

| File | Action |
|------|--------|
| `src/sanity/schemaTypes/homepageSettings.ts` | Add fields + groups |
| `scripts/migrate-about-preview-to-homepage.ts` | Create |
| `src/sanity/schemaTypes/aboutPreview.ts` | Delete |
| `src/sanity/schemaTypes/index.ts` | Remove import |
| `src/sanity/deskStructure.ts` | Remove singleton |
| `src/sanity/lib/queries.ts` | Remove query |
| `src/app/page.tsx` | Update data passing |
| `src/components/AboutPreview.tsx` | Update field names |
| `scripts/migrate-about-preview.ts` | Delete |

---

## Verification

- [ ] Homepage renders correctly with About Preview
- [ ] Sanity Studio shows About Preview fields under Homepage
- [ ] No errors in console
- [ ] Old `aboutPreview` document is deleted
- [ ] Schema changes deploy without errors
