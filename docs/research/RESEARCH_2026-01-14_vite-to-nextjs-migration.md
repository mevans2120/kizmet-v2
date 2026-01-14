# Research: Vite to Next.js Migration

**Date:** 2026-01-14
**Tags:** migration, next.js, vite, react, app-router, seo, sanity

## Summary

This document analyzes converting the Kizmet Massage & Wellness booking site from Vite (client-side SPA) to Next.js App Router, with consideration for upcoming **Sanity CMS integration**. The migration is straightforward due to the site's relatively simple structure (4 pages, standard React patterns). The primary benefits are SEO improvements, better performance through SSR/SSG, access to Next.js optimizations, and excellent Sanity integration capabilities via Server Components.

## Key Questions

- What code changes are required for the migration?
- How should we update documentation (CLAUDE.md, README)?
- What is the recommended priority/order of operations?
- Are there any breaking changes or gotchas specific to this codebase?
- **How does planned Sanity integration affect the migration strategy?**

---

## Findings

### Finding 1: Current Codebase Analysis

**What we have:**
- 4 pages: Index, Services, Policies, Book (+ NotFound)
- React Router DOM for client-side routing
- shadcn/ui component library (~50 components in `src/components/ui/`)
- Tailwind CSS with custom theme (sage, cream, terracotta colors)
- React Query (configured but minimally used)
- React Hook Form + Zod for form validation
- Sonner for toast notifications
- Custom fonts: Cormorant Garamond, Inter

**Migration Complexity:** Low-Medium
- No API routes to migrate
- No complex data fetching patterns
- All pages are static content (except booking form)
- shadcn/ui is officially supported on Next.js

**Pros:**
- Simple site structure makes migration straightforward
- shadcn/ui has first-class Next.js support
- No backend/API complexity

**Cons:**
- React Router navigation patterns need conversion to Next.js Link
- Form handling stays client-side (booking form)

---

### Finding 2: Routing Changes (React Router → Next.js App Router)

**Current routes (React Router):**
```
/           → src/pages/Index.tsx
/services   → src/pages/Services.tsx
/policies   → src/pages/Policies.tsx
/book       → src/pages/Book.tsx
*           → src/pages/NotFound.tsx
```

**Target structure (Next.js App Router):**
```
app/
├── layout.tsx           # Root layout (replaces index.html)
├── page.tsx             # Home page (/)
├── not-found.tsx        # 404 page
├── services/
│   └── page.tsx         # /services
├── policies/
│   └── page.tsx         # /policies
└── book/
    └── page.tsx         # /book
```

**Code changes required:**
1. Replace `react-router-dom` imports with `next/link` and `next/navigation`
2. Replace `<Link to="/path">` with `<Link href="/path">`
3. Replace `useLocation()` with `usePathname()` from `next/navigation`
4. Remove `<BrowserRouter>` and `<Routes>` wrappers

**Example - Navigation.tsx conversion:**
```tsx
// Before (React Router)
import { Link, useLocation } from "react-router-dom";
const location = useLocation();
const isActive = (path) => location.pathname === path;
<Link to="/services">Services</Link>

// After (Next.js)
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
const pathname = usePathname();
const isActive = (path) => pathname === path;
<Link href="/services">Services</Link>
```

---

### Finding 3: Layout & Provider Migration

**Current setup (App.tsx):**
```tsx
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>...</Routes>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

**Target structure:**

1. **app/layout.tsx** (Root Layout - Server Component):
```tsx
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
})

