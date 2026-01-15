# Plan: Sanity Webhook Revalidation — Kizmet Massage & Wellness

**Date:** 2026-01-15
**Tags:** sanity, webhooks, caching, isr, revalidation

## Objective

Enable instant cache invalidation when content is published in Sanity, so editors see their changes on the live site immediately without waiting for time-based revalidation or manual rebuilds.

## Background

**Current Problem:**
- Pages are statically generated at build time
- Sanity CDN caches query results (`useCdn: true` in production)
- When editors upload new images or update content, the site shows stale data
- No revalidation strategy exists

**Why Webhooks:**
- On-demand revalidation triggers immediately when content changes
- More efficient than polling or short TTLs
- Required for good editorial experience with Presentation Mode
- Sanity has built-in webhook support

## Requirements

### Must Have
- [ ] Webhook endpoint that receives Sanity publish events
- [ ] Signature validation to ensure requests come from Sanity
- [ ] Path-based revalidation for affected pages
- [ ] Environment variable for webhook secret
- [ ] Webhook configured in Sanity project settings

### Nice to Have
- [ ] Tag-based revalidation for more granular control
- [ ] Logging/monitoring of revalidation events
- [ ] Fallback time-based revalidation (ISR) as safety net

## Approach

### Phase 1: Create Webhook Endpoint

**1.1 Create revalidation route** (`src/app/api/revalidate/route.ts`)

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'No document type provided' },
        { status: 400 }
      )
    }

    // Map document types to paths
    const pathMap: Record<string, string[]> = {
      homepageSettings: ['/'],
      aboutPage: ['/about'],
      servicesPage: ['/services'],
      service: ['/services', '/book', '/'],
      policiesPage: ['/policies'],
      bookPage: ['/book'],
      siteSettings: ['/', '/about', '/services', '/policies', '/book'],
      footerSettings: ['/', '/about', '/services', '/policies', '/book'],
    }

    const paths = pathMap[body._type] || ['/']

    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}
```

### Phase 2: Environment Setup

**2.1 Generate webhook secret**

```bash
# Generate a random secret
openssl rand -base64 32
```

**2.2 Add to environment variables**

`.env.local`:
```bash
SANITY_REVALIDATE_SECRET=your-generated-secret-here
```

Add to Vercel environment variables as well.

### Phase 3: Configure Sanity Webhook

**3.1 In Sanity Dashboard (manage.sanity.io):**

1. Go to your project → API → Webhooks
2. Create new webhook:
   - **Name:** `Production Revalidation`
   - **URL:** `https://your-domain.com/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** Leave empty (all document types) or filter to content types only
   - **Secret:** Paste your `SANITY_REVALIDATE_SECRET`
   - **HTTP Method:** POST
   - **API Version:** Latest

### Phase 4: Add Fallback ISR (Safety Net)

**4.1 Add revalidate export to pages**

For each page file in `src/app/*/page.tsx`:

```typescript
// Revalidate every 5 minutes as fallback if webhook fails
export const revalidate = 300
```

This ensures content eventually updates even if webhooks fail.

## Implementation Checklist

| # | Task | File(s) |
|---|------|---------|
| 1 | Create revalidation API route | `src/app/api/revalidate/route.ts` |
| 2 | Generate webhook secret | — |
| 3 | Add secret to `.env.local` | `.env.local` |
| 4 | Add secret to Vercel env vars | Vercel dashboard |
| 5 | Configure webhook in Sanity | Sanity dashboard |
| 6 | Add fallback ISR to homepage | `src/app/page.tsx` |
| 7 | Add fallback ISR to about page | `src/app/about/page.tsx` |
| 8 | Add fallback ISR to services page | `src/app/services/page.tsx` |
| 9 | Add fallback ISR to policies page | `src/app/policies/page.tsx` |
| 10 | Add fallback ISR to book page | `src/app/book/page.tsx` |
| 11 | Test webhook end-to-end | — |

## Testing

**Local Testing:**
```bash
# Test the endpoint with curl (will fail signature, but tests route exists)
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"_type": "homepageSettings"}'
```

**Production Testing:**
1. Deploy to Vercel
2. Make a change in Sanity Studio and publish
3. Check Sanity webhook logs for successful delivery
4. Verify site reflects changes immediately

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Webhook secret exposed | Low | High | Use server-only env var, rotate if compromised |
| Webhook fails silently | Medium | Medium | Add fallback ISR (300s), monitor webhook logs in Sanity |
| Over-revalidation (many paths) | Low | Low | Document types map to specific paths, not full site rebuild |
| Webhook URL changes (redeploy) | Low | Low | Use production domain, not preview URLs |

## Success Criteria

- [ ] Editing content in Sanity and publishing reflects on live site within 5 seconds
- [ ] Webhook shows successful delivery in Sanity dashboard logs
- [ ] Invalid webhook requests (wrong signature) are rejected with 401
- [ ] Fallback ISR catches any missed updates within 5 minutes

## Integration with Presentation Mode

This webhook setup complements Presentation Mode:

- **Presentation Mode** = Live preview of *draft* content while editing
- **Webhooks** = Instant update of *published* content on live site

Together they provide:
1. Editors see changes in real-time while editing (Presentation Mode)
2. Published changes appear on live site immediately (Webhooks)

## Related Plans

- [PLAN_2026-01-15_sanity-presentation-mode.md](./PLAN_2026-01-15_sanity-presentation-mode.md) - Presentation Mode implementation (shares API token requirement)

## Open Questions

1. **Webhook filter**: Should we filter to only content document types, or include all? Filtering reduces noise but risks missing new types.

2. **Revalidation granularity**: Current approach revalidates entire paths. Should we implement tag-based revalidation for more surgical updates?

3. **Notification**: Should editors see a toast/notification when their published changes are live? (Nice UX but adds complexity)
