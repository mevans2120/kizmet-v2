# Typography Guide

**Project:** Kizmet Massage & Wellness
**Last Updated:** 2026-01-15

---

## Font Families

| Token | Font | Usage |
|-------|------|-------|
| `font-heading` | Fraunces | All headings, logo |
| `font-body` | Plus Jakarta Sans | Body text, UI elements |

---

## Letter Spacing Tokens

| Class | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | -0.02em | Hero headlines |
| `tracking-tight` | -0.01em | Logo, standard headings |
| `tracking-caps` | 0.2em | Eyebrow/uppercase text |

---

## Typography Utility Classes

### Page Headings

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-page-title` | `font-heading text-5xl md:text-6xl font-medium text-foreground tracking-tight` | Main page h1 |
| `text-hero-title` | `font-heading text-5xl md:text-8xl font-medium tracking-tighter` | Hero section h1 |

### Section Headings

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-section-title` | `font-heading text-3xl font-medium text-foreground` | Standard section h2 |
| `text-section-title-lg` | `font-heading text-3xl md:text-4xl font-medium text-foreground` | Large section h2 |

### Card/Component Headings

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-card-title` | `font-heading text-xl font-medium text-foreground` | Card h3/h4 |
| `text-card-title-lg` | `font-heading text-2xl md:text-3xl font-medium text-foreground` | Large card title |

### Body Text

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-body-lg` | `font-body text-xl leading-relaxed` | Intro paragraphs |
| `text-body` | `font-body text-base leading-relaxed` | Standard body copy |

### Utility Text

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-eyebrow` | `font-body text-sm uppercase tracking-caps text-primary font-medium` | Section labels |
| `text-meta` | `font-body text-sm text-muted-foreground` | Timestamps, meta info |

### Logo Text

| Class | Styles | Use Case |
|-------|--------|----------|
| `text-logo` | `font-heading text-2xl tracking-tight` | Navigation logo |
| `text-logo-lg` | `font-heading text-3xl tracking-tight` | Footer logo |
| `text-logo-initial` | `text-3xl` | K/M initials (nav) |
| `text-logo-initial-lg` | `text-4xl` | K/M initials (footer) |

---

## Type Scale Reference

| Size | Tailwind | Pixels | Rem | Usage |
|------|----------|--------|-----|-------|
| xs | `text-xs` | 12px | 0.75 | Copyright, fine print |
| sm | `text-sm` | 14px | 0.875 | Labels, meta text |
| base | `text-base` | 16px | 1 | Body paragraphs |
| lg | `text-lg` | 18px | 1.125 | Large buttons |
| xl | `text-xl` | 20px | 1.25 | Intro text, subheadlines |
| 2xl | `text-2xl` | 24px | 1.5 | Nav logo, small titles |
| 3xl | `text-3xl` | 30px | 1.875 | Section headings, logo initials |
| 4xl | `text-4xl` | 36px | 2.25 | Footer logo initials |
| 5xl | `text-5xl` | 48px | 3 | Page titles (mobile) |
| 6xl | `text-6xl` | 60px | 3.75 | Page titles (desktop) |
| 8xl | `text-8xl` | 96px | 6 | Hero title (desktop) |

---

## Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text, secondary elements |
| `font-medium` | 500 | Headings, emphasis, primary elements |

---

## Rules

### Do

- Use utility classes from `globals.css` for consistent typography
- Use `font-heading` (Fraunces) for all headings
- Use `font-body` (Plus Jakarta Sans) for body text
- Use `font-medium` for headings and emphasis
- Use the defined `tracking-*` classes for letter spacing

### Don't

- Use inline `style={{ fontWeight }}` - use `font-normal` or `font-medium`
- Use inline `style={{ letterSpacing }}` - use `tracking-tight`, `tracking-tighter`, or `tracking-caps`
- Mix font families within a single heading
- Use arbitrary letter spacing values like `tracking-[0.2em]` - use `tracking-caps` instead

---

## Examples

### Page Title
```tsx
<h1 className="text-page-title">About Kizmet</h1>
```

### Section with Eyebrow
```tsx
<span className="text-eyebrow">Our Services</span>
<h2 className="text-section-title mt-2">What We Offer</h2>
```

### Body with Intro
```tsx
<p className="text-body-lg text-foreground/80 mb-6">
  Welcome to Kizmet Massage & Wellness...
</p>
<p className="text-body text-muted-foreground">
  Regular body text here...
</p>
```

### Navigation Logo
```tsx
<span className="text-logo text-foreground font-medium">
  <span className="text-logo-initial">K</span>izmet
</span>
<span className="text-logo text-primary -mt-4">
  <span className="text-logo-initial">M</span>assage
</span>
```
