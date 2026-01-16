# Design Tokens & Typography Audit

**Date:** 2026-01-15
**Project:** Kizmet Massage & Wellness

---

## Executive Summary

The codebase has a **solid foundation** for design tokens (colors, fonts) but lacks consistency in typography application. Font weights and letter spacing use inline styles instead of tokens, and there are no reusable typography utility classes.

| Aspect | Status | Notes |
|--------|--------|-------|
| Color Tokens | Excellent | Well-organized CSS variables with light/dark variants |
| Font Family Tokens | Good | Properly defined in tailwind.config.ts |
| Font Size Scale | Fair | Uses Tailwind defaults, somewhat consistent |
| Font Weight | Poor | Hardcoded inline styles instead of tokens |
| Letter Spacing | Poor | Inconsistent inline styles |
| Typography Utilities | Missing | No reusable @layer components |
| Documentation | Missing | No design token documentation |

---

## Current Token Organization

### Colors (globals.css)

Well-structured CSS variables using HSL format:

```css
:root {
  --background: 40 30% 97%;
  --foreground: 30 20% 15%;
  --primary: 145 25% 36%;        /* Sage green */
  --accent: 18 50% 55%;          /* Terracotta */

  /* Brand colors */
  --sage-500: 145 25% 36%;
  --cream-100: 40 35% 95%;
  --terracotta-500: 18 50% 55%;
}
```

### Font Families (tailwind.config.ts)

```ts
fontFamily: {
  heading: ['var(--font-fraunces)', 'Fraunces', 'serif'],
  body: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
}
```

### Typography Base (globals.css)

```css
h1, h2, h3, h4, h5, h6 {
  @apply font-heading;
}
```

---

## Font Size Usage Analysis

| Size | Occurrences | Primary Usage |
|------|-------------|---------------|
| `text-xs` | 1 | Footer copyright |
| `text-sm` | 39 | Labels, meta text, buttons |
| `text-base` | 27 | Body paragraphs, links |
| `text-lg` | 3 | Button XL variant |
| `text-xl` | 21 | Page intros, subheadlines |
| `text-2xl` | 4 | Navigation logo, card titles |
| `text-3xl` | 24 | Section headings (h2), logo initials |
| `text-4xl` | 2 | Footer logo |
| `text-5xl` | 19 | Page titles (h1) |
| `text-6xl` | 14 | Page titles (h1 desktop), drop caps |
| `text-8xl` | 1 | Hero title (desktop) |
| `text-9xl` | 2 | Decorative quote marks |

---

## Inconsistencies Found

### 1. Inline Font Weight Styles

Multiple components use inline `style={{ fontWeight: X }}` instead of Tailwind classes:

| File | Lines | Values |
|------|-------|--------|
| `src/components/Hero.tsx` | 49, 55 | 500, 400 |
| `src/components/Navigation.tsx` | 39, 46 | 500, 400 |
| `src/components/Footer.tsx` | 32, 34 | 500, 400 |

**Should use:** `font-medium` (500) and `font-normal` (400)

### 2. Inconsistent Letter Spacing

| File | Value | Context |
|------|-------|---------|
| Navigation.tsx | `-0.01em` | Logo text |
| Hero.tsx | `-0.02em` | Hero headline |

No standardized letter spacing tokens exist.

### 3. Heading Size Variations

**Page Titles (h1):**
- Standard pages: `text-5xl md:text-6xl`
- Hero: `text-5xl md:text-8xl` (larger)

**Section Headings (h2):**
- Most: `text-3xl`
- Some: `text-3xl md:text-4xl`

### 4. Repeated Typography Patterns

This pattern appears in 10+ places with no utility class:
```tsx
className="font-heading text-3xl font-medium text-foreground"
```

### 5. Eyebrow Text (Consistent - Good!)

All eyebrows use the same pattern:
```tsx
className="text-sm uppercase tracking-[0.2em] text-primary"
```

---

## Recommendations

### Priority 1: Add Letter Spacing Tokens

**tailwind.config.ts:**
```ts
letterSpacing: {
  'heading-tight': '-0.02em',
  'heading': '-0.01em',
  'caps': '0.2em',
}
```

### Priority 2: Create Typography Utility Classes

**globals.css:**
```css
@layer components {
  /* Headings */
  .text-page-title {
    @apply font-heading text-5xl md:text-6xl font-medium text-foreground;
  }

  .text-section-title {
    @apply font-heading text-3xl font-medium text-foreground;
  }

  .text-card-title {
    @apply font-heading text-xl font-medium text-foreground;
  }

  /* Body */
  .text-body-lg {
    @apply font-body text-xl text-foreground leading-relaxed;
  }

  .text-body {
    @apply font-body text-base text-foreground leading-relaxed;
  }

  .text-body-muted {
    @apply font-body text-base text-muted-foreground leading-relaxed;
  }

  /* Utility */
  .text-eyebrow {
    @apply font-body text-sm uppercase tracking-[0.2em] text-primary;
  }

  /* Logo - the stacked K/M treatment */
  .text-logo-line {
    @apply font-heading text-2xl tracking-heading;
  }

  .text-logo-initial {
    @apply text-3xl;
  }
}
```

### Priority 3: Remove Inline Styles

Replace inline `style={{ fontWeight: X }}` with:
- `font-normal` for weight 400
- `font-medium` for weight 500

Replace inline `letterSpacing` with new Tailwind classes.

### Priority 4: Document the Type Scale

| Token | Mobile | Desktop | Weight | Use Case |
|-------|--------|---------|--------|----------|
| `page-title` | 3rem (48px) | 3.75rem (60px) | 500 | Page h1 |
| `hero-title` | 3rem (48px) | 6rem (96px) | 500/400 | Hero h1 |
| `section-title` | 1.875rem (30px) | 1.875rem (30px) | 500 | Section h2 |
| `card-title` | 1.25rem (20px) | 1.25rem (20px) | 500 | Card h3 |
| `body-lg` | 1.25rem (20px) | 1.25rem (20px) | 400 | Intros |
| `body` | 1rem (16px) | 1rem (16px) | 400 | Paragraphs |
| `small` | 0.875rem (14px) | 0.875rem (14px) | 400 | Labels |
| `xs` | 0.75rem (12px) | 0.75rem (12px) | 400 | Meta |

---

## Files to Update

1. **tailwind.config.ts** - Add letterSpacing tokens
2. **globals.css** - Add typography utility classes
3. **Hero.tsx** - Remove inline styles (lines 49, 55)
4. **Navigation.tsx** - Remove inline styles (lines 39, 46)
5. **Footer.tsx** - Remove inline styles (lines 32, 34)
6. **All page-content/*.tsx** - Use new utility classes

---

## Color Token Reference

For completeness, here are the current color tokens:

| Token | HSL | Hex (approx) | Usage |
|-------|-----|--------------|-------|
| `--foreground` | 30 20% 15% | #2d2926 | Text |
| `--muted-foreground` | 30 15% 45% | #7a7067 | Secondary text |
| `--primary` | 145 25% 36% | #5a725c | Sage green |
| `--accent` | 18 50% 55% | #c4785a | Terracotta |
| `--background` | 40 30% 97% | #faf8f5 | Page background |
| `--card` | 40 25% 95% | #f5f1ec | Card background |

---

## Next Steps

1. [ ] Add letter spacing tokens to Tailwind config
2. [ ] Create typography utility classes in globals.css
3. [ ] Refactor components to use new utilities
4. [ ] Remove all inline style={{ fontWeight }} usage
5. [ ] Create a living style guide page (optional)
