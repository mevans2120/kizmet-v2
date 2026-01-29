# Kizmet Massage Homepage Concepts

**Date:** January 28, 2026
**Based on:** New logo featuring hands cradling mountains, water, and sun

---

## Design Challenge

Redesign the Kizmet Massage homepage to incorporate the new logo's visual identity while:
1. Keeping one concept close to the existing layout/structure (per request)
2. Using real text instead of text-as-images for accessibility and CMS editing
3. Shifting from the current sage-forward palette to warmer browns from the logo

## Logo Analysis

The new logos feature:
- **Hands** forming a bowl shape, cradling a natural scene
- **Mountains** with snow caps (PNW reference)
- **Water/lake** with reflections
- **Rising sun** with radiating lines
- **Script "Kizmet"** with elegant flourishes
- **"MASSAGE"** in clean, letterspaced sans-serif

**Color versions:**
- **Monochrome brown** (#5a3d2b) - elegant, single-color treatment
- **Full color** - teal water, green hills, warm orange sun

---

## Concept Files

| Concept | File | View |
|---------|------|------|
| Mood Board | [homepage-mood-board.html](./homepage-mood-board.html) | Colors, typography, principles |
| Concept 1 | [homepage-concept-1-faithful.html](./homepage-concept-1-faithful.html) | Faithful Evolution |
| Concept 2 | [homepage-concept-2-nature.html](./homepage-concept-2-nature.html) | Mountain & Water |
| Concept 3 | [homepage-concept-3-earth.html](./homepage-concept-3-earth.html) | Earthy Elegance |

---

## Concept Comparison

### Concept 1: Faithful Evolution
**Approach:** Same page structure, updated color palette

| Aspect | Details |
|--------|---------|
| **Structure** | Identical to current site (Hero → Services → About → Testimonials → CTA) |
| **Colors** | Warm browns from logo; sage retained for eyebrows |
| **Hero** | Logo mark as accent, text headline prominent |
| **Risk Level** | Lowest - familiar to returning visitors |

**Strengths:**
- Preserves what already works
- Easy to implement (color token updates)
- Maintains visitor familiarity

**Tradeoffs:**
- Less dramatic transformation
- Doesn't fully leverage logo's landscape imagery

---

### Concept 2: Mountain & Water
**Approach:** Nature-immersive with teal/green palette from color logo

| Aspect | Details |
|--------|---------|
| **Structure** | Same sections, but hero becomes full-bleed landscape |
| **Colors** | Teal primary, green accents, sun orange highlights |
| **Hero** | Simulated mountain/water landscape behind card-based content |
| **Risk Level** | Medium - more visual change, same information |

**Strengths:**
- Strong PNW sense of place
- Distinctive from competitors
- Aligns with full-color logo version

**Tradeoffs:**
- Needs quality landscape photography/illustration
- More significant development effort
- Might feel less "personal" (nature over therapist)

---

### Concept 3: Earthy Elegance
**Approach:** Dark mode with rich earth tones, premium spa feel

| Aspect | Details |
|--------|---------|
| **Structure** | Same sections with more dramatic spacing |
| **Colors** | Dark browns background, cream text, terracotta accents |
| **Hero** | Bold, centered typography with logo mark focal |
| **Risk Level** | Highest - major aesthetic shift |

**Strengths:**
- Luxurious, premium positioning
- Stands out dramatically
- Evening/relaxation mood

**Tradeoffs:**
- Significant departure from current brand
- May feel too "upscale" for approachable massage therapist
- Dark mode accessibility considerations

---

## Key Design Decisions

### Text vs. Images
All concepts use **real HTML text** for:
- "Kizmet Massage" headline (not the logo wordmark as an image)
- All headings and body copy
- Navigation and buttons

The **logo mark** (hands + mountains illustration) can be used as a visual accent, but the wordmark is rendered as text for:
- SEO indexability
- Screen reader accessibility
- Easy CMS editing
- Faster page loads

### Typography
All concepts maintain:
- **Fraunces** for headings (matches logo script feeling)
- **Plus Jakarta Sans** for body text
- Existing utility classes from the typography system

### Color Token Strategy
The implementation would update CSS custom properties:
```css
/* Current */
--primary: sage green (#5a725c)

/* Proposed (Concept 1 & 3) */
--primary: espresso brown (#5a3d2b)
--accent: terracotta (#c17f59)
/* sage becomes secondary accent */

/* Proposed (Concept 2) */
--primary: teal (#4a8a7a)
--accent: sun orange (#d4956a)
```

---

## Recommendation

**Concept 1 (Faithful Evolution)** is recommended as the primary direction because:

1. Lowest implementation risk
2. Preserves proven page structure
3. Warm browns align with the preferred monochrome logo
4. Clear evolution rather than revolution
5. Easy to layer in elements from Concept 2 or 3 later

**Suggested enhancements from other concepts:**
- Borrow the location badge from Concept 2 (PNW pride)
- Consider the numbered service cards (01, 02, 03) from Concept 3 for visual interest
- Use Concept 3's scroll indicator animation

---

## Next Steps

1. **Review concepts** - Open each HTML file in a browser
2. **Provide feedback** - Which direction resonates?
3. **Hybrid option?** - Mix elements from multiple concepts
4. **Logo placement** - Decide: mark-only, wordmark-only, or both?
5. **Photography** - Current hero image works; consider therapist photo update

---

## Implementation Notes

To implement the chosen direction:

1. **Update CSS variables** in `globals.css`:
   - Primary color shift
   - Add brown/terracotta tokens
   - Adjust muted foreground warmth

2. **Update components** (if choosing Concept 1):
   - Minimal changes - mostly color tokens
   - Navigation logo: use mark + text wordmark
   - Hero: add logo mark as visual element

3. **Sanity CMS**:
   - No schema changes needed
   - Content remains the same
   - New logo image uploaded to media library

4. **Testing**:
   - Check color contrast ratios
   - Verify dark mode still works
   - Test on mobile devices
