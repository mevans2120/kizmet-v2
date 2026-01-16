# Research: Adding Photo to Homepage About Preview

**Date:** 2026-01-16
**Component:** `src/components/AboutPreview.tsx`

## Current State

The AboutPreview section is a **centered quote block** with:
- Eyebrow text ("Meet Your Therapist")
- Large decorative quote mark
- Italicized quote in Fraunces
- Attribution (name + title)
- CTA link to /about

**No image currently.** The layout is entirely text-centered.

## Reference: Full About Page

The full About page (`src/page-content/About.tsx`) already has an image implementation:
- **Aspect ratio:** 4:5 (portrait orientation)
- **Container:** `rounded-xl overflow-hidden shadow-xl`
- **Decoration:** Sage circle behind (`bg-sage-100 rounded-full -z-10`)
- **Sanity field:** `heroImage` with hotspot support

## Design Options

### Option A: Side-by-Side Layout (Recommended)
**Layout:** Image left, quote content right (or reversed)

```
┌─────────────────────────────────────────────────┐
│  ┌──────────┐    MEET YOUR THERAPIST           │
│  │          │                                   │
│  │  PHOTO   │    "In my family, healing..."     │
│  │  (4:5)   │                                   │
│  │          │    — Destiny, Third-Generation    │
│  └──────────┘                                   │
│                  [Read My Story →]              │
└─────────────────────────────────────────────────┘
```

**Pros:**
- Matches full About page pattern
- Personal connection with face visible
- Clear visual hierarchy
- Works well on desktop and mobile (stacks)

**Cons:**
- More dramatic layout change
- Needs responsive handling

**Photo shape:** Portrait rectangle (4:5 or 3:4)

---

### Option B: Circular Portrait Above Quote
**Layout:** Centered layout preserved, circular photo above

```
┌─────────────────────────────────────────────────┐
│              MEET YOUR THERAPIST                │
│                                                 │
│                 ┌─────┐                         │
│                 │  ○  │  (circular)             │
│                 └─────┘                         │
│                                                 │
│         "In my family, healing..."              │
│                                                 │
│         — Destiny, Third-Generation             │
│              [Read My Story →]                  │
└─────────────────────────────────────────────────┘
```

**Pros:**
- Minimal layout disruption
- Elegant, personal touch
- Works well at any screen size
- Common pattern for testimonials/quotes

**Cons:**
- Smaller photo (less impact)
- Circular crop may not suit all photos

**Photo shape:** Circle (1:1 ratio, ~120-160px)

---

### Option C: Asymmetric Overlap
**Layout:** Image offset to side, quote overlaps slightly

```
┌─────────────────────────────────────────────────┐
│     ┌──────────┐                                │
│     │          │    MEET YOUR THERAPIST         │
│     │  PHOTO   │                                │
│     │          │    "In my family..."           │
│     │          │                                │
│     └──────────┘    — Destiny                   │
│                     [Read My Story →]           │
└─────────────────────────────────────────────────┘
```

**Pros:**
- Visually interesting
- Creates depth with overlap

**Cons:**
- Complex responsive behavior
- May feel unbalanced

**Photo shape:** Portrait rectangle with soft corners

---

### Option D: Background Image with Overlay
**Layout:** Subtle background photo, text overlay

**Pros:**
- Atmospheric
- Doesn't change layout structure

**Cons:**
- Text readability concerns
- Competes with quote content
- Less personal than direct portrait

**Not recommended** for this use case.

---

## Recommendation: Option A (Side-by-Side)

**Why:**
1. Consistent with the full About page hero section
2. Strong visual impact - puts a face to the name
3. The existing 2-column grid pattern is already in use elsewhere
4. Reuses existing Sanity image handling patterns

**Photo specifications:**
- **Aspect ratio:** 4:5 (portrait) - matches About page
- **Suggested size:** 400x500px display, fetch at 800x1000
- **Container:** `rounded-xl overflow-hidden shadow-lg`
- **Optional decoration:** Subtle sage circle behind (like About page)

---

## Implementation Plan

### 1. Sanity Schema Update
Add to `homepageSettings.ts` in the `aboutPreview` fieldset:

```typescript
defineField({
  name: 'aboutPreviewImage',
  title: 'Photo',
  type: 'image',
  fieldset: 'aboutPreview',
  options: { hotspot: true },
  description: 'Portrait photo of Destiny (4:5 ratio recommended)',
}),
```

### 2. Update GROQ Query
Add image with asset reference to `HOMEPAGE_SETTINGS_QUERY`:

```groq
aboutPreviewImage {
  asset->,
  crop,
  hotspot,
  alt
},
```

### 3. Update AboutPreview Component

```tsx
// Add to interface
aboutPreviewImage?: any;

// Update layout
<section className="py-20 md:py-24 bg-card">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Image */}
      <div className="relative mx-auto lg:mx-0 max-w-sm">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
          {content.image ? (
            <Image
              src={getCroppedImageUrl(content.image, 800, 1000)}
              alt="Destiny"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-sage-100" />
          )}
        </div>
        {/* Optional: decorative circle */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sage-100 rounded-full -z-10" />
      </div>

      {/* Quote Content */}
      <div className="text-center lg:text-left">
        {/* existing content */}
      </div>
    </div>
  </div>
</section>
```

### 4. Responsive Behavior
- **Desktop (lg+):** Side-by-side, image left
- **Mobile/Tablet:** Stacked, image on top, content centered below

---

## Alternative: Option B (If Simpler is Preferred)

If a simpler change is preferred, the circular portrait is quick to implement:

```tsx
{/* Circular portrait */}
<div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-lg border-4 border-sage-100">
  <Image
    src={getCroppedImageUrl(content.image, 320, 320)}
    alt="Destiny"
    width={160}
    height={160}
    className="object-cover w-full h-full"
  />
</div>
```

This preserves the centered layout and is simpler to implement.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/sanity/schemaTypes/homepageSettings.ts` | Add `aboutPreviewImage` field |
| `src/sanity/lib/queries.ts` | Add image to HOMEPAGE_SETTINGS_QUERY |
| `src/components/AboutPreview.tsx` | Add image display and update layout |

## Questions for User

1. **Side-by-side (A) or circular portrait (B)?**
2. **Image on left or right?** (if side-by-side)
3. **Do you have a photo ready to upload?**
