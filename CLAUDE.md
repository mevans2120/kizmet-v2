# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kizmet Massage & Wellness booking website - a Next.js App Router site for a massage therapy business. Prepared for future Sanity CMS integration.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture

**Stack:** Next.js 15 + React 18 + TypeScript + Tailwind CSS + shadcn/ui

**Path Alias:** `@/*` maps to `./src/*`

**Directory Structure:**
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with providers and fonts
  - `providers.tsx` - Client-side context providers
  - `page.tsx` - Home page
  - `[route]/page.tsx` - Other pages (services, policies, book)
- `src/page-content/` - Page content components (imported by App Router pages)
- `src/components/` - Reusable React components
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
- CSS variables in `src/app/globals.css`
- Tailwind config extends theme in `tailwind.config.ts`

**Class Merging:** Use `cn()` from `@/lib/utils` for conditional Tailwind classes.

## Future: Sanity Integration

This site is prepared for Sanity CMS. Content in page components is placeholder that will be replaced with Sanity queries. See `docs/research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md` for integration plan.
