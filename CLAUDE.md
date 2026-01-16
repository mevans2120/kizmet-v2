# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kizmet Massage & Wellness booking website - a Next.js App Router site for a massage therapy business with Sanity CMS for content management.

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
- Fonts: Fraunces (headings), Plus Jakarta Sans (body) via next/font
- CSS variables in `src/app/globals.css`
- Tailwind config extends theme in `tailwind.config.ts`

**Class Merging:** Use `cn()` from `@/lib/utils` for conditional Tailwind classes.

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

## Sanity CMS

Sanity is fully integrated:
- `src/sanity/` - Sanity client, schemas, and queries
- `src/app/studio/` - Embedded Sanity Studio at `/studio`
- Content is fetched server-side and passed to page-content components
- Images use `getCroppedImageUrl()` from `@/sanity/lib/image` to respect crop/hotspot
