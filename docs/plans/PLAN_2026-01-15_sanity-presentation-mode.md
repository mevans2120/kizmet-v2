# Plan: Sanity Presentation Mode — Kizmet Massage & Wellness

**Date:** 2026-01-15
**Tags:** sanity, cms, visual-editing, preview, draft-mode

## Objective

Enable Sanity Presentation Mode (Visual Editing) so content editors can see live previews of their changes in the actual site layout before publishing, with click-to-edit functionality directly from the preview.

## Background

The Kizmet site currently uses Sanity CMS for content management, but editors must:
1. Make changes in Sanity Studio
2. Publish the changes
3. Manually navigate to the site to see results

Presentation Mode creates a side-by-side editing experience where:
- The site preview updates in real-time as content is edited
- Editors can click on elements in the preview to jump to the corresponding field in the Studio
- Draft content can be previewed before publishing

**Current State:**
- Sanity is configured with structure tool and schemas
- Client uses `perspective: 'published'` (only fetches published content)
- No draft mode or visual editing setup exists
- All pages are Server Components with async fetching (ideal foundation)

## Requirements

### Must Have
- [ ] Draft mode API route to enable/disable Next.js draft mode
- [ ] Draft-aware Sanity client with `perspective: 'previewDrafts'`
- [ ] Presentation tool configured in `sanity.config.ts`
- [ ] `<VisualEditing />` component added to pages when in draft mode
- [ ] Environment variables for API token and draft secret
- [ ] At least one page fully wired up as reference implementation

### Nice to Have
- [ ] All content pages wired up for visual editing
- [ ] Preview indicator banner when viewing draft content
- [ ] Location mappings for each document type in presentation tool
- [ ] Webhook-triggered revalidation on publish

## Approach

### Phase 1: Core Infrastructure

**1.1 Install package**
```bash
npm install @sanity/presentation
```
Note: `@sanity/visual-editing` is bundled with `next-sanity` which is already installed.

**1.2 Create draft client** (`src/sanity/lib/draft.ts`)
```typescript
import { createClient } from '@sanity/client'

export const draftClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_TOKEN,
})
```

**1.3 Create draft mode routes**

`src/app/api/draft/enable/route.ts`:
```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { client } from '@/sanity/lib/client'

export async function GET(request: Request) {
  const { isValid, redirectTo } = await validatePreviewUrl(
    client.withConfig({ token: process.env.SANITY_API_TOKEN }),
    request.url
  )

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(redirectTo || '/')
}
```

`src/app/api/draft/disable/route.ts`:
```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  ;(await draftMode()).disable()
  redirect('/')
}
```

### Phase 2: Sanity Studio Configuration

**2.1 Update `sanity.config.ts`**
```typescript
import { presentationTool } from 'sanity/presentation'

export default defineConfig({
  // ... existing config
  plugins: [
    structureTool({ structure: deskStructure }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
        },
      },
    }),
  ],
})
```

### Phase 3: Page Integration

**3.1 Create helper for draft-aware fetching** (`src/sanity/lib/fetch.ts`)
```typescript
import { draftMode } from 'next/headers'
import { client } from './client'
import { draftClient } from './draft'

export async function sanityFetch<T>(query: string, params = {}): Promise<T> {
  const isDraft = (await draftMode()).isEnabled
  const sanityClient = isDraft ? draftClient : client
  return sanityClient.fetch<T>(query, params)
}
```

**3.2 Update pages to use draft-aware fetching**

Example for homepage (`src/app/page.tsx`):
```typescript
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/fetch'

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled

  const [homepage, services, siteSettings, footerSettings] = await Promise.all([
    sanityFetch(HOMEPAGE_SETTINGS_QUERY),
    sanityFetch(FEATURED_SERVICES_QUERY),
    sanityFetch(SITE_SETTINGS_QUERY),
    sanityFetch(FOOTER_SETTINGS_QUERY),
  ])

  return (
    <>
      {/* existing page content */}
      {isDraft && <VisualEditing />}
    </>
  )
}
```

### Phase 4: Environment Setup

Add to `.env.local`:
```bash
# Sanity API Token (with viewer or editor permissions)
SANITY_API_TOKEN=sk...

# Used by @sanity/preview-url-secret for secure draft mode
# (auto-generated, stored in Sanity dataset)
```

## Implementation Checklist

| # | Task | File(s) | Est. |
|---|------|---------|------|
| 1 | Install `@sanity/presentation` | package.json | 1 min |
| 2 | Create draft client | `src/sanity/lib/draft.ts` | 5 min |
| 3 | Create draft enable route | `src/app/api/draft/enable/route.ts` | 5 min |
| 4 | Create draft disable route | `src/app/api/draft/disable/route.ts` | 2 min |
| 5 | Create `sanityFetch` helper | `src/sanity/lib/fetch.ts` | 5 min |
| 6 | Add presentation tool to config | `sanity.config.ts` | 5 min |
| 7 | Update homepage for visual editing | `src/app/page.tsx` | 5 min |
| 8 | Update about page | `src/app/about/page.tsx` | 5 min |
| 9 | Update services page | `src/app/services/page.tsx` | 5 min |
| 10 | Update policies page | `src/app/policies/page.tsx` | 5 min |
| 11 | Update book page | `src/app/book/page.tsx` | 5 min |
| 12 | Add SANITY_API_TOKEN to env | `.env.local` | 2 min |
| 13 | Test presentation mode end-to-end | — | 10 min |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API token exposed in client | Medium | High | Use server-only env var (no `NEXT_PUBLIC_` prefix) |
| Draft mode accessible to non-editors | Low | Medium | `@sanity/preview-url-secret` validates requests cryptographically |
| Performance degradation in draft mode | Low | Low | Draft mode bypasses CDN by design; only affects editors |
| Breaking existing published content flow | Low | Medium | Published client unchanged; draft client is additive |

## Success Criteria

- [ ] Editors can open Presentation view in Sanity Studio
- [ ] Site preview shows in iframe within Studio
- [ ] Editing a field updates the preview in real-time
- [ ] Clicking elements in preview navigates to corresponding field
- [ ] Draft content is only visible when draft mode is enabled
- [ ] Published site continues to work normally for visitors

## Open Questions

1. **API Token Permissions**: Should the token be "Viewer" (read-only drafts) or "Editor" (can also write)? Viewer is safer.

2. **Which pages need visual editing?**: Recommended all content pages, but Book page has minimal CMS content (just the header text).

3. **Preview indicator**: Should we show a banner/badge when viewing draft content? (Nice to have but helpful for editors)

## Related Research

- [docs/research/RESEARCH_2026-01-14_sanity-cms-implementation.md](../research/RESEARCH_2026-01-14_sanity-cms-implementation.md) - Original Sanity CMS setup research, includes preview mode patterns
- [docs/research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md](../research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md) - Next.js migration context
