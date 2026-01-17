# Plan: Testimonials Component — Kizmet Massage

**Date:** 2026-01-17
**Tags:** sanity, homepage, testimonials, cms

## Objective

Implement a testimonials section on the homepage with Sanity CMS integration, using the approved "Two-Up Compact Grid" design (Concept 3).

## Background

Design concepts were created and reviewed:
- Concept 1: Brand-Aligned Stacked
- Concept 2: Two-Up Grid with star ratings
- **Concept 3: Two-Up Compact Grid** (selected) — 2-column layout with location-based attribution

The selected design uses:
- 2-column grid on desktop, stacked on mobile
- Small SVG quote icons
- Author name + location format
- Brand colors (sage, terracotta, cream)

## Requirements

### Must Have
- Sanity schema for testimonial documents
- Homepage settings for testimonials section (eyebrow, title, subtitle)
- React component matching Concept 3 design
- Migration script to seed initial content from concept HTML

### Nice to Have
- Display order field for manual sorting
- "Featured" toggle to control homepage visibility
- Optional photo field for author avatars (future)

## Approach

### Phase 1: Sanity Schema

**1.1 Create `testimonial.ts` schema**

```typescript
// src/sanity/schemaTypes/testimonial.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'e.g., "Sarah M."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorLocation',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Port Angeles, WA"',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'authorLocation',
    },
  },
})
```

**1.2 Add testimonials fieldset to `homepageSettings.ts`**

Add new fieldset for section header content:
- `testimonialsEyebrow` (string, default: "Kind Words")
- `testimonialsTitle` (string, default: "What Clients Say")
- `testimonialsSubtitle` (text)

**1.3 Register schema in `index.ts`**

### Phase 2: GROQ Queries

**2.1 Update homepage query**

Add to existing homepage query:
```groq
"testimonials": *[_type == "testimonial" && featured == true] | order(order asc) {
  _id,
  authorName,
  authorLocation,
  quote
},
"testimonialsSection": {
  "eyebrow": homepageSettings->testimonialsEyebrow,
  "title": homepageSettings->testimonialsTitle,
  "subtitle": homepageSettings->testimonialsSubtitle
}
```

### Phase 3: React Component

**3.1 Create `Testimonials.tsx`**

Location: `src/components/Testimonials.tsx`

Props:
```typescript
interface TestimonialsProps {
  data?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  testimonials?: Array<{
    _id: string;
    authorName: string;
    authorLocation?: string;
    quote: string;
  }>;
}
```

Features:
- 2-column CSS Grid (`grid-cols-2` on md+, `grid-cols-1` on mobile)
- SVG quote icon per card
- 4-line text truncation with `line-clamp-4`
- Initials avatar generated from author name
- Hover lift effect on cards

**3.2 Add to homepage**

Import and render in `src/page-content/Home.tsx` between AboutPreview and CTA sections.

### Phase 4: Migration Script

**4.1 Create seed script**

Location: `scripts/seed-testimonials.ts`

Uses Sanity client to create documents:
```typescript
const testimonials = [
  {
    _type: 'testimonial',
    authorName: 'Sarah M.',
    authorLocation: 'Port Angeles, WA',
    quote: 'After years of chronic shoulder pain from desk work, I finally found relief. Destiny has an incredible intuition for finding exactly where the tension lives.',
    featured: true,
    order: 1,
  },
  {
    _type: 'testimonial',
    authorName: 'James T.',
    authorLocation: 'Sequim, WA',
    quote: "I was skeptical about massage therapy until I tried Kizmet. The 90-minute session is pure magic. It's become my monthly reset button.",
    featured: true,
    order: 2,
  },
  {
    _type: 'testimonial',
    authorName: 'Rachel L.',
    authorLocation: 'Port Townsend, WA',
    quote: 'During my pregnancy, Destiny was a lifesaver. She knew exactly how to adjust her technique for each trimester. Highly recommend!',
    featured: true,
    order: 3,
  },
  {
    _type: 'testimonial',
    authorName: 'Michael K.',
    authorLocation: 'Forks, WA',
    quote: "Best deep tissue massage I've ever had. Destiny listens to what you need and delivers exactly that. My lower back has never felt better.",
    featured: true,
    order: 4,
  },
];
```

**4.2 Add npm script**

```json
"scripts": {
  "seed:testimonials": "npx tsx scripts/seed-testimonials.ts"
}
```

## Implementation Steps

1. [ ] Create `src/sanity/schemaTypes/testimonial.ts`
2. [ ] Register in `src/sanity/schemaTypes/index.ts`
3. [ ] Add testimonials fieldset to `homepageSettings.ts`
4. [ ] Update GROQ query in homepage data fetching
5. [ ] Create `src/components/Testimonials.tsx` component
6. [ ] Add Testimonials to `src/page-content/Home.tsx`
7. [ ] Create `scripts/seed-testimonials.ts` migration script
8. [ ] Add `seed:testimonials` npm script
9. [ ] Run migration script to populate Sanity
10. [ ] Test on dev server
11. [ ] Verify Sanity Studio shows testimonials

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schema changes require Studio restart | Low | Low | Document in README |
| Migration script overwrites existing data | Med | Med | Check for existing docs before creating |
| Text truncation cuts important content | Low | Low | Allow editing in Sanity, keep quotes concise |

## Success Criteria

- [ ] Testimonials section renders on homepage with 4 cards
- [ ] 2-column grid on desktop, single column on mobile
- [ ] Content editable via Sanity Studio
- [ ] Section header (eyebrow, title, subtitle) editable in Homepage settings
- [ ] Migration script successfully seeds initial content
- [ ] Design matches approved Concept 3

## Open Questions

- Should testimonials have a dedicated page in the future, or homepage-only?
- Should we add a photo upload field for author avatars?

## Related Research

- Design concepts: `docs/design/testimonials-concepts-011626/`
  - `testimonials-concept-3-two-up-compact.html` (selected design)
  - `testimonials-overview.md` (comparison document)
