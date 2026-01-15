# Plan: About Preview Component (Generational Timeline)

**Date:** 2026-01-14
**Design Reference:** `docs/design/about-preview-concepts-011426/about-preview-concepts.html` (Concept 3)

## Objective

Implement the Generational Timeline About Preview component on the homepage, with full Sanity CMS integration for content management.

---

## Overview

The component displays Destiny's heritage as a third-generation healer using a visual timeline:
- **Grandmother** → **Mother** → **Destiny**
- Eyebrow: "Three Generations of Healing"
- Headline: "A Legacy of Touch"
- CTA: "Discover Destiny's Story" → links to /about

---

## Phase 1: Sanity Schema

### Task 1.1: Create `aboutPreview` schema

**File:** `src/sanity/schemaTypes/aboutPreview.ts`

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPreview',
  title: 'About Preview (Homepage)',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      initialValue: 'Three Generations of Healing',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'A Legacy of Touch',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      initialValue: 'Healing wisdom passed down through generations',
    }),
    defineField({
      name: 'generations',
      title: 'Generations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label (e.g., "First Generation")', type: 'string' },
            { name: 'title', title: 'Title (e.g., "Grandmother")', type: 'string' },
            { name: 'description', title: 'Description', type: 'string' },
            { name: 'isCurrent', title: 'Is Current (Destiny)', type: 'boolean', initialValue: false },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: "Discover Destiny's Story",
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      initialValue: '/about',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'About Preview' }),
  },
})
```

### Task 1.2: Register schema in index

**File:** `src/sanity/schemaTypes/index.ts`

Add import and include in `schemaTypes` array:
```typescript
import aboutPreview from './aboutPreview'

export const schemaTypes = [
  // ... existing schemas
  aboutPreview,
]
```

### Task 1.3: Add to desk structure (optional)

**File:** `src/sanity/deskStructure.ts`

Add as singleton under "Pages" or "Homepage" section.

---

## Phase 2: Migration Script

### Task 2.1: Create migration script

**File:** `scripts/migrate-about-preview.ts`

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

const aboutPreview = {
  _type: 'aboutPreview',
  _id: 'aboutPreview',
  eyebrow: 'Three Generations of Healing',
  headline: 'A Legacy of Touch',
  subheadline: 'Healing wisdom passed down through generations',
  generations: [
    {
      _key: 'gen1',
      label: 'First Generation',
      title: 'Grandmother',
      description: 'The community healer everyone called when backs went out',
      isCurrent: false,
    },
    {
      _key: 'gen2',
      label: 'Second Generation',
      title: 'Mother',
      description: 'Inherited those same intuitive, healing hands',
      isCurrent: false,
    },
    {
      _key: 'gen3',
      label: 'Third Generation',
      title: 'Destiny',
      description: 'Heritage meets modern therapeutic technique',
      isCurrent: true,
    },
  ],
  ctaText: "Discover Destiny's Story",
  ctaLink: '/about',
}

async function migrate() {
  console.log('Creating About Preview content...')
  try {
    await client.createOrReplace(aboutPreview)
    console.log('✓ Created aboutPreview')
  } catch (error) {
    console.error('✗ Failed:', error)
  }
}

migrate()
```

### Task 2.2: Run migration

```bash
npx tsx scripts/migrate-about-preview.ts
```

---

## Phase 3: Add GROQ Query

### Task 3.1: Add query to queries file

**File:** `src/sanity/lib/queries.ts`

```typescript
export const ABOUT_PREVIEW_QUERY = `*[_type == "aboutPreview"][0]`
```

---

## Phase 4: React Component

### Task 4.1: Create AboutPreview component

