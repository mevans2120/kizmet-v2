# Plan: Vite to Next.js Migration — Kizmet Booking Site

**Date:** 2026-01-14
**Tags:** migration, next.js, vite, react, app-router, sanity-ready

## Objective

Migrate the Kizmet Massage & Wellness booking site from Vite (client-side SPA) to Next.js 15 App Router, establishing the foundation for future Sanity CMS integration while gaining immediate SEO and performance benefits.

## Background

The current site is a Vite-powered React SPA that renders entirely client-side. This creates SEO challenges (search engines see empty HTML) and misses performance optimizations available in Next.js. The planned Sanity CMS integration will work significantly better with Next.js Server Components, making this migration a prerequisite for the CMS work.

## Requirements

### Must Have
- All 4 pages functional: Home, Services, Policies, Book
- Navigation working with active state indicators
- Booking form fully functional
- Tailwind CSS and shadcn/ui components working
- Custom fonts (Cormorant Garamond, Inter) loading correctly
- Toast notifications working
- Build completes without errors
- All routes accessible and rendering

### Nice to Have
- Basic per-page metadata (title, description)
- `next/font` optimization for custom fonts
- Preparation for Sanity (directory structure, interfaces)

### Explicitly Out of Scope (Deferred for Sanity)
- Image optimization with `next/image`
- Sitemap generation
- Structured data (JSON-LD)
- Dynamic metadata

## Approach

**Strategy:** Full conversion to App Router (not incremental SPA approach) since the site is simple enough to migrate completely. Keep existing content as-is since it will be replaced by Sanity later.

**Batch Structure:** 6 phases, each producing a testable milestone.

---

## Implementation Tasks

### Phase 1: Foundation Setup (Config Files)

#### Task 1.1: Create Next.js Configuration
**File:** `next.config.mjs` (create new)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output: 'export' - we want SSR/SSG capabilities
}

export default nextConfig
```

**Verification:** File exists at project root.

---

#### Task 1.2: Update TypeScript Configuration
**File:** `tsconfig.json` (modify)

**Changes:**
1. Remove `"references"` array (tsconfig.node.json reference)
2. Add to `compilerOptions`:
   - `"plugins": [{ "name": "next" }]`
   - `"esModuleInterop": true`
   - `"allowJs": true`
   - `"incremental": true`
3. Update `include` array to add: `"./next-env.d.ts"`, `".next/types/**/*.ts"`
4. Ensure `exclude` includes `"node_modules"`

**Target tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "esModuleInterop": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "./next-env.d.ts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Verification:** No TypeScript errors when running `npx tsc --noEmit`.

---

#### Task 1.3: Update package.json Scripts and Dependencies
**File:** `package.json` (modify)

**Update scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Add dependencies:**
```bash
npm install next@latest
```

**Remove dependencies:**
```bash
npm uninstall react-router-dom @vitejs/plugin-react-swc vite lovable-tagger eslint-plugin-react-refresh
```

**Verification:** `npm install` completes without errors.

---

#### Task 1.4: Update Tailwind Configuration
**File:** `tailwind.config.ts` (modify)

**Update `content` array:**
```typescript
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
```

**Verification:** File saves without syntax errors.

---

#### Task 1.5: Update .gitignore
**File:** `.gitignore` (modify)

**Add these lines:**
```
# Next.js
.next/
out/
next-env.d.ts
```

**Verification:** File updated.

---

### Phase 2: App Router Structure

#### Task 2.1: Create Root Layout
**File:** `app/layout.tsx` (create new)

```tsx
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kizmet Massage & Wellness | Therapeutic Massage Services',
    template: '%s | Kizmet Massage & Wellness',
  },
  description: 'Professional therapeutic massage services in Port Angeles, WA. Book your 30, 60, or 90-minute session today.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Verification:** File exists at `app/layout.tsx`.

---

#### Task 2.2: Create Providers Component
**File:** `app/providers.tsx` (create new)

```tsx
'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
```

**Verification:** File exists at `app/providers.tsx`.

---

#### Task 2.3: Move Global Styles
**File:** `app/globals.css` (create by copying)

**Action:** Copy contents of `src/index.css` to `app/globals.css`.

**Modify font-family declarations** if they reference external URLs - the `next/font` handles this now. Keep CSS variables and Tailwind directives.

**Verification:** File exists at `app/globals.css` with Tailwind directives.

---

#### Task 2.4: Create Home Page
**File:** `app/page.tsx` (create new)

```tsx
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import ServicesPreview from '@/components/ServicesPreview'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <ServicesPreview />
      <CTASection />
      <Footer />
    </div>
  )
}
```

**Verification:** File exists at `app/page.tsx`.

---

#### Task 2.5: Create Services Page
**File:** `app/services/page.tsx` (create new)

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: 'Explore our massage therapy services: 30, 60, and 90-minute sessions tailored to your wellness needs.',
}

// Import the existing Services page content
import ServicesContent from '@/pages/Services'

