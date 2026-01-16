# Plan: Services Content Migration to CMS

**Date:** 2026-01-15
**Project:** Kizmet Massage & Wellness
**Source:** `docs/design/booking-page-concepts-011426/booking-concept-4-refined.html`

---

## Objective

Migrate the rich service descriptions from the design concept into Sanity CMS, including:
- Expanded descriptions (2 paragraphs)
- Techniques list
- "Best For" list

---

## Background

The booking concept (concept 4) includes detailed service copy that was never migrated:

| Field | Current State | Concept Has |
|-------|---------------|-------------|
| Description | 1 short sentence | 2 detailed paragraphs |
| Techniques | Not supported | List of 3-4 items |
| Best For | Not supported | List of 3-5 use cases |

---

## Implementation Steps

### Step 1: Update Sanity Service Schema

**File:** `src/sanity/schemaTypes/service.ts`

Add new fields:

```ts
defineField({
  name: 'extendedDescription',
  title: 'Extended Description',
  type: 'text',
  rows: 4,
  description: 'Additional detail paragraph (optional)',
}),
defineField({
  name: 'techniques',
  title: 'Techniques',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'e.g., "Trigger point therapy", "Deep tissue"',
}),
defineField({
  name: 'bestFor',
  title: 'Best For',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'e.g., "Desk workers", "Athletes", "Chronic pain"',
}),
```

---

### Step 2: Update Services Page Component

**File:** `src/page-content/Services.tsx`

Update the service card to display new fields:

```tsx
<CardContent className="flex-grow">
  <p className="text-body text-muted-foreground">
    {service.description}
  </p>
  {service.extendedDescription && (
    <p className="text-body text-muted-foreground mt-3">
      {service.extendedDescription}
    </p>
  )}
  {service.techniques?.length > 0 && (
    <div className="mt-4">
      <p className="text-xs uppercase tracking-caps text-foreground font-medium mb-2">
        Techniques
      </p>
      <div className="flex flex-wrap gap-2">
        {service.techniques.map((t) => (
          <span key={t} className="text-xs bg-muted px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
    </div>
  )}
  {service.bestFor?.length > 0 && (
    <div className="mt-3">
      <p className="text-xs uppercase tracking-caps text-foreground font-medium mb-2">
        Best For
      </p>
      <div className="flex flex-wrap gap-2">
        {service.bestFor.map((b) => (
          <span key={b} className="text-xs bg-muted px-2 py-1 rounded">
            {b}
          </span>
        ))}
      </div>
    </div>
  )}
</CardContent>
```

Update the TypeScript interface:

```tsx
interface Service {
  _id?: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  extendedDescription?: string;
  techniques?: string[];
  bestFor?: string[];
  bookingUrl?: string;
}
```

Update fallback services with concept content.

---

### Step 3: Update ServicesPreview Component (Homepage)

**File:** `src/components/ServicesPreview.tsx`

The homepage preview should show the main description only (no techniques/bestFor) to keep it concise. Just update the interface and ensure it handles the new fields gracefully.

---

### Step 4: Update Sanity Query

**File:** `src/sanity/lib/queries.ts`

Update the services query to fetch new fields:

```groq
*[_type == "service"] | order(order asc) {
  _id,
  name,
  duration,
  price,
  description,
  extendedDescription,
  techniques,
  bestFor,
  bookingUrl
}
```

---

### Step 5: Run Migration Script

**File:** `scripts/migrate-services-content.ts`

Create a migration script that uses the Sanity client to update the service documents:

```ts
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // Need write token
  apiVersion: '2024-01-01',
  useCdn: false,
})

const servicesContent = [
  {
    name: '30 Minute Session',
    description: '...',
    extendedDescription: '...',
    techniques: ['...'],
    bestFor: ['...'],
  },
  // ... other services
]

// Update each service by name match
```

Run with: `npx tsx scripts/migrate-services-content.ts`

---

### Content Reference (for migration script)

#### 30 Minute Session

**Description:**
> Targeted work on a single area of concern. I use focused pressure and trigger point techniques to address specific tension in the neck, shoulders, or lower back.

**Extended Description:**
> This session works well for maintenance between longer appointments, addressing a flare-up, or when your schedule is tight. We'll spend the full time on your priority area rather than spreading attention thin.

**Techniques:**
- Trigger point therapy
- Focused deep tissue
- Myofascial release

**Best For:**
- Desk workers with neck tension
- Runners with tight calves
- Maintenance between sessions

---

#### 60 Minute Session

**Description:**
> A complete full-body treatment combining Swedish strokes, kneading, and deeper pressure where needed. This is my most popular session—enough time to address your back, neck, shoulders, and legs while promoting full-body relaxation.

**Extended Description:**
> I'll check in about pressure throughout and adjust my approach based on what your body needs that day. Whether you want relaxation or more therapeutic work, an hour gives us the flexibility to do both.

**Techniques:**
- Swedish massage
- Deep tissue
- Kneading
- Long flowing strokes

**Best For:**
- Regular wellness maintenance
- Stress relief
- First-time clients
- General tension

---

#### 90 Minute Session

**Description:**
> An unhurried, comprehensive session with time for detailed work on problem areas. The extra thirty minutes allows me to thoroughly address chronic tension without rushing, incorporating hot towel application and optional stretching or aromatherapy.

**Extended Description:**
> This is my most thorough treatment—ideal when you're carrying significant tension, recovering from an event, or simply want to fully disconnect. We can spend extra time on stubborn areas while still providing complete full-body coverage.

**Techniques:**
- Combined modalities
- Hot towels
- Assisted stretching
- Aromatherapy (optional)

**Best For:**
- Chronic pain
- Athletes
- High-stress periods
- Complete restoration
- Treating yourself

---

## File Change Summary

| File | Change |
|------|--------|
| `src/sanity/schemaTypes/service.ts` | Add extendedDescription, techniques, bestFor fields |
| `src/sanity/lib/queries.ts` | Update query to fetch new fields |
| `src/page-content/Services.tsx` | Display new fields, update interface, update fallbacks |
| `src/components/ServicesPreview.tsx` | Update interface |
| `scripts/migrate-services-content.ts` | Migration script to populate CMS |

---

## Verification

After implementation:
1. [ ] Schema changes deploy without errors
2. [ ] Services page shows techniques and bestFor pills
3. [ ] Homepage preview still works (shows description only)
4. [ ] Sanity Studio allows editing new fields
5. [ ] Content entered in Studio displays correctly

---

## Success Criteria

- [ ] All 3 services have rich descriptions in CMS
- [ ] Techniques display as pill/tag UI
- [ ] Best For displays as pill/tag UI
- [ ] Fallback content matches concept for offline dev
- [ ] No visual regression on homepage preview