export const metadata: Metadata = {
  title: 'Kizmet Massage & Wellness | Therapeutic Massage Services',
  description: 'Professional massage therapy services...',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

2. **app/providers.tsx** (Client Component):
```tsx
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

const queryClient = new QueryClient()

export function Providers({ children }) {
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

---

### Finding 4: Component Updates Required

**Components needing `"use client"` directive:**
- `Navigation.tsx` - uses `useState`, `usePathname`
- `Book.tsx` - uses `useState`, form handling
- Any component using hooks or browser APIs

**Components that can be Server Components:**
- `Hero.tsx` - static content
- `About.tsx` - static content
- `Footer.tsx` - static content (unless using Link active states)
- `ServicesPreview.tsx` - static content
- `CTASection.tsx` - static content

**shadcn/ui components:**
- Most already work as Server Components
- Interactive ones (Dialog, Select, Toast) need client context
- No changes needed to `components/ui/` directory

---

### Finding 5: Configuration File Changes

**Files to CREATE:**
| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js configuration |
| `app/layout.tsx` | Root layout |
| `app/providers.tsx` | Client-side providers |
| `app/globals.css` | Global styles (move from src/index.css) |

**Files to DELETE:**
| File | Reason |
|------|--------|
| `vite.config.ts` | Vite-specific |
| `src/main.tsx` | Vite entry point |
| `src/App.tsx` | Routing handled by App Router |
| `src/vite-env.d.ts` | Vite types |
| `tsconfig.node.json` | Vite build config |
| `index.html` | Replaced by layout.tsx |

**Files to UPDATE:**
| File | Changes |
|------|---------|
| `package.json` | Scripts, dependencies |
| `tsconfig.json` | Next.js compiler options |
| `tailwind.config.ts` | Update content paths |
| `.gitignore` | Add `.next`, `next-env.d.ts` |
| `components.json` | Update for App Router |

---

### Finding 6: Dependency Changes

**Remove:**
```json
{
  "react-router-dom": "^6.30.1",
  "@vitejs/plugin-react-swc": "^3.11.0",
  "vite": "^5.4.19",
  "lovable-tagger": "^1.1.13"
}
```

**Add:**
```json
{
  "next": "^15.x"
}
```

**Keep (compatible):**
- All `@radix-ui/*` packages
- `@tanstack/react-query`
- `tailwindcss`, `tailwind-merge`, `tailwindcss-animate`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `sonner`, `lucide-react`
- `date-fns`, `react-day-picker`
- `class-variance-authority`, `clsx`

**Note:** `next-themes` is already in dependencies (used for dark mode) - fully compatible.

---

### Finding 7: SEO Improvements Available

**Current (Vite SPA):**
- Client-side rendered
- Single `index.html` with basic meta tags
- Search engines see empty shell

**After (Next.js):**
- Server-rendered HTML for all pages
- Per-page metadata via `generateMetadata()` or `metadata` export
- Automatic sitemap generation possible
- Structured data support

**Metadata examples:**
```tsx
// app/services/page.tsx
export const metadata: Metadata = {
  title: 'Services & Pricing | Kizmet Massage & Wellness',
  description: '30, 60, and 90 minute massage sessions...',
  openGraph: {
    title: 'Massage Services',
    description: '...',
  },
}
```

---

### Finding 8: Image Optimization Opportunities

**Current:**
```tsx
import heroImage from "@/assets/hero-spa.jpg"
<img src={heroImage} alt="..." className="..." />
```

**After (optional optimization):**
```tsx
import Image from 'next/image'
import heroImage from "@/assets/hero-spa.jpg"
<Image src={heroImage} alt="..." fill className="..." />
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Lazy loading by default
- Prevents layout shift (CLS)
- Responsive srcset generation

---

### Finding 9: Sanity CMS Integration Considerations

**Why Next.js + Sanity is an excellent combination:**

1. **Server Components** - Fetch Sanity data directly on the server without client-side loading states
2. **ISR (Incremental Static Regeneration)** - Rebuild pages automatically when Sanity content changes
3. **On-demand Revalidation** - Sanity webhooks can trigger page rebuilds instantly
4. **Preview Mode** - Built-in draft preview for content editors
5. **Type Safety** - Generate TypeScript types from Sanity schemas

**Content likely to come from Sanity:**

| Content | Current Location | Sanity Content Type |
|---------|------------------|---------------------|
| Services (name, description, price, duration) | Hardcoded in `Services.tsx`, `Book.tsx` | `service` document |
| About section text | Hardcoded in `About.tsx` | `siteSettings` or `aboutPage` |
| Hero content (headline, subtext) | Hardcoded in `Hero.tsx` | `homePage` or `siteSettings` |
| Policies content | Hardcoded in `Policies.tsx` | `policiesPage` or `policy` documents |
| Business info (address, phone, hours) | Hardcoded in `Footer.tsx` | `siteSettings` |
| Images (hero, service photos) | Local `src/assets/` | Sanity image assets |

**Content that stays in code:**
- Booking form UI and validation logic
- Navigation structure
- UI components (shadcn/ui)
- Layout and styling

**Additional dependencies for Sanity:**
```json
{
  "next-sanity": "^9.x",
  "@sanity/image-url": "^1.x",
  "@sanity/vision": "^3.x"  // For GROQ query testing (dev)
}
```

**Recommended file structure with Sanity:**
```
app/
├── (site)/              # Public site routes
│   ├── layout.tsx
│   ├── page.tsx
│   ├── services/
│   ├── policies/
│   └── book/
├── studio/              # Embedded Sanity Studio (optional)
│   └── [[...tool]]/
│       └── page.tsx
sanity/
├── schemas/             # Content type definitions
├── lib/
│   ├── client.ts        # Sanity client config
│   ├── queries.ts       # GROQ queries
│   └── image.ts         # Image URL builder
└── sanity.config.ts     # Studio configuration
```

---

## What to DO vs DEFER (Given Sanity Integration)

### DO NOW (Migration Foundation)
These are essential regardless of Sanity and won't need to be redone:

| Task | Reason |
|------|--------|
| Next.js migration (core setup) | Required foundation for Sanity integration |
| App Router structure | File-based routing stays the same |
| `layout.tsx` + `providers.tsx` | Infrastructure doesn't change |
| Navigation component update | Routing logic is independent of content |
| `next/font` setup | Fonts are code, not CMS content |
| Tailwind/styling config | Design system stays in code |

### DO MINIMALLY (Will Be Replaced)
Keep these simple - they'll be replaced with Sanity queries:

| Task | Recommendation |
|------|----------------|
| Per-page metadata | Add basic static metadata; will become `generateMetadata()` with Sanity data |
| Static page content | Keep current hardcoded content as placeholder; don't over-polish |
| Image optimization | Don't convert all images to `next/image` yet; Sanity images use different patterns |

### DEFER (Until Sanity Integration)
These should wait for Sanity setup:

| Task | Reason |
|------|--------|
| Sitemap generation | Should include Sanity-managed pages |
| Structured data (JSON-LD) | Content comes from Sanity |
| Dynamic metadata | Needs Sanity queries |
| Content component refactoring | Wait to see Sanity data shapes |

### PREPARE FOR (During Migration)
Structure code to make Sanity integration easier:

| Preparation | How |
|-------------|-----|
| Keep page components thin | Pages should be layout shells that render content components |
| Use TypeScript interfaces | Define content shapes that will map to Sanity schemas |
| Centralize content | Group hardcoded content in one place (easier to find/replace) |

---

## Documentation Updates Required

### CLAUDE.md Updates

**Replace entirely with Next.js-focused version:**
- Update development commands (`next dev`, `next build`, etc.)
- Update architecture description (App Router, file-based routing)
- Update path alias note (stays the same: `@/*` → `./src/*`)
- Note Server vs Client Component patterns
- Keep design system section (unchanged)

### README.md Updates

**Changes needed:**
- Update "Technologies" section: Vite → Next.js
- Update development commands
- Update deployment instructions (Vercel instead of Lovable publish)
- Remove Lovable-specific sections (or keep as historical note)
- Add section on SSR/SSG capabilities

### components.json Updates

```json
{
  "rsc": true,  // Enable React Server Components
  "tsx": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Recommendations

### Migration Strategy: Incremental Approach

The official Next.js documentation recommends keeping the app as a client-side SPA initially, then incrementally adopting Next.js features. However, given the simplicity of this site, a **full conversion** is more appropriate:

1. **Full App Router adoption** - Convert all 4 pages to Next.js routing
2. **Server Components where possible** - Static pages as RSC
3. **Client Components where needed** - Interactive components (Navigation, Book)
4. **Metadata API** - Per-page SEO metadata

### Hosting Considerations

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | First-party, zero-config | Potential cost at scale |
| **Netlify** | Easy migration, familiar | Some Next.js features limited |
| **Self-hosted** | Full control | More DevOps work |

**Recommendation:** Vercel for simplest deployment, automatic preview deployments, and edge functions.

---

## Priority of Operations (Updated for Sanity)

### Phase 1: Foundation Setup
1. [ ] Create `next.config.mjs`
2. [ ] Update `tsconfig.json` for Next.js
3. [ ] Update `package.json` (scripts + dependencies)
4. [ ] Run `npm install` to get Next.js
5. [ ] Update `tailwind.config.ts` content paths
6. [ ] Update `.gitignore`

### Phase 2: App Router Structure
7. [ ] Create `app/layout.tsx` (root layout with `next/font`)
8. [ ] Create `app/providers.tsx` (client providers)
9. [ ] Move `src/index.css` → `app/globals.css`
10. [ ] Create `app/page.tsx` (home page - keep content simple)
11. [ ] Create `app/services/page.tsx` (keep content simple)
12. [ ] Create `app/policies/page.tsx` (keep content simple)
13. [ ] Create `app/book/page.tsx` (form logic stays)
14. [ ] Create `app/not-found.tsx`

### Phase 3: Component Migration
15. [ ] Update `Navigation.tsx` (Link, usePathname)
16. [ ] Add `"use client"` to interactive components
17. [ ] Update any `<a href>` to `<Link href>` throughout

### Phase 4: Cleanup
18. [ ] Delete Vite files (`vite.config.ts`, `main.tsx`, `App.tsx`, `index.html`, etc.)
19. [ ] Remove unused dependencies (`react-router-dom`, `vite`, etc.)
20. [ ] Verify build: `npm run build`
21. [ ] Test all routes locally

### Phase 5: Minimal Enhancements (Pre-Sanity)
22. [ ] Add basic per-page metadata (will be dynamic later)
23. [ ] Set up `next/font` for Cormorant Garamond and Inter
24. [ ] **SKIP** image optimization - Sanity uses different patterns
25. [ ] **SKIP** sitemap - wait for Sanity content

### Phase 6: Documentation
26. [ ] Update `CLAUDE.md`
27. [ ] Update `README.md`
28. [ ] Update `components.json`

### Phase 7: Sanity Preparation (Optional - can do during migration)
29. [ ] Create placeholder `sanity/` directory structure
30. [ ] Add `next-sanity` to dependencies (don't configure yet)
31. [ ] Define TypeScript interfaces for content types
32. [ ] Consider route groups: `app/(site)/` for public pages

---

## Future Phase: Sanity Integration (Separate Project)

After Next.js migration is complete:

1. [ ] Set up Sanity project and install dependencies
2. [ ] Define content schemas (services, pages, siteSettings)
3. [ ] Configure Sanity client (`sanity/lib/client.ts`)
4. [ ] Migrate hardcoded content to Sanity Studio
5. [ ] Update pages to fetch from Sanity
6. [ ] Set up ISR or on-demand revalidation
7. [ ] Configure preview mode for drafts
8. [ ] Set up Sanity image handling (replaces local images)
9. [ ] Add dynamic metadata with `generateMetadata()`
10. [ ] Generate sitemap from Sanity content

---

## Next Steps

- [ ] Review this research document and approve migration approach
- [ ] Decide on hosting platform (Vercel recommended - excellent for Next.js + Sanity)
- [ ] Schedule migration work (Phases 1-6)
- [ ] Consider setting up Vercel project before migration for easy preview deploys
- [ ] Plan Sanity project setup as follow-up work

---

## References

### Next.js Migration
- [Next.js Official Migration Guide: From Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [Next.js Migration Guides Overview](https://nextjs.org/docs/app/guides/migrating)
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next)
- [Next.js 15 with ShadCN & Tailwind CSS v4 Setup (2025)](https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl)
- [Vite vs Next.js 2025 Comparison](https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison)
- [ViteToNext Migration Tool](https://dev.to/digitaldev/migrating-react-vite-to-nextjs-i-built-a-tool-to-automate-the-whole-process-59oi)

### Sanity + Next.js (For Future Reference)
- [next-sanity Official Package](https://github.com/sanity-io/next-sanity)
- [Sanity + Next.js App Router Guide](https://www.sanity.io/guides/nextjs-app-router-live-preview)
- [Sanity Official Next.js Starter](https://www.sanity.io/templates/nextjs-sanity-clean)
- [On-Demand ISR with Sanity Webhooks](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
