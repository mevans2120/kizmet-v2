# Homepage Fade Edge Implementation Plan

**Date:** January 14, 2026
**Scope:** Homepage only
**Status:** Ready for implementation

---

## Overview

Replace the bouncing mouse scroll indicator on the homepage with a subtle fade edge overlay. The hero section will fade into the background color at the bottom, implying continuation without an explicit UI element.

---

## Current State

The Hero component (`src/components/Hero.tsx`) has a bouncing mouse icon at lines 40-45:

```tsx
{/* Scroll Indicator */}
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
  <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2">
    <div className="w-1 h-3 bg-muted-foreground/50 rounded-full" />
  </div>
</div>
```

---

## Implementation Steps

### Step 1: Remove Bouncing Mouse Icon

**File:** `src/components/Hero.tsx`

Delete the scroll indicator div (lines 40-45).

### Step 2: Add Fade Overlay

**File:** `src/components/Hero.tsx`

Add a new div inside the hero section with a gradient overlay:

```tsx
{/* Fade Edge */}
<div
  className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-20"
  style={{
    background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.2) 20%, hsl(var(--background) / 0.5) 40%, hsl(var(--background) / 0.8) 70%, hsl(var(--background)) 100%)'
  }}
/>
```

**Alternative using Tailwind (if gradient classes are configured):**

```tsx
{/* Fade Edge */}
<div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-20" />
```

---

## Technical Notes

- **Height:** 176px (`h-44`) provides a smooth fade without being too aggressive
- **z-index:** `z-20` ensures the fade sits above the background image overlay (`z-10` is on content)
- **pointer-events-none:** Allows clicks to pass through to any elements beneath
- **CSS variable:** Uses `hsl(var(--background))` to match the site's background color

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/Hero.tsx` | Remove scroll indicator, add fade overlay |

---

## Testing

- [ ] Verify fade is visible on homepage
- [ ] Verify gradient matches background color seamlessly
- [ ] Check on mobile viewport
- [ ] Ensure no visual jump when scrolling past the fade
- [ ] Confirm buttons in hero are still clickable (pointer-events-none working)

---

## Rollback

If the fade approach doesn't work well, the original scroll indicator code can be restored from git history or by re-adding the bouncing mouse div.
