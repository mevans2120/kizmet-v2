# Accessibility Audit: Kizmet Massage & Wellness

**Date:** January 30, 2026
**Scope:** Hamburger menu button, muted body copy contrast, general accessibility review

---

## Executive Summary

This audit identified two primary accessibility issues:

1. **Hamburger Menu Button** - Missing ARIA attributes for screen reader users
2. **Muted Body Copy** - Insufficient color contrast against background

The site has a solid foundation of accessibility features already in place, making these issues straightforward to address.

---

## Issue 1: Hamburger Menu Button

**Location:** `src/components/Navigation.tsx:72-80`

### Current Implementation

```tsx
<Button
  variant="ghost"
  size="icon"
  className="md:hidden h-14 w-14 [&_svg]:size-10"
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? <X /> : <Menu />}
</Button>
```

### Accessibility Problems

| Issue | Impact | WCAG Criterion |
|-------|--------|----------------|
| No `aria-label` | Screen readers announce "button" with no context | 4.1.2 Name, Role, Value |
| No `aria-expanded` | Users don't know if menu is open or closed | 4.1.2 Name, Role, Value |
| No `aria-controls` | No programmatic link between button and menu | 1.3.1 Info and Relationships |

### Recommended Fix

```tsx
<Button
  variant="ghost"
  size="icon"
  className="md:hidden h-14 w-14 [&_svg]:size-10"
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? "Close menu" : "Open menu"}
  aria-expanded={isOpen}
  aria-controls="mobile-navigation"
>
  {isOpen ? <X /> : <Menu />}
</Button>
```

The mobile menu container should also receive `id="mobile-navigation"`:

```tsx
{isOpen && (
  <div id="mobile-navigation" className="...">
    {/* menu items */}
  </div>
)}
```

### Priority

**High** - Directly affects screen reader users' ability to navigate the site on mobile.

---

## Issue 2: Muted Body Copy Contrast

**Location:** `src/app/globals.css:25`

### Color Analysis

| Variable | HSL Value | Approximate RGB | Usage |
|----------|-----------|-----------------|-------|
| `--background` | `40 30% 97%` | #FAF8F5 | Page background |
| `--muted-foreground` | `30 15% 45%` | #847362 | Muted text |

### Contrast Ratios

| Combination | Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |
|-------------|-------|-----------------|----------------|
| `text-muted-foreground` on `--background` | **4.3:1** | FAIL | FAIL |
| `text-muted-foreground/60` on `--background` | **2.2:1** | FAIL | FAIL |
| `text-muted-foreground` on `--card` | **~4.0:1** | FAIL | FAIL |

### Where This Appears

The `text-muted-foreground` class is used extensively:

**Primary text (standard muted):**
- Footer description and links (`Footer.tsx:60, 70-81, 89, 99, 106`)
- Testimonial subtitles and locations (`Testimonials.tsx:47, 83`)
- Service descriptions and metadata (`ServicesPreview.tsx:70, 86, 93`)
- About section body paragraphs (`About.tsx:16, 21`)
- Book page descriptions and labels (`Book.tsx:141, 175, 188, 231, 250, 267`)

**Secondary text (60% opacity - most critical):**
- "Tap to call" helper text (`Book.tsx:233`)
- "Tap to copy" helper text (`Book.tsx:252`)
- "Tap for directions" helper text (`Book.tsx:271`)

### Recommended Fixes

#### Option A: Darken the muted foreground color (Recommended)

Change the lightness from 45% to 35% to achieve ~6.5:1 contrast:

```css
/* Before */
--muted-foreground: 30 15% 45%;

/* After */
--muted-foreground: 30 15% 35%;
```

This provides:
- **6.5:1** contrast ratio (passes AA and approaches AAA)
- Maintains the warm, muted aesthetic
- All existing `text-muted-foreground` usages automatically benefit

#### Option B: Create a new accessible muted class

If the current muted color must be preserved for decorative elements:

```css
--muted-foreground-accessible: 30 15% 35%;
```

```typescript
// tailwind.config.ts
muted: {
  DEFAULT: "hsl(var(--muted))",
  foreground: "hsl(var(--muted-foreground))",
  "foreground-accessible": "hsl(var(--muted-foreground-accessible))",
},
```

#### Option C: Remove opacity variants

The `text-muted-foreground/60` pattern should be eliminated entirely. At 2.2:1 contrast, it's severely inaccessible. Replace with:

```tsx
// Before
<p className="text-muted-foreground/60">Tap to call</p>

// After (using the darkened muted-foreground)
<p className="text-muted-foreground text-xs">Tap to call</p>
```

### Priority

**High** - Affects readability for users with low vision, color blindness, or in bright lighting conditions.

---

## Existing Accessibility Strengths

The site already implements several best practices:

### Screen Reader Support
- Decorative images marked with `aria-hidden="true"` (Navigation, Footer, Hero)
- Pagination with proper `aria-label` and `aria-current` attributes
- Breadcrumbs with semantic roles and labels
- Alert components with `role="alert"`

### Keyboard Navigation
- Focus indicators using `focus-visible:ring-2` throughout
- Proper button semantics from shadcn/ui components

### Motion Sensitivity
- `prefers-reduced-motion` detection in Hero component
- Video backgrounds disabled for users who prefer reduced motion

### Semantic HTML
- Proper heading hierarchy (h1-h4)
- Semantic landmarks (`<nav>`, `<footer>`, `<section>`)
- Form inputs with proper label associations

---

## Implementation Plan

### Phase 1: Quick Wins (1-2 hours)

1. **Add ARIA attributes to hamburger button**
   - Add `aria-label`, `aria-expanded`, `aria-controls`
   - Add `id` to mobile menu container

2. **Darken muted foreground color**
   - Update CSS variable from 45% to 35% lightness
   - Test visual appearance across all pages

### Phase 2: Cleanup (1-2 hours)

3. **Remove opacity variants**
   - Search for `text-muted-foreground/` patterns
   - Replace with accessible alternatives

4. **Verify contrast across components**
   - Check all text on card backgrounds
   - Verify dark mode contrast (currently `40 15% 60%` may also need adjustment)

### Phase 3: Validation

5. **Automated testing**
   - Run axe-core or Lighthouse accessibility audit
   - Address any additional findings

6. **Manual testing**
   - Test with VoiceOver/NVDA screen reader
   - Test keyboard-only navigation
   - Test with browser zoom at 200%

---

## Tools for Ongoing Compliance

- **Lighthouse** - Built into Chrome DevTools
- **axe DevTools** - Browser extension for detailed WCAG audits
- **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **eslint-plugin-jsx-a11y** - Linting for React accessibility

---

## WCAG 2.1 Reference

| Issue | Criterion | Level |
|-------|-----------|-------|
| Button labeling | 4.1.2 Name, Role, Value | A |
| Expandable controls | 4.1.2 Name, Role, Value | A |
| Color contrast (text) | 1.4.3 Contrast (Minimum) | AA |
| Color contrast (enhanced) | 1.4.6 Contrast (Enhanced) | AAA |

---

## Summary

| Issue | Severity | Effort | Priority |
|-------|----------|--------|----------|
| Hamburger button ARIA | High | Low | 1 |
| Muted text contrast | High | Low | 1 |
| Remove opacity variants | Medium | Low | 2 |
| Dark mode contrast check | Medium | Low | 3 |

Both primary issues can be resolved with minimal code changes while maintaining the site's visual design aesthetic.
