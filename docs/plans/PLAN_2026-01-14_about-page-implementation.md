# About Page Implementation Plan

**Date:** January 14, 2026
**Concept:** Classic Sanctuary (refined)
**Status:** Ready for implementation

---

## Overview

Implement the About page based on the approved Classic Sanctuary design concept. The implementation should be Sanity-ready, meaning content should be structured for easy migration to CMS-driven data once Sanity is configured.

---

## Architecture Approach

### Sanity-Ready Pattern

Following the existing codebase pattern:
- **Page route:** `src/app/about/page.tsx` (Server Component)
- **Page content:** `src/page-content/About.tsx` (can be Client Component if needed)

Content will initially be hardcoded but structured as typed objects that mirror future Sanity schema shapes. This allows for a simple swap when Sanity is integrated.

```typescript
// Example pattern - content structured for future CMS
const aboutContent = {
  hero: {
    eyebrow: "About Destiny",
    headline: "Healing Hands, Open Heart",
    intro: "I grew up watching my grandmother's hands..."
  },
  // ... etc
}
```

---

## Page Sections

### 1. Hero Section
| Element | Type | Sanity Field (Future) |
|---------|------|----------------------|
| Eyebrow | Text | `hero.eyebrow` (string) |
| Headline | Text | `hero.headline` (string) |
| Intro paragraph | Text | `hero.intro` (text) |
| Portrait photo | Image | `hero.image` (image with alt) |

### 2. Quote Section
| Element | Type | Sanity Field (Future) |
|---------|------|----------------------|
| Quote text | Text | `quote.text` (text) |
| Attribution | Text | `quote.attribution` (string) |

### 3. Bio Section
| Element | Type | Sanity Field (Future) |
|---------|------|----------------------|
| Section title | Text | `bio.title` (string) |
| Credentials | Array | `bio.credentials` (array of strings) |
| Bio paragraphs | Rich Text | `bio.content` (portable text) |

### 4. Session Journey Section
| Element | Type | Sanity Field (Future) |
|---------|------|----------------------|
| Section title | Text | `journey.title` (string) |
| Section intro | Text | `journey.intro` (text) |
| Steps | Array | `journey.steps` (array of {title, description}) |

### 5. CTA Section
| Element | Type | Sanity Field (Future) |
|---------|------|----------------------|
| Headline | Text | `cta.headline` (string) |
| Button text | Text | `cta.buttonText` (string) |
| Button link | URL | `cta.buttonLink` (string) |

---

## Implementation Steps

### Phase 1: Page Structure

- [ ] **1.1** Create page route `src/app/about/page.tsx`
  - Server component
  - Import and render About content component
  - Add metadata export for SEO

- [ ] **1.2** Create content component `src/page-content/About.tsx`
  - Structure content as typed object (Sanity-ready)
  - Import shared components (Navigation, Footer)

### Phase 2: Section Components

- [ ] **2.1** Create `AboutHero` component
  - Two-column grid layout
  - Photo container with decorative accent circle
  - Responsive: stack on mobile

- [ ] **2.2** Create `AboutQuote` component
  - Centered layout with decorative quote mark
  - Sage background

- [ ] **2.3** Create `AboutBio` component
  - Sidebar + main content grid
  - Drop cap on first paragraph
  - Credentials list with divider

- [ ] **2.4** Create `SessionJourney` component
  - Horizontal timeline with numbered steps
  - Connected line between step markers
  - Responsive: vertical stack on mobile

- [ ] **2.5** Create `AboutCTA` component
  - Full-width sage background
  - Centered headline + button
  - Reuse existing Button component with appropriate variant

### Phase 3: Styling

- [ ] **3.1** Add any new CSS variables if needed
  - Review concept for any missing tokens
  - All colors should already exist in design system

- [ ] **3.2** Component styles
  - Use Tailwind classes matching existing patterns
  - Add custom CSS only where Tailwind is insufficient
  - Ensure animations match existing `animate-fade-in`, `animate-slide-up`

### Phase 4: Assets & Content

- [ ] **4.1** Add placeholder/actual images
  - Portrait photo (4:5 aspect ratio)
  - Optimize with Next.js Image component
  - Add appropriate alt text

- [ ] **4.2** Finalize copy
  - Review all placeholder text with stakeholder
  - Ensure bio accurately reflects Destiny's background

### Phase 5: Integration & Testing

- [ ] **5.1** Add to navigation
  - Update Navigation component with About link
  - Ensure active state styling

- [ ] **5.2** Responsive testing
  - Test breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
  - Verify timeline collapses correctly on mobile

- [ ] **5.3** Accessibility check
  - Verify heading hierarchy (h1 → h2 → h3)
  - Check color contrast ratios
  - Test keyboard navigation
  - Add appropriate ARIA labels if needed

---

## File Structure (Expected)

```
src/
├── app/
│   └── about/
│       └── page.tsx              # New: page route
├── page-content/
│   └── About.tsx                 # New: main content
└── components/
    └── about/                    # New: about-specific components
        ├── AboutHero.tsx
        ├── AboutQuote.tsx
        ├── AboutBio.tsx
        ├── SessionJourney.tsx
        └── AboutCTA.tsx
```

---

## Sanity Migration Notes

When Sanity is integrated, the migration will involve:

1. **Create Sanity schema** for About page (`schemas/about.ts`)
2. **Create GROQ query** to fetch about page content
3. **Replace hardcoded content object** with Sanity query result
4. **Update image references** to use Sanity image URLs
5. **Convert bio content** to use `@portabletext/react` for rich text

### Suggested Sanity Schema Structure

```typescript
// Future: schemas/about.ts
export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'string' },
        { name: 'headline', type: 'string' },
        { name: 'intro', type: 'text' },
        { name: 'image', type: 'image', options: { hotspot: true } }
      ]
    },
    {
      name: 'quote',
      type: 'object',
      fields: [
        { name: 'text', type: 'text' },
        { name: 'attribution', type: 'string' }
      ]
    },
    {
      name: 'bio',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'credentials', type: 'array', of: [{ type: 'string' }] },
        { name: 'content', type: 'array', of: [{ type: 'block' }] }
      ]
    },
    {
      name: 'journey',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'intro', type: 'text' },
        {
          name: 'steps',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'title', type: 'string' },
              { name: 'description', type: 'text' }
            ]
          }]
        }
      ]
    },
    {
      name: 'cta',
      type: 'object',
      fields: [
        { name: 'headline', type: 'string' },
        { name: 'buttonText', type: 'string' },
        { name: 'buttonLink', type: 'string' }
      ]
    }
  ]
}
```

---

## Dependencies

- No new packages required
- Uses existing: Next.js Image, Tailwind, shadcn/ui Button

---

## Risks & Considerations

| Risk | Mitigation |
|------|------------|
| Photo not ready | Use high-quality placeholder; design works without specific image |
| Copy changes | Content structured for easy updates; minimal code changes needed |
| Sanity schema mismatch | Schema suggestion included; adjust during Sanity setup if needed |

---

## Definition of Done

- [ ] About page accessible at `/about`
- [ ] All sections render matching approved concept
- [ ] Responsive on mobile, tablet, desktop
- [ ] Navigation includes About link
- [ ] Page passes Lighthouse accessibility audit (90+)
- [ ] Content structured for Sanity migration
- [ ] Code reviewed and merged to main
