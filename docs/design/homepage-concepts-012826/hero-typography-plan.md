# Hero Typography Implementation Plan

## Overview

Update the homepage hero section to use the new stacked typography treatment with the Kizmet Hands SVG logo.

## Design Changes

1. **Logo**: Use `Kizmet-Hands.svg` with zero margin to text
2. **"Kizmet"**: Large Fraunces serif, stacked above
3. **"Massage"**: Smaller, uppercase, with decorative accent strokes (fading lines on each side)
4. **Wonky Fraunces**: Enable WONK axis for playful letterforms (requires font config update)

## Files to Modify

- `src/page-content/home-page.tsx` - Hero markup structure
- `src/app/globals.css` - Add hero typography utility classes
- `next.config.js` or font config - Ensure Fraunces WONK axis is loaded

## Implementation Steps

1. Update Fraunces font import to include WONK axis
2. Add CSS classes for hero title treatment:
   - `.hero-title-kizmet` - large, block display
   - `.hero-title-massage` - small, uppercase, flex with pseudo-element strokes
3. Update hero component markup to use stacked structure
4. Adjust logo spacing (negative margin or layout changes)

## CSS Approach

```css
/* Stacked hero title */
.hero-title-kizmet {
  display: block;
  font-size: clamp(52px, 10vw, 108px);
}

.hero-title-massage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: clamp(16px, 3vw, 24px);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* Accent strokes via pseudo-elements */
.hero-title-massage::before,
.hero-title-massage::after {
  content: '';
  width: 24px;
  height: 1px;
  background: linear-gradient(to right, var(--terracotta-400), transparent);
}
```

## Open Questions

- Should WONK be applied globally to all Fraunces headings or just hero?
- Exact sizing for responsive breakpoints?