**File:** `src/components/AboutPreview.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Generation {
  _key: string;
  label: string;
  title: string;
  description: string;
  isCurrent: boolean;
}

interface AboutPreviewProps {
  data?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    generations?: Generation[];
    ctaText?: string;
    ctaLink?: string;
  };
}

// Fallback content
const fallbackData = {
  eyebrow: 'Three Generations of Healing',
  headline: 'A Legacy of Touch',
  subheadline: 'Healing wisdom passed down through generations',
  generations: [
    { _key: 'gen1', label: 'First Generation', title: 'Grandmother', description: 'The community healer everyone called when backs went out', isCurrent: false },
    { _key: 'gen2', label: 'Second Generation', title: 'Mother', description: 'Inherited those same intuitive, healing hands', isCurrent: false },
    { _key: 'gen3', label: 'Third Generation', title: 'Destiny', description: 'Heritage meets modern therapeutic technique', isCurrent: true },
  ],
  ctaText: "Discover Destiny's Story",
  ctaLink: '/about',
};

const AboutPreview = ({ data }: AboutPreviewProps) => {
  const content = {
    eyebrow: data?.eyebrow || fallbackData.eyebrow,
    headline: data?.headline || fallbackData.headline,
    subheadline: data?.subheadline || fallbackData.subheadline,
    generations: data?.generations || fallbackData.generations,
    ctaText: data?.ctaText || fallbackData.ctaText,
    ctaLink: data?.ctaLink || fallbackData.ctaLink,
  };

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {content.eyebrow}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-3">
            {content.headline}
          </h2>
          <p className="font-body text-muted-foreground">
            {content.subheadline}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-12">
          {/* Connection line */}
          <div className="hidden md:block absolute top-9 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-sage-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {content.generations.map((gen, index) => (
              <div key={gen._key} className="text-center">
                {/* Icon circle */}
                <div
                  className={`w-[70px] h-[70px] rounded-full mx-auto mb-5 flex items-center justify-center relative z-10 ${
                    gen.isCurrent
                      ? 'bg-primary shadow-[0_0_0_8px_rgba(90,114,92,0.15)]'
                      : 'bg-background border-[3px] border-primary'
                  }`}
                >
                  <GenerationIcon index={index} isCurrent={gen.isCurrent} />
                </div>

                {/* Content */}
                <p className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {gen.label}
                </p>
                <h3 className={`font-heading text-2xl font-medium mb-2 ${gen.isCurrent ? 'text-primary' : 'text-foreground'}`}>
                  {gen.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
                  {gen.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" asChild>
            <Link href={content.ctaLink}>
              {content.ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Helper component for icons
const GenerationIcon = ({ index, isCurrent }: { index: number; isCurrent: boolean }) => {
  const colorClass = isCurrent ? 'text-primary-foreground' : 'text-primary';

  // Different icon for each generation
  const icons = [
    // Book icon for grandmother (wisdom/tradition)
    <svg key="book" className={`w-8 h-8 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>,
    // Heart icon for mother (love/nurturing)
    <svg key="heart" className={`w-8 h-8 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>,
    // Sparkles icon for Destiny (modern/magic)
    <svg key="sparkles" className={`w-8 h-8 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>,
  ];

  return icons[index] || icons[0];
};

export default AboutPreview;
```

---

## Phase 5: Homepage Integration

### Task 5.1: Update homepage to fetch and render

**File:** `src/app/page.tsx`

Add to imports:
```typescript
import { ABOUT_PREVIEW_QUERY } from '@/sanity/lib/queries'
import AboutPreview from '@/components/AboutPreview'
```

Add to data fetching:
```typescript
const [homepage, services, siteSettings, footerSettings, aboutPreview] = await Promise.all([
  client.fetch(HOMEPAGE_SETTINGS_QUERY),
  client.fetch(FEATURED_SERVICES_QUERY),
  client.fetch(SITE_SETTINGS_QUERY),
  client.fetch(FOOTER_SETTINGS_QUERY),
  client.fetch(ABOUT_PREVIEW_QUERY),
])
```

Add component between ServicesPreview and CTASection:
```tsx
<ServicesPreview services={services} data={homepage} />
<AboutPreview data={aboutPreview} />
<CTASection data={homepage} />
```

---

## Phase 6: Verification

### Task 6.1: Test locally
- [ ] Run `npm run dev`
- [ ] Verify component renders on homepage
- [ ] Verify Sanity Studio shows aboutPreview document
- [ ] Test CTA link goes to /about

### Task 6.2: Test Sanity editing
- [ ] Edit content in Studio
- [ ] Verify changes appear on frontend

---

## Implementation Order

1. **Phase 1** - Create Sanity schema
2. **Phase 2** - Run migration script
3. **Phase 3** - Add GROQ query
4. **Phase 4** - Create React component
5. **Phase 5** - Integrate into homepage
6. **Phase 6** - Test and verify

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/sanity/schemaTypes/aboutPreview.ts` | Create |
| `src/sanity/schemaTypes/index.ts` | Modify |
| `src/sanity/deskStructure.ts` | Modify |
| `scripts/migrate-about-preview.ts` | Create |
| `src/sanity/lib/queries.ts` | Modify |
| `src/components/AboutPreview.tsx` | Create |
| `src/app/page.tsx` | Modify |
