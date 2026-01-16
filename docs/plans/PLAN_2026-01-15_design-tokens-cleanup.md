# Plan: Design Tokens & Typography Cleanup

**Date:** 2026-01-15
**Project:** Kizmet Massage & Wellness
**Related Research:** [Design Tokens Audit](../design/DESIGN-TOKENS-AUDIT.md)

---

## Objective

Standardize typography across the codebase by:
1. Eliminating inline styles for font-weight and letter-spacing
2. Creating reusable typography utility classes
3. Documenting the type scale for future development
4. Updating CLAUDE.md with typography rules

---

## Background

The audit revealed inconsistent typography patterns:
- 3 components use inline `style={{ fontWeight }}` instead of Tailwind classes
- Letter spacing varies between `-0.01em` and `-0.02em` with no standard
- The same heading pattern (`font-heading text-3xl font-medium text-foreground`) appears 10+ times
- No documentation exists for the type scale

---

## Implementation Steps

### Step 1: Add Typography Tokens to Tailwind Config

**File:** `tailwind.config.ts`

Add letter spacing tokens:
```ts
extend: {
  letterSpacing: {
    'tighter': '-0.02em',  // Hero headlines
    'tight': '-0.01em',    // Logo, standard headings
    'caps': '0.2em',       // Eyebrow/uppercase text
  },
  // ... existing config
}
```

---

### Step 2: Create Typography Utility Classes

**File:** `src/app/globals.css`

Add to `@layer components`:

```css
@layer components {
  /* === PAGE HEADINGS === */
  .text-page-title {
    @apply font-heading text-5xl md:text-6xl font-medium text-foreground tracking-tight;
  }

  .text-hero-title {
    @apply font-heading text-5xl md:text-8xl font-medium tracking-tighter;
  }

  /* === SECTION HEADINGS === */
  .text-section-title {
    @apply font-heading text-3xl font-medium text-foreground;
  }

  .text-section-title-lg {
    @apply font-heading text-3xl md:text-4xl font-medium text-foreground;
  }

  /* === CARD/COMPONENT HEADINGS === */
  .text-card-title {
    @apply font-heading text-xl font-medium text-foreground;
  }

  .text-card-title-lg {
    @apply font-heading text-2xl md:text-3xl font-medium text-foreground;
  }

  /* === BODY TEXT === */
  .text-body-lg {
    @apply font-body text-xl leading-relaxed;
  }

  .text-body {
    @apply font-body text-base leading-relaxed;
  }

  /* === UTILITY TEXT === */
  .text-eyebrow {
    @apply font-body text-sm uppercase tracking-caps text-primary font-medium;
  }

  .text-meta {
    @apply font-body text-sm text-muted-foreground;
  }

  /* === LOGO TEXT === */
  .text-logo {
    @apply font-heading text-2xl tracking-tight;
  }

  .text-logo-initial {
    @apply text-3xl;
  }
}
```

---

### Step 3: Refactor Navigation Component

**File:** `src/components/Navigation.tsx`

**Before:**
```tsx
<span
  className="font-heading text-2xl text-foreground"
  style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
>
```

**After:**
```tsx
<span className="text-logo text-foreground font-medium">
```

Remove all inline `style={{ }}` attributes.

---

### Step 4: Refactor Hero Component

**File:** `src/components/Hero.tsx`

**Before:**
```tsx
<span
  className="text-foreground"
  style={{ fontWeight: 500, letterSpacing: "-0.02em" }}
>
  Kizmet
</span>
```

**After:**
```tsx
<span className="text-foreground font-medium tracking-tighter">
  Kizmet
</span>
```

---

### Step 5: Refactor Footer Component

**File:** `src/components/Footer.tsx`

**Before:**
```tsx
<span className="text-foreground" style={{ fontWeight: 500 }}>
```

**After:**
```tsx
<span className="text-foreground font-medium">
```

---

### Step 6: Update Page Content Components (Optional - Lower Priority)

Replace repeated patterns in page-content files:

| File | Replace | With |
|------|---------|------|
| `About.tsx` | `font-heading text-5xl md:text-6xl font-medium text-foreground` | `text-page-title` |
| `Services.tsx` | `font-heading text-3xl font-medium text-foreground` | `text-section-title` |
| `Book.tsx` | `text-sm uppercase tracking-[0.2em] text-primary` | `text-eyebrow` |
| `Policies.tsx` | Same patterns | Same utilities |

---

### Step 7: Create Typography Reference Doc

**File:** `docs/design/TYPOGRAPHY.md`

Document the complete type scale with examples, usage guidelines, and do's/don'ts.

---

### Step 8: Update CLAUDE.md

**File:** `CLAUDE.md`

Add typography section:

```markdown
## Typography

**Reference:** See [Typography Guide](docs/design/TYPOGRAPHY.md) for the complete type scale.

**Rules:**
- Use utility classes from globals.css (e.g., `text-page-title`, `text-section-title`, `text-eyebrow`)
- Never use inline `style={{ fontWeight }}` - use `font-normal` (400) or `font-medium` (500)
- Never use inline `style={{ letterSpacing }}` - use `tracking-tight`, `tracking-tighter`, or `tracking-caps`
- Headings: Always use `font-heading` (Fraunces)
- Body: Always use `font-body` (Plus Jakarta Sans)

**Quick Reference:**
| Element | Class |
|---------|-------|
| Page h1 | `text-page-title` |
| Section h2 | `text-section-title` |
| Card title | `text-card-title` |
| Intro paragraph | `text-body-lg text-foreground/80` |
| Eyebrow label | `text-eyebrow` |
| Logo text | `text-logo` + `text-logo-initial` for K/M |
```

---

## File Change Summary

| File | Change Type | Priority |
|------|-------------|----------|
| `tailwind.config.ts` | Add letterSpacing tokens | High |
| `src/app/globals.css` | Add typography utilities | High |
| `src/components/Navigation.tsx` | Remove inline styles | High |
| `src/components/Hero.tsx` | Remove inline styles | High |
| `src/components/Footer.tsx` | Remove inline styles | High |
| `docs/design/TYPOGRAPHY.md` | Create new file | Medium |
| `CLAUDE.md` | Add typography section | Medium |
| `src/page-content/*.tsx` | Use new utilities | Low |

---

## Verification

After implementation:
1. [ ] Run `npm run build` - no errors
2. [ ] Visual check: Navigation logo looks identical
3. [ ] Visual check: Hero headline looks identical
4. [ ] Visual check: Footer logo looks identical
5. [ ] All pages render correctly with no style changes
6. [ ] CLAUDE.md updated with typography rules

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Visual regression | Medium | Medium | Side-by-side comparison before/after |
| Missing a style replacement | Low | Low | Grep for remaining inline styles |
| Breaking responsive behavior | Low | Medium | Test all breakpoints |

---

## Success Criteria

- [ ] Zero inline `style={{ fontWeight }}` in codebase
- [ ] Zero inline `style={{ letterSpacing }}` in codebase
- [ ] Typography utility classes available in globals.css
- [ ] Letter spacing tokens in Tailwind config
- [ ] CLAUDE.md documents typography rules
- [ ] No visual changes to the site
