# Plan: Google Analytics — Kizmet Massage

**Date:** 2026-01-16
**Tags:** analytics, tracking, google, gtag

## Objective
Implement Google Analytics 4 (GA4) to track website traffic, user behavior, and conversion events for Kizmet Massage.

## Background
The site needs analytics to understand visitor behavior, track bookings, and measure marketing effectiveness. Google Analytics 4 is the current standard and integrates well with other Google services.

**Measurement ID:** `G-S2RM8LKF8X`

## Requirements

### Must Have
- Load Google Analytics script on all pages
- Track page views automatically
- Use environment variable for measurement ID (not hardcoded)
- Follow Next.js best practices for third-party scripts
- Production-only (don't track in development)

### Nice to Have
- Custom event tracking for key actions (e.g., "Book Now" clicks)
- Respect user consent preferences (future GDPR consideration)
- Debug mode for development testing

## Approach

### Option A: Next.js Script Component (Recommended)
Use Next.js `next/script` with the `afterInteractive` strategy.

**File: `src/app/layout.tsx`**
```tsx
import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
```

### Option B: @next/third-parties Package
Google's official Next.js integration package.

```bash
npm install @next/third-parties
```

**File: `src/app/layout.tsx`**
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-S2RM8LKF8X" />
      </body>
    </html>
  )
}
```

### Recommendation
**Option A** is recommended because:
- No additional dependency
- Full control over script loading
- Environment variable support built-in
- Easy to extend with custom events

### Environment Variable
Add to `.env.local` (and Vercel environment variables):
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-S2RM8LKF8X
```

### Custom Event Helper (Optional)
Create a utility for tracking custom events:

**File: `src/lib/analytics.ts`**
```typescript
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track booking clicks
export const trackBookingClick = (serviceName: string) => {
  trackEvent('click', 'booking', serviceName)
}
```

### TypeScript Declaration
Add gtag type to avoid TypeScript errors:

**File: `src/types/gtag.d.ts`**
```typescript
interface Window {
  gtag: (
    command: 'config' | 'event' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void
  dataLayer: any[]
}
```

## Implementation Steps

1. Add environment variable to `.env.local`
2. Add environment variable to Vercel project settings
3. Update `src/app/layout.tsx` with Script components
4. (Optional) Create `src/lib/analytics.ts` for custom events
5. (Optional) Add TypeScript declaration for gtag
6. Test in production (GA4 doesn't track localhost by default)
7. Verify data appears in Google Analytics dashboard

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Script blocks page load | Low | Medium | Use `afterInteractive` strategy |
| Tracking in development | Low | Low | Conditionally render based on env var |
| GDPR compliance issues | Medium | High | Add cookie consent banner (future) |
| Ad blockers prevent tracking | High | Low | Accept as normal - use Vercel Analytics as backup |

## Success Criteria
- [ ] GA4 script loads on production site
- [ ] Page views appear in Google Analytics Real-Time report
- [ ] No console errors related to gtag
- [ ] Script doesn't impact Core Web Vitals (check Lighthouse)
- [ ] Environment variable works in Vercel deployment

## Open Questions
- Do we need cookie consent banner for GDPR/CCPA compliance?
- Which custom events should we track? (booking clicks, form submissions, etc.)
- Should we integrate with Google Search Console?

## Related Research
- None currently in docs/research/
