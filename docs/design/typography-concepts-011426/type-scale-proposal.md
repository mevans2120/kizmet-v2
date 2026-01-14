# Type Scale Proposal

**Date:** January 14, 2026
**Goal:** Consolidate from 13 sizes to 4 (+1 for forms)

---

## Proposed Type Scale

| Role | Size | Tailwind | Use Case |
|------|------|----------|----------|
| **Display** | 48px / 64px | `text-5xl` / `md:text-6xl` | Page titles, hero |
| **Heading** | 32px | `text-3xl` | Section headings, card titles |
| **Lead** | 20px | `text-xl` | Subtitles, emphasized text |
| **Body** | 16px | `text-base` | Everything else |
| *Form* | 14px | `text-sm` | Form labels, inputs only |

---

## Current → Proposed Mapping

### Display (48px / 64px)
**Responsive:** `text-5xl md:text-6xl`

Currently used as:
- `text-5xl md:text-7xl` → Hero "Kizmet"
- `text-5xl md:text-6xl` → Page titles (Services, Book, Policies)
- `text-4xl md:text-5xl` → Section headings (About, ServicesPreview, CTA)
- `text-6xl` → 404 page

**Consolidate to:** `text-5xl md:text-6xl` for all page/hero titles

---

### Heading (32px)
**Class:** `text-3xl`

Currently used as:
- `text-2xl` → Card titles, nav logo, footer headings
- `text-3xl` → Section subheadings
- `text-2xl md:text-3xl` → Policy section headings
- `text-3xl md:text-4xl` → About section headings

**Consolidate to:** `text-3xl` for all section/card headings

---

### Lead (20px)
**Class:** `text-xl`

Currently used as:
- `text-lg` → Body text, subtitles, footer headings
- `text-xl` → 404 description
- `text-lg md:text-xl` → Hero description

**Consolidate to:** `text-xl` for subtitles and emphasized body text

---

### Body (16px)
**Class:** `text-base`

Currently used as:
- `text-sm` → Nav links, descriptions, body text
- `text-base` → Hero tagline
- `text-lg` → Various body text

**Consolidate to:** `text-base` for all body text, nav links, descriptions

---

### Form (14px) - Exception
**Class:** `text-sm`

Keep for:
- Form labels (`label.tsx`)
- Form inputs
- Tooltips
- UI component internals (shadcn/ui)

**Do not change:** These are UI components with space constraints

---

## Implementation Changes

### Components to Update

| Component | Current | Proposed |
|-----------|---------|----------|
| **Hero.tsx** | `text-5xl md:text-7xl` | `text-5xl md:text-6xl` |
| **Hero.tsx** tagline | `text-base md:text-lg` | `text-base` |
| **Hero.tsx** description | `text-lg md:text-xl` | `text-xl` |
| **Navigation.tsx** | `text-2xl` | `text-3xl` |
| **Navigation.tsx** links | `text-sm` | `text-base` |
| **Navigation.tsx** tagline | `text-xs` | Keep or `text-sm` |
| **Footer.tsx** logo | `text-2xl` | `text-3xl` |
| **Footer.tsx** headings | `text-lg` | `text-xl` |
| **About.tsx** | `text-4xl md:text-5xl` | `text-5xl md:text-6xl` |
| **ServicesPreview.tsx** | `text-4xl md:text-5xl` | `text-5xl md:text-6xl` |
| **CTASection.tsx** | `text-4xl md:text-5xl` | `text-5xl md:text-6xl` |
| **Card titles** | `text-2xl` | `text-3xl` |
| **Page titles** | various | `text-5xl md:text-6xl` |
| **Section headings** | various | `text-3xl` |

### shadcn/ui Components (Don't Touch)
- `alert-dialog.tsx`
- `button.tsx`
- `card.tsx` (CardDescription only)
- `dialog.tsx`
- `sheet.tsx`
- `drawer.tsx`
- `tooltip.tsx`
- `command.tsx`
- `menubar.tsx`
- `calendar.tsx`
- etc.

---

## Visual Hierarchy

```
Display (48-64px)  ████████████████████████████████
                   Page titles, hero text

Heading (32px)     ████████████████████
                   Section titles, card titles

Lead (20px)        ████████████████
                   Subtitles, emphasized body

Body (16px)        ██████████████
                   Everything else

Form (14px)        ████████████
                   Form UI only
```

---

## Tailwind Config Addition (Optional)

Could add semantic aliases:

```ts
fontSize: {
  'display': ['4rem', { lineHeight: '1.1' }],    // 64px
  'heading': ['2rem', { lineHeight: '1.2' }],    // 32px
  'lead': ['1.25rem', { lineHeight: '1.6' }],    // 20px
  'body': ['1rem', { lineHeight: '1.7' }],       // 16px
}
```

Then use: `text-display`, `text-heading`, `text-lead`, `text-body`

---

## Next Steps

1. [ ] Review and approve scale
2. [ ] Update components (see table above)
3. [ ] Skip shadcn/ui components
4. [ ] Test on all pages
5. [ ] Verify mobile responsiveness
