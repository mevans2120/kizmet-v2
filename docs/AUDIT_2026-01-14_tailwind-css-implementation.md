# Tailwind CSS Implementation Audit

**Date:** January 14, 2026
**Status:** Issues identified, cleanup recommended

---

## Executive Summary

The project has residual files from a Vite/CRA migration to Next.js that create confusion and potential conflicts. The core Tailwind setup is correct, but legacy files should be removed and the implementation streamlined.

---

## Current State

### Files Analyzed

| File | Purpose | Status |
|------|---------|--------|
| `src/app/globals.css` | Main stylesheet | ✅ Correct |
| `src/app/layout.tsx` | Font loading via next/font | ✅ Correct |
| `tailwind.config.ts` | Tailwind configuration | ✅ Correct |
| `postcss.config.cjs` | PostCSS configuration | ✅ Correct |
| `src/App.css` | Legacy Vite/CRA styles | ❌ **DELETE** |
| `src/index.css` | Legacy Vite/CRA styles | ❌ **DELETED** |

---

## Issues Found

### 1. Legacy CSS Files (CRITICAL)

**Problem:** `src/App.css` exists with Vite boilerplate code:
```css
#root { max-width: 1280px; ... }
.logo { height: 6em; ... }
@keyframes logo-spin { ... }
```

**Impact:** Unused but creates confusion and potential for accidental imports.

**Fix:** Delete `src/App.css`

---

### 2. Legacy File Deleted (RESOLVED)

**Problem:** `src/index.css` contained:
- Direct Google Fonts import for Cormorant Garamond
- Custom `--font-heading` CSS variable overriding Tailwind
- Custom `.font-heading` utility class conflicting with Tailwind

**Impact:** This was overriding the next/font implementation, causing fonts to appear as Cormorant instead of Fraunces.

**Fix:** File has been deleted.

---

## How Font Loading Should Work

### Correct Architecture (Current)

```
┌─────────────────────────────────────────────────────────────────┐
│ layout.tsx                                                       │
│   Fraunces + Plus_Jakarta_Sans loaded via next/font/google      │
│   CSS variables: --font-fraunces, --font-jakarta                │
│   Applied to <html> element                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ tailwind.config.ts                                               │
│   fontFamily.heading: ['var(--font-fraunces)', ...]             │
│   fontFamily.body: ['var(--font-jakarta)', ...]                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Components                                                       │
│   Use: className="font-heading" or className="font-body"        │
└─────────────────────────────────────────────────────────────────┘
```

### To Change Fonts in the Future

1. **Edit `layout.tsx`** - Import new fonts from `next/font/google`
2. **Update CSS variable names** if desired (e.g., `--font-fraunces` → `--font-lora`)
3. **Edit `tailwind.config.ts`** - Update fontFamily references
4. **Clear `.next` cache** - `rm -rf .next && npm run dev`
5. **Hard refresh browser** - Cmd+Shift+R

---

## Best Practices Recommendations

### 1. Single Source of Truth for Fonts

**Current:** ✅ Correct
Fonts are loaded ONLY in `layout.tsx` via `next/font/google`. No duplicate imports.

**Rule:** Never import fonts via `@import url()` in CSS when using Next.js. Always use `next/font`.

---

### 2. CSS Variable Naming Convention

**Current:** ✅ Correct
- `--font-fraunces` for heading font
- `--font-jakarta` for body font

**Recommendation:** Consider using generic names for easier font swapping:
```tsx
// layout.tsx
const headingFont = Fraunces({ variable: '--font-heading', ... })
const bodyFont = Plus_Jakarta_Sans({ variable: '--font-body', ... })
```

Then in `tailwind.config.ts`:
```ts
fontFamily: {
  heading: ['var(--font-heading)', 'serif'],
  body: ['var(--font-body)', 'sans-serif'],
}
```

This allows changing fonts without updating Tailwind config.

---

### 3. Remove Unused CSS Variables from globals.css

**Current Issue:** globals.css has no font-related CSS variables (good), but does define many color variables that duplicate Tailwind config.

**Recommendation:** This is acceptable for shadcn/ui compatibility, but ensure no duplication of font definitions.

---

### 4. globals.css Base Styles

**Current:**
```css
h1, h2, h3, h4, h5, h6 {
  @apply font-heading;
}
```

**Status:** ✅ Correct - ensures all headings use the heading font by default.

---

### 5. Content Paths in Tailwind Config

**Current:**
```ts
content: [
  "./pages/**/*.{ts,tsx}",      // Unused (App Router)
  "./components/**/*.{ts,tsx}", // Unused (components in src/)
  "./app/**/*.{ts,tsx}",        // Unused (app in src/)
  "./src/**/*.{ts,tsx}"         // ✅ This is the only one needed
]
```

**Recommendation:** Simplify to:
```ts
content: ["./src/**/*.{ts,tsx}"]
```

---

## Cleanup Actions Required

### Immediate (Required)

1. [ ] Delete `src/App.css` - Legacy Vite boilerplate
2. [x] Delete `src/index.css` - Done (was overriding fonts)

### Optional Improvements

3. [ ] Rename font CSS variables to generic names (`--font-heading`, `--font-body`)
4. [ ] Simplify Tailwind content paths
5. [ ] Add comments in layout.tsx explaining font setup

---

## Verification Steps

After cleanup, verify fonts load correctly:

```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Start dev server
npm run dev

# 3. Check CSS output has correct fonts
curl -s http://localhost:3000 | \
  grep -oE '/_next/static/css/[^"]+\.css' | \
  head -1 | \
  xargs -I {} curl -s "http://localhost:3000{}" | \
  grep "font-family:" | sort -u

# Should show Fraunces and Plus Jakarta Sans, NOT Cormorant
```

---

## File Structure (After Cleanup)

```
src/
├── app/
│   ├── globals.css      # Main styles, CSS variables, animations
│   ├── layout.tsx       # Font loading, metadata, providers
│   └── ...
├── components/          # React components
└── ...

# Root config files
├── tailwind.config.ts   # Tailwind theme, fonts, colors
├── postcss.config.cjs   # PostCSS plugins
└── ...

# NO legacy files:
# ❌ src/index.css (deleted)
# ❌ src/App.css (to delete)
```

---

## Summary

The Tailwind implementation is fundamentally correct. The font issues were caused by a legacy `src/index.css` file that was importing fonts directly and overriding CSS variables. This file has been deleted.

**Remaining action:** Delete `src/App.css` to complete the cleanup.
