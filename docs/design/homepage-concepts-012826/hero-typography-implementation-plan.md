# Hero Typography Implementation Plan

## Overview

Update the homepage hero and navigation to use the stacked typography treatment from Concept 1, with variable WONK settings for different brand elements:

- **"Kizmet"**: 100% WONK (playful, hand-drawn feel)
- **"Massage"**: 0% WONK (clean, professional)

## Current State

### Font Configuration (`src/app/layout.tsx`)
```typescript
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],  // Only opsz axis loaded
})
```

### Components Affected
1. **Hero** (`src/components/Hero.tsx`) - Main headline
2. **Navigation** (`src/components/Navigation.tsx`) - Logo text

---

## Implementation Steps

### Step 1: Add WONK Axis to Fraunces Font

**File:** `src/app/layout.tsx`

```typescript
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'WONK'],  // Add WONK axis
})
```

### Step 2: Add Typography Utility Classes

**File:** `src/app/globals.css`

Add new utility classes for wonky Fraunces text:

```css
/* Fraunces WONK variations */
.font-wonky {
  font-variation-settings: 'WONK' 1, 'opsz' 144;
}

.font-wonky-sm {
  font-variation-settings: 'WONK' 1, 'opsz' 72;
}

.font-steady {
  font-variation-settings: 'WONK' 0, 'opsz' 144;
}

.font-steady-sm {
  font-variation-settings: 'WONK' 0, 'opsz' 24;
}

/* Hero title stacked layout */
.hero-title-kizmet {
  display: block;
  font-variation-settings: 'WONK' 1, 'opsz' 144;
}

.hero-title-massage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: clamp(1rem, 3vw, 1.5rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: 0.5rem;
  font-variation-settings: 'WONK' 0, 'opsz' 24;
}

/* Accent strokes for "Massage" */
.hero-title-massage::before,
.hero-title-massage::after {
  content: '';
  width: 1.5rem;
  height: 1px;
}

.hero-title-massage::before {
  background: linear-gradient(to left, hsl(var(--primary)), transparent);
}

.hero-title-massage::after {
  background: linear-gradient(to right, hsl(var(--primary)), transparent);
}

/* Navigation logo WONK variations */
.nav-logo-kizmet {
  font-variation-settings: 'WONK' 1, 'opsz' 48;
}

.nav-logo-massage {
  font-variation-settings: 'WONK' 0, 'opsz' 24;
}
```

### Step 3: Update Hero Component

**File:** `src/components/Hero.tsx`

Update the headline structure from:
```tsx
<h1 className="text-5xl md:text-8xl font-heading tracking-tighter">
  <span className="text-secondary-foreground">Kizmet</span>{' '}
  <span className="text-primary">Massage</span>
</h1>
```

To:
```tsx
<h1 className="font-heading text-center">
  <span className="hero-title-kizmet text-5xl md:text-8xl tracking-tighter text-secondary-foreground">
    Kizmet
  </span>
  <span className="hero-title-massage text-primary">
    Massage
  </span>
</h1>
```

### Step 4: Update Navigation Component

**File:** `src/components/Navigation.tsx`

Update the logo from:
```tsx
<Link href="/" className="flex flex-col leading-none font-heading text-logo tracking-tight">
  <span>
    <span className="text-logo-initial text-secondary-foreground">K</span>
    <span className="text-secondary-foreground">izmet</span>
  </span>
  <span className="-mt-4">
    <span className="text-logo-initial text-primary">M</span>
    <span className="text-primary">assage</span>
  </span>
</Link>
```

To:
```tsx
<Link href="/" className="flex flex-col leading-none font-heading text-logo tracking-tight">
  <span className="nav-logo-kizmet">
    <span className="text-logo-initial text-secondary-foreground">K</span>
    <span className="text-secondary-foreground">izmet</span>
  </span>
  <span className="nav-logo-massage -mt-4">
    <span className="text-logo-initial text-primary">M</span>
    <span className="text-primary">assage</span>
  </span>
</Link>
```

---

## File Summary

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add `'WONK'` to Fraunces axes array |
| `src/app/globals.css` | Add WONK utility classes and hero typography |
| `src/components/Hero.tsx` | Update headline to stacked layout with WONK classes |
| `src/components/Navigation.tsx` | Add WONK classes to logo text |

---

## Design Token Reference

### WONK Axis Values
- `'WONK' 1` = Full wonky (playful, hand-drawn letterforms)
- `'WONK' 0` = Steady (clean, traditional letterforms)

### Optical Size (opsz) Recommendations
- `144` = Large display text (hero headlines)
- `72` = Medium display (section titles)
- `48` = Navigation logo
- `24` = Small text (uppercase labels)

---

## Verification Checklist

- [ ] Fraunces font loads with WONK axis (check Network tab)
- [ ] "Kizmet" in hero has playful, wonky letterforms
- [ ] "Massage" in hero has clean, steady letterforms
- [ ] Accent strokes appear on either side of "Massage"
- [ ] Navigation logo shows same WONK differentiation
- [ ] Responsive behavior works on mobile
- [ ] No layout shift on font load

---

## Open Questions

1. **Footer logo**: Should the footer also use this WONK differentiation?
2. **Hands SVG**: Should we add the Kizmet-Hands.svg above the hero text?
3. **Spacing**: Current negative margin (`-mt-4`) on nav logo - adjust for new layout?

---

## Rollback Plan

If issues arise, revert by:
1. Remove `'WONK'` from axes array in layout.tsx
2. Remove new CSS classes from globals.css
3. Restore original hero/nav markup

The design system remains backward compatible since new classes are additive.