export default function ServicesPage() {
  return <ServicesContent />
}
```

**Note:** Initially import from existing `src/pages/Services.tsx`. Will refactor to extract content component.

**Verification:** File exists at `app/services/page.tsx`.

---

#### Task 2.6: Create Policies Page
**File:** `app/policies/page.tsx` (create new)

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Review our booking, cancellation, and session policies for Kizmet Massage & Wellness.',
}

import PoliciesContent from '@/pages/Policies'

export default function PoliciesPage() {
  return <PoliciesContent />
}
```

**Verification:** File exists at `app/policies/page.tsx`.

---

#### Task 2.7: Create Book Page
**File:** `app/book/page.tsx` (create new)

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your massage therapy session at Kizmet Massage & Wellness.',
}

import BookContent from '@/pages/Book'

export default function BookPage() {
  return <BookContent />
}
```

**Verification:** File exists at `app/book/page.tsx`.

---

#### Task 2.8: Create Not Found Page
**File:** `app/not-found.tsx` (create new)

```tsx
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-heading text-6xl font-medium text-foreground mb-4">404</h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            Page not found
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

**Verification:** File exists at `app/not-found.tsx`.

---

### Phase 3: Component Migration

#### Task 3.1: Update Navigation Component
**File:** `src/components/Navigation.tsx` (modify)

**Changes:**
1. Add `'use client'` directive at top
2. Replace imports:
   ```tsx
   // Before
   import { Link, useLocation } from "react-router-dom";

   // After
   import Link from "next/link";
   import { usePathname } from "next/navigation";
   ```
3. Replace `useLocation()` with `usePathname()`:
   ```tsx
   // Before
   const location = useLocation();
   const isActive = (path: string) => location.pathname === path;

   // After
   const pathname = usePathname();
   const isActive = (path: string) => pathname === path;
   ```
4. Replace `<Link to=` with `<Link href=`:
   ```tsx
   // Before
   <Link to="/" ...>
   <Link to={link.path} ...>

   // After
   <Link href="/" ...>
   <Link href={link.path} ...>
   ```

**Verification:** No TypeScript errors in Navigation.tsx.

---

#### Task 3.2: Update Page Components with "use client"
**Files to modify:**
- `src/pages/Book.tsx` - Add `'use client'` at top (uses useState, form handling)
- `src/pages/Services.tsx` - Check if needs client directive (likely not)
- `src/pages/Policies.tsx` - Check if needs client directive (likely not)

**For Book.tsx:**
```tsx
'use client'

import { useState } from "react";
// ... rest of file
```

**Verification:** No hydration errors when navigating to these pages.

---

#### Task 3.3: Update Link Tags Throughout Components
**Files to check and update:**
- `src/components/Hero.tsx` - Update any `<a href="/book">` to `<Link href="/book">`
- `src/components/CTASection.tsx` - Same
- `src/components/Footer.tsx` - Same
- `src/components/ServicesPreview.tsx` - Same

**Pattern:**
```tsx
// Before
<a href="/book" className="...">Book Now</a>

// After
import Link from "next/link";
<Link href="/book" className="...">Book Now</Link>
```

**Note:** External links (`mailto:`, `tel:`, external URLs) should remain as `<a>` tags.

**Verification:** All internal navigation uses Next.js Link component.

---

### Phase 4: Cleanup

#### Task 4.1: Delete Vite-Specific Files
**Files to DELETE:**
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/vite-env.d.ts`
- `tsconfig.node.json`
- `index.html`

**Verification:** Listed files no longer exist.

---

#### Task 4.2: Remove Unused Dependencies
**Run:**
```bash
npm uninstall react-router-dom @vitejs/plugin-react-swc vite lovable-tagger eslint-plugin-react-refresh
```

**Verification:** These packages no longer in package.json.

---

#### Task 4.3: Verify Build
**Run:**
```bash
npm run build
```

**Expected:** Build completes successfully with output showing compiled pages.

**Verification:** `.next` directory created, no build errors.

---

#### Task 4.4: Test All Routes Locally
**Run:**
```bash
npm run dev
```

**Test each route:**
- [ ] `http://localhost:3000/` - Home page renders
- [ ] `http://localhost:3000/services` - Services page renders
- [ ] `http://localhost:3000/policies` - Policies page renders
- [ ] `http://localhost:3000/book` - Book page renders, form works
- [ ] `http://localhost:3000/nonexistent` - 404 page renders
- [ ] Navigation links work between all pages
- [ ] Active state shows on current page's nav link
- [ ] Booking form submits and shows toast

**Verification:** All routes functional, no console errors.

---

### Phase 5: Enhancements (Pre-Sanity)

#### Task 5.1: Verify Font Loading
**Check:** Fonts load correctly via `next/font`.

**If fonts don't apply:** Update CSS to use the CSS variables:
```css
/* In globals.css or tailwind.config.ts */
font-family: var(--font-cormorant), serif;
font-family: var(--font-inter), sans-serif;
```

**Verification:** Cormorant Garamond shows for headings, Inter for body text.

