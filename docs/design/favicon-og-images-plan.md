# Plan: Favicon & Social Sharing Icons

## Overview

Update the favicon to use the hands logo and create social sharing (OG) images that match the hero's stacked logo layout.

---

## Part 1: Favicon - Hands Logo

### Current State
- `src/app/icon.tsx` generates a 32px favicon using `next/og` ImageResponse
- Currently displays stacked "K" (charcoal) over "M" (sage) letters
- Circular cream gradient background

### Design Goal
Brown hands logo (`#4D4033`) centered on an off-white circular background.

### Implementation Approach

**Option A: Inline SVG in ImageResponse (Recommended)**

Embed the hands SVG path data directly in the ImageResponse. This keeps everything self-contained with no external asset dependencies at build time.

**Pros:**
- No external file fetches needed
- Guaranteed to work at build/edge runtime
- Single file solution

**Cons:**
- SVG path data makes the file longer
- Any SVG changes require updating icon.tsx

**Option B: Fetch SVG at runtime**

Fetch `/Kizmet-Hands.svg` from the public folder and render it.

**Pros:**
- Cleaner code
- SVG source of truth stays in one place

**Cons:**
- Requires network fetch in edge runtime
- Potential deployment issues with asset URLs

### Recommended Implementation (Option A)

```tsx
// src/app/icon.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

// Hands SVG path data extracted from Kizmet-Hands.svg
const HANDS_PATH = `M110.354 227.352C116.981...` // Full path from SVG

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #faf8f5 0%, #f0ebe4 50%, #e8e3dc 100%)',
          borderRadius: '50%',
        }}
      >
        <svg
          width="24"
          height="18"
          viewBox="0 0 338 250"
          fill="none"
        >
          <path d={HANDS_PATH} fill="#4D4033" />
          {/* Additional paths for the rays/details */}
        </svg>
      </div>
    ),
    { ...size }
  )
}
```

### Color Palette
| Element | Color | Notes |
|---------|-------|-------|
| Hands fill | `#4D4033` | Brown/terracotta from SVG |
| Background start | `#faf8f5` | Warm off-white |
| Background mid | `#f0ebe4` | Cream |
| Background end | `#e8e3dc` | Slightly darker cream |

### Sizes to Generate

Next.js `icon.tsx` handles the primary favicon. Consider also adding:

| File | Size | Purpose |
|------|------|---------|
| `icon.tsx` | 32×32 | Browser tab favicon |
| `apple-icon.tsx` | 180×180 | Apple touch icon |

### Files to Modify/Create
| File | Action |
|------|--------|
| `src/app/icon.tsx` | Modify - replace K/M letters with hands SVG |
| `src/app/apple-icon.tsx` | Create - larger version for iOS |
| `public/favicon.ico` | Delete - no longer needed (dynamic generation) |

---

## Part 2: Social Sharing (OG) Images

### Current State
- OG images come from Sanity CMS uploads or `/og-default.jpg` fallback
- No dynamic generation
- `src/lib/metadata.ts` references image URLs

### Design Goal
Generate OG images (1200×630) featuring the full stacked logo matching the hero layout:
```
      [Hands Logo]
        Kizmet
      —MASSAGE—
```

The proportions and spacing should match the hero exactly, scaled to fit the OG image dimensions.

### Hero Layout Reference (from Hero.tsx)

```
Hero viewport: full screen (~1920×1080 reference)
├── Hands SVG: w-48 md:w-56 (192px / 224px width)
├── Kizmet text: text-5xl md:text-8xl (3rem / 6rem = 48px / 96px)
│   └── Drop cap K: text-6xl md:text-9xl (3.75rem / 8rem = 60px / 128px)
├── MASSAGE text: hero-title-massage class
│   ├── font-size: clamp(1rem, 3vw, 1.5rem)
│   ├── letter-spacing: 0.2em
│   └── decorative lines: 1.5rem width, 1px height
```

### Scaling Strategy

To maintain hero proportions in a 1200×630 OG image:

**Reference proportions (hero at md breakpoint):**
- Hands width: 224px on ~1920px viewport = 11.7% of width
- OG equivalent: 1200 × 11.7% = ~140px hands width

**Calculated OG sizes:**
| Element | Hero (md) | OG (1200×630) |
|---------|-----------|---------------|
| Hands width | 224px | 140px |
| "Kizmet" font | 96px (6rem) | 60px |
| "K" drop cap | 128px (8rem) | 80px |
| "MASSAGE" font | 24px (1.5rem) | 15px |
| Line width | 24px (1.5rem) | 15px |

### Implementation Approach

**Option A: Next.js opengraph-image.tsx (Recommended)**

