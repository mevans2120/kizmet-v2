# About Page Design Concepts

**Project:** Kizmet Massage & Wellness
**Date:** January 14, 2026
**Objective:** Create three distinct About page concepts with space for photos, bio, and approach sections

---

## Design Challenge

Design an About page that:
- Introduces Destiny, the massage therapist and founder
- Communicates her philosophy and approach to healing
- Features space for portrait/environmental photography
- Includes bio/credentials and treatment philosophy
- Invites visitors to book a session

---

## Concept Overview

| Aspect | Concept 1: Classic Sanctuary | Concept 2: Botanical Extension | Concept 3: Wabi-Sabi |
|--------|------------------------------|-------------------------------|----------------------|
| **Direction** | Within existing system | Extended system | Wildcard |
| **Palette** | Sage/Cream/Terracotta | + Forest green, Honey gold | Ink/Stone/Paper + Warmth |
| **Typography** | Cormorant + Inter | Newsreader + DM Sans | Fraunces + Manrope |
| **Photo Style** | Single portrait, rounded | Multi-photo organic gallery | Single contemplative |
| **Layout** | Symmetrical two-column | Flowing, layered | Asymmetric, spacious |
| **Mood** | Warm spa elegance | Lush botanical richness | Zen minimalism |

---

## Concept 1: Classic Sanctuary

**File:** `about-concept-1-classic-sanctuary.html`

### Design Direction
Uses the exact existing Kizmet design system: sage greens, warm cream backgrounds, terracotta accents. Cormorant Garamond headings with Inter body text. Clean, spa-like aesthetic with generous whitespace.

### Key Features
- **Hero:** Asymmetric two-column layout with portrait photo featuring decorative sage circle accent
- **Quote Section:** Centered pull quote with oversized terracotta quotation mark
- **Bio:** Sidebar credentials list + main narrative with elegant drop cap
- **Approach:** Three hover-interactive cards with sage top border accent
- **Photo Spaces:** Single portrait (4:5 ratio), rounded corners

### Strengths
- Perfectly aligned with existing brand identity
- Familiar, approachable aesthetic
- Easy to implement with existing components
- Professional and polished

### Tradeoffs
- Safe choice, doesn't push creative boundaries
- May feel similar to other wellness sites
- Single photo limits storytelling opportunity

---

## Concept 2: Botanical Extension

**File:** `about-concept-2-botanical-extension.html`

### Design Direction
Builds on the existing palette with deeper forest greens and golden honey tones. Adds organic shapes, botanical patterns, and layered textures. Uses Newsreader (elegant serif) and DM Sans (warm sans-serif) for a richer typographic palette.

### Extended Palette
- **Forest-700:** Deep green (hsl 152, 35%, 22%)
- **Forest-800:** Near-black green (hsl 155, 40%, 15%)
- **Honey-300/400/500:** Golden warm tones (hsl 34-38)
- **Stone-100/200:** Neutral warm grays

### Key Features
- **Hero:** Overlapping photo gallery with organic shapes (main portrait + secondary detail shot)
- **Bio Section:** Dark forest background with decorative botanical stripe border
- **Approach:** Four numbered cards with organic border-radius and hover animations
- **Photo Spaces:** Multiple photos (portrait, detail, environmental) in organic arrangement
- **Decorative Elements:** Background shapes, accent circles, gradient overlays

### Strengths
- Natural evolution of the brand
- Multiple photos tell a richer story
- Visually distinctive without breaking brand identity
- Organic shapes reinforce wellness/nature theme

### Tradeoffs
- More complex to implement
- Extended palette requires documentation
- May need additional photography investment

---

## Concept 3: Wabi-Sabi (Wildcard)

**File:** `about-concept-3-wabi-sabi.html`

### Design Direction
A completely different aesthetic inspired by Japanese minimalism and wabi-sabi philosophy (finding beauty in imperfection). Near-monochrome palette with generous negative space, asymmetric layouts, and contemplative pacing.

### New Palette
- **Ink/Charcoal/Stone:** Deep to mid grays with warm undertone
- **Sand/Rice/Paper:** Light warm neutrals
- **Warmth:** Single orange accent (hsl 25, 70%, 55%) used sparingly

### Key Features
- **Opening:** Large centered contemplative statement
- **Hero:** Asymmetric photo/text split with oversized heading
- **Bio:** Oversized section numbers as decorative elements
- **Approach:** Dark section with grid-based numbered philosophy points
- **Photo Spaces:** Single powerful portrait with artistic warm overlay
- **Vertical Text:** Subtle brand name on right edge (Japanese typography influence)

### Strengths
- Highly distinctive and memorable
- Conveys thoughtfulness and intentionality
- Contemplative feel aligns with healing/wellness
- Creates strong emotional response

### Tradeoffs
- Significant departure from current brand
- May require full site redesign to feel cohesive
- Minimal palette might feel stark to some visitors
- Single photo limits variety

---

## Photo Requirements

All concepts require professional photography. Recommendations:

### Portrait Photography
- Natural lighting preferred
- Environmental portraits work well (in treatment space)
- Show warmth and approachability
- Avoid overly posed/corporate feel

### Environmental Photography
- Treatment room / massage table
- Hands at work (detail shots)
- Studio details (plants, towels, oils)
- Natural light streaming through windows

### Photo Quantities by Concept
| Concept | Minimum Photos | Ideal Photos |
|---------|----------------|--------------|
| Classic Sanctuary | 1 portrait | 1 portrait + 1 environmental |
| Botanical Extension | 2 (portrait + detail) | 3 (portrait + detail + space) |
| Wabi-Sabi | 1 contemplative portrait | 1 portrait + 1 space |

---

## Implementation Notes

### Concept 1 (Lowest Effort)
- Uses existing color variables and fonts
- Can leverage existing shadcn/ui components
- Minimal CSS additions needed

### Concept 2 (Medium Effort)
- Requires extending Tailwind config with new colors
- New organic shapes need custom CSS
- Consider adding Newsreader/DM Sans to font stack
- Photo gallery needs responsive handling

### Concept 3 (Highest Effort)
- Complete typography change (Fraunces + Manrope)
- New color system throughout
- Would benefit from site-wide application for cohesion
- Vertical text needs careful responsive handling

---

## Recommendation

**For immediate implementation:** Concept 1 (Classic Sanctuary)
- Fastest to build, uses existing system, professional result

**For brand evolution:** Concept 2 (Botanical Extension)
- Adds richness without losing identity, good middle ground

**For brand refresh:** Concept 3 (Wabi-Sabi)
- Consider if planning broader site redesign, creates strong differentiation

---

## Next Steps

1. [ ] Review all three concepts in browser
2. [ ] Select direction (or hybrid approach)
3. [ ] Commission professional photography
4. [ ] If Concept 2 or 3: Update design system documentation
5. [ ] Implement approved concept in React/Next.js
6. [ ] Test responsive behavior across devices

---

## Files in This Package

```
docs/design/about-page-concepts-011426/
├── about-concept-1-classic-sanctuary.html
├── about-concept-2-botanical-extension.html
├── about-concept-3-wabi-sabi.html
└── about-page-overview.md (this file)
```

Open HTML files directly in a browser to preview each concept.