---

#### Task 5.2: Update ESLint Configuration
**File:** `eslint.config.js` or create `.eslintrc.json`

**Option A - Replace with Next.js defaults:**
```json
{
  "extends": "next/core-web-vitals"
}
```

**Option B - Keep existing + add Next.js:**
Update to include Next.js rules.

**Verification:** `npm run lint` runs without configuration errors.

---

### Phase 6: Documentation Updates

#### Task 6.1: Update CLAUDE.md
**File:** `CLAUDE.md` (rewrite)

**New content:**
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kizmet Massage & Wellness booking website - a Next.js App Router site for a massage therapy business. Prepared for future Sanity CMS integration.

## Development Commands

\`\`\`bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

## Architecture

**Stack:** Next.js 15 + React 18 + TypeScript + Tailwind CSS + shadcn/ui

**Path Alias:** `@/*` maps to `./src/*`

**Directory Structure:**
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with providers and fonts
  - `providers.tsx` - Client-side context providers
  - `page.tsx` - Home page
  - `[route]/page.tsx` - Other pages (services, policies, book)
- `src/components/` - React components
- `src/components/ui/` - shadcn/ui component library
- `src/hooks/` - Custom React hooks
- `src/lib/utils.ts` - Utility functions

**Key Patterns:**
- Server Components by default, `'use client'` for interactive components
- React Query for async state (configured in providers.tsx)
- React Hook Form + Zod for form validation
- Toast notifications via Sonner

## Styling

**Design System:**
- Custom colors: sage (primary), cream (background), terracotta (accent)
- Fonts: Cormorant Garamond (headings), Inter (body) via next/font
- CSS variables in `app/globals.css`
- Tailwind config extends theme in `tailwind.config.ts`

**Class Merging:** Use `cn()` from `@/lib/utils` for conditional Tailwind classes.

## Future: Sanity Integration

This site is prepared for Sanity CMS. Content in page components is placeholder that will be replaced with Sanity queries. See `docs/research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md` for integration plan.
\`\`\`

**Verification:** CLAUDE.md reflects Next.js setup.

---

#### Task 6.2: Update README.md
**File:** `README.md` (modify)

**Key changes:**
1. Update "Technologies" section:
   - Replace "Vite" with "Next.js 15"
   - Add "App Router"
2. Update development commands to use `next` commands
3. Update deployment section (Vercel recommended)
4. Optionally note migration from Lovable/Vite

**Verification:** README accurately describes Next.js stack.

---

#### Task 6.3: Update components.json
**File:** `components.json` (modify)

**Update for App Router:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Verification:** shadcn/ui CLI works for adding new components.

---

### Phase 7: Sanity Preparation (Optional)

#### Task 7.1: Create Sanity Directory Structure
**Create directories:**
```bash
mkdir -p sanity/schemas sanity/lib
```

**Create placeholder files:**
- `sanity/schemas/.gitkeep`
- `sanity/lib/.gitkeep`

**Verification:** Directory structure exists.

---

#### Task 7.2: Add next-sanity Dependency (Don't Configure)
**Run:**
```bash
npm install next-sanity @sanity/image-url
```

**Note:** Don't configure yet - just have dependency ready.

**Verification:** Packages in package.json.

---

#### Task 7.3: Create Content Type Interfaces
**File:** `src/types/content.ts` (create new)

```typescript
// Placeholder interfaces for future Sanity content types
// These will be replaced/updated when Sanity schemas are defined

export interface Service {
  _id: string
  name: string
  duration: number // minutes
  price: number
  description: string
}

export interface SiteSettings {
  businessName: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
}

export interface HeroContent {
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
}
```

**Verification:** File exists, types can be imported.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| shadcn/ui components break | Low | Medium | Components are copied to repo, not external dependency |
| Font loading issues | Medium | Low | Fallback fonts in place; can debug with browser devtools |
| Build errors from old imports | Medium | Medium | Systematic cleanup of react-router-dom imports |
| CSS not applying correctly | Low | Medium | Tailwind content paths updated; globals.css imported in layout |
| Form functionality breaks | Low | High | Book.tsx marked as client component; test form submission |

## Success Criteria

- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts server on localhost:3000
- [ ] All 4 pages render correctly (Home, Services, Policies, Book)
- [ ] Navigation shows active state on current page
- [ ] Booking form submits and displays toast notification
- [ ] 404 page displays for unknown routes
- [ ] No console errors during navigation
- [ ] Fonts (Cormorant Garamond, Inter) load correctly
- [ ] Documentation (CLAUDE.md, README) updated

## Open Questions

- **Hosting:** Vercel recommended - confirm deployment platform before going live
- **Domain:** Will the domain change or stay the same?
- **Sanity Timeline:** When will Sanity integration begin? (Affects whether to do Phase 7)

## Related Research

- [RESEARCH_2026-01-14_vite-to-nextjs-migration.md](../research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md) - Comprehensive analysis of migration requirements and Sanity considerations