Use Next.js 13+ App Router convention for dynamic OG image generation.

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Kizmet Massage'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const HANDS_PATH = `...` // Same SVG path data as favicon

// Fraunces font for text
const fontUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.ttf'

export default async function OGImage() {
  const fraunces = await fetch(fontUrl).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #faf8f5 0%, #f0ebe4 100%)',
        }}
      >
        {/* Hands Logo */}
        <svg width="140" height="103" viewBox="0 0 338 250" fill="none">
          <path d={HANDS_PATH} fill="#4D4033" />
        </svg>

        {/* Kizmet Text */}
        <div style={{
          fontFamily: 'Fraunces',
          fontSize: 60,
          fontWeight: 300,
          color: '#3d3426',
          marginTop: -10,
        }}>
          <span style={{ fontSize: 80 }}>K</span>izmet
        </div>

        {/* MASSAGE with decorative lines */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 4,
        }}>
          <div style={{
            width: 20,
            height: 1,
            background: 'linear-gradient(to left, #5a725c, transparent)',
          }} />
          <span style={{
            fontFamily: 'Fraunces',
            fontSize: 15,
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#5a725c',
          }}>
            Massage
          </span>
          <div style={{
            width: 20,
            height: 1,
            background: 'linear-gradient(to right, #5a725c, transparent)',
          }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Fraunces',
          data: fraunces,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

**Option B: Static PNG with CMS fallback**

Generate a static PNG file manually (in Figma/design tool) and keep CMS override capability.

**Pros:** More design control, works without edge runtime
**Cons:** Manual updates required, not dynamic

### Additional OG Image Variants

Consider page-specific OG images:

| Page | File | Notes |
|------|------|-------|
| Home | `src/app/opengraph-image.tsx` | Full stacked logo |
| About | `src/app/about/opengraph-image.tsx` | Could add "About" subtitle |
| Services | `src/app/services/opengraph-image.tsx` | Could add "Services" subtitle |
| Twitter | `src/app/twitter-image.tsx` | Same as OG (1200×630 for summary_large_image) |

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/opengraph-image.tsx` | Create - main OG image generator |
| `src/app/twitter-image.tsx` | Create - Twitter card image (can re-export from OG) |
| `src/lib/metadata.ts` | Modify - update fallback behavior |
| `public/og-default.jpg` | Delete - replaced by dynamic generation |

---

## Implementation Order

### Phase 1: Favicon
1. Extract full SVG path data from `/public/Kizmet-Hands.svg`
2. Update `src/app/icon.tsx` with hands-on-circle design
3. Create `src/app/apple-icon.tsx` for iOS
4. Test across browsers (Chrome, Safari, Firefox)
5. Delete `public/favicon.ico`

### Phase 2: OG Images
1. Create `src/app/opengraph-image.tsx` with stacked logo
2. Create `src/app/twitter-image.tsx` (can share logic)
3. Test with social media debuggers:
   - https://cards-dev.twitter.com/validator
   - https://developers.facebook.com/tools/debug/
4. Update `src/lib/metadata.ts` to remove static fallback references
5. Delete `public/og-default.jpg` if exists

---

## Verification Checklist

### Favicon
- [ ] 32×32 favicon shows hands on circular background
- [ ] Hands are clearly visible and recognizable at small size
- [ ] Apple touch icon (180×180) displays correctly on iOS
- [ ] No console errors about missing favicon.ico

### OG Images
- [ ] OG image dimensions are 1200×630
- [ ] Hands/Kizmet/MASSAGE proportions match hero layout
- [ ] Text is crisp and readable
- [ ] Fraunces font loads correctly
- [ ] Facebook debugger shows correct image
- [ ] Twitter card validator shows correct image
- [ ] Colors match brand palette (cream background, brown hands, sage "MASSAGE")

---

## Technical Notes

### SVG Path Extraction

The hands SVG contains multiple `<path>` elements. Extract all paths from `/public/Kizmet-Hands.svg`:

```xml
<!-- Main hands path -->
<path d="M110.354 227.352C116.981..." fill="#4D4033"/>
<!-- Ray/decoration paths (6 additional paths) -->
<path d="M206.363 27.9765..." fill="#4D4033"/>
...
```

All paths use the same fill color `#4D4033`.

### Font Loading

The Fraunces font is loaded from jsDelivr CDN in edge runtime:
```
https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.ttf
```

For the OG image, use weight 400 (regular) for body text. The hero uses `font-light` which is 300, but at small sizes 400 provides better legibility.

### Edge Runtime Considerations

Both `icon.tsx` and `opengraph-image.tsx` use `export const runtime = 'edge'` for optimal performance. This means:
- No Node.js APIs available
- Fetch works for external resources
- Keep bundle size minimal
