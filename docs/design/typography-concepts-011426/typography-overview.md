# Typography Concepts - Kizmet Massage & Wellness

**Date:** January 14, 2026
**Scope:** Site-wide typography system
**Status:** Ready for review

---

## Design Challenge

Establish a distinctive typography system for Kizmet using exactly two fonts (one serif, one sans-serif) that communicates warmth, professionalism, and wellness.

**Current fonts:** Cormorant Garamond + Inter
**Why reconsider:** Inter is heavily overused in digital products and doesn't add distinctive character.

---

## Concept Comparison

| Aspect | Concept 1: Refined Elegance | Concept 2: Contemporary Wellness | Concept 3: Warm & Organic |
|--------|----------------------------|----------------------------------|---------------------------|
| **Serif** | Playfair Display | Fraunces | Lora |
| **Sans** | DM Sans | Plus Jakarta Sans | Nunito |
| **Aesthetic** | Luxury spa, timeless | Modern wellness, confident | Inviting, handcrafted |
| **Character** | High-contrast, elegant | Variable, personality | Soft curves, friendly |
| **Best for** | Premium positioning | Contemporary feel | Personal connection |

---

## Concept 1: Refined Elegance

**Fonts:** `Playfair Display` + `DM Sans`

**File:** [typography-concept-1-refined-elegance.html](./typography-concept-1-refined-elegance.html)

### Playfair Display (Serif)
- High-contrast strokes with elegant, delicate serifs
- Evokes luxury print design and high-end spa aesthetics
- Excellent for large display text, less ideal for small body text
- Traditional elegance with a contemporary edge

### DM Sans (Sans-Serif)
- Clean geometric forms with subtle character
- Sophisticated without being cold or clinical
- Great legibility across all sizes
- Optical adjustments for better rendering

### Tradeoffs
- **Strengths:** Premium feel, timeless quality, high visual impact
- **Weaknesses:** May feel too formal for a personal massage practice; Playfair's thin strokes can be less legible at small sizes

---

## Concept 2: Contemporary Wellness

**Fonts:** `Fraunces` + `Plus Jakarta Sans`

**File:** [typography-concept-2-contemporary-wellness.html](./typography-concept-2-contemporary-wellness.html)

### Fraunces (Serif)
- Modern variable font with "wonky" optical sizing
- Unique personality while remaining refined
- Optical size axis adapts from delicate display to sturdy text
- Fresh and contemporary without being trendy

### Plus Jakarta Sans (Sans-Serif)
- Geometric and confident with excellent legibility
- Slightly rounded terminals add warmth
- Modern without being cold
- Strong hierarchy through weight variations

### Tradeoffs
- **Strengths:** Fresh, distinctive, adaptable; Fraunces is still relatively uncommon
- **Weaknesses:** Fraunces's "wonkiness" at large sizes may not appeal to all; slightly more technical to implement due to variable font features

---

## Concept 3: Warm & Organic

**Fonts:** `Lora` + `Nunito`

**File:** [typography-concept-3-warm-organic.html](./typography-concept-3-warm-organic.html)

### Lora (Serif)
- Friendly, brushed curves that feel handcrafted
- Warm and inviting without being overly decorative
- Excellent readability in both display and body sizes
- Classic but accessible

### Nunito (Sans-Serif)
- Fully rounded sans-serif with soft, approachable forms
- Inherently friendly and human-centered
- Great for both UI elements and body text
- Emphasizes care over clinical precision

### Tradeoffs
- **Strengths:** Most approachable and warm; emphasizes personal touch; excellent readability
- **Weaknesses:** May feel too soft for some; less "premium" impression than other options; Nunito is fairly common (though not as overused as Inter)

---

## Recommendations by Priority

### If prioritizing **premium positioning**:
→ **Concept 1** (Playfair Display + DM Sans)

### If prioritizing **contemporary freshness**:
→ **Concept 2** (Fraunces + Plus Jakarta Sans)

### If prioritizing **warmth and approachability**:
→ **Concept 3** (Lora + Nunito)

---

## Implementation Notes

All fonts are available via Google Fonts and can be loaded through `next/font/google`:

```tsx
// Example: Concept 2 implementation
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})
```

---

## Next Steps

1. Review all three concepts in browser
2. Select direction based on brand priorities
3. Implement chosen typography in `layout.tsx` and `tailwind.config.ts`
4. Update CSS variables in `globals.css`

---

## Files in this Folder

- `typography-concept-1-refined-elegance.html` - Playfair Display + DM Sans
- `typography-concept-2-contemporary-wellness.html` - Fraunces + Plus Jakarta Sans
- `typography-concept-3-warm-organic.html` - Lora + Nunito
- `typography-overview.md` - This document
