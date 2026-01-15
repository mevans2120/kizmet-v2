# Plan: Booking Flow Concept 4 Implementation — Kizmet Massage

**Date:** 2026-01-15
**Tags:** booking, cal.com, services, homepage, ux

## Objective

Implement the refined booking flow from Concept 4, creating a seamless path from Homepage → Services → Book with Cal.com integration, service pre-selection, and deprecation of the legacy form-based booking page.

## Background

The current booking page (`/book`) contains a 7-field form that doesn't actually submit anywhere—it's placeholder functionality. Concept 4 introduces:

1. **Homepage service cards with Book buttons** — Direct path to booking from homepage
2. **Services page with Book buttons** — Each service card links to `/book?service=X`
3. **New Book page with Cal.com embed** — Real-time availability, no form friction
4. **Service pre-selection** — URL params auto-select the service in the booking flow

This aligns with the booking integration research recommendation for "Approach B: Embedded Calendar."

---

## Requirements

### Must Have

**Phase 1: Homepage Preview Revisions**
- [ ] Add small "Book" button to each service card in `ServicesPreview.tsx`
- [ ] Button positioned bottom-right of card (use flexbox, `margin-top: auto`)
- [ ] Button links to `/book?service={serviceName}` with service identifier
- [ ] Maintain existing card styling and responsive behavior

**Phase 2: Services Page Revisions**
- [ ] Add "Book" button to each service card in `Services.tsx`
- [ ] Expand service descriptions with richer copy (techniques, best-for lists)
- [ ] Add technique tags/pills below description
- [ ] Button positioned bottom-right, consistent with homepage
- [ ] Maintain 2-column grid layout on desktop

**Phase 3: New Book Page**
- [ ] Install `@calcom/embed-react` package
- [ ] Create new `BookNew.tsx` component with Cal.com inline embed
- [ ] Service selector buttons (30/60/90 min) that sync with Cal.com
- [ ] Read `?service=` URL param and pre-select corresponding service
- [ ] Contact section with phone, email, location (from siteSettings)
- [ ] Policies preview section with key booking policies
- [ ] Link to full policies page
- [ ] Style Cal.com embed to match Kizmet brand (sage primary, cream background)

**Phase 4: Deprecation & Cleanup**
- [ ] Replace `Book.tsx` content with new implementation
- [ ] Remove legacy form components and state
- [ ] Update any hardcoded `/book` links to include service params where appropriate
- [ ] Verify all CTAs (Hero, CTA Section) still work correctly

### Nice to Have

- [ ] Floating Cal.com button site-wide for persistent booking access
- [ ] Element-click triggers on Hero/CTA buttons (open modal instead of navigate)
- [ ] Service-specific Cal.com event type URLs (e.g., `destiny/30-min`, `destiny/60-min`)
- [ ] Confirmation page customization within the site
- [ ] Add business hours to contact section

---

## Approach

### Typography Rules (from existing app)

| Element | Font | Size | Weight | Class |
|---------|------|------|--------|-------|
| Page headline | Cormorant Garamond | 5xl-6xl | 500 | `font-heading text-5xl md:text-6xl font-medium` |
| Section heading | Cormorant Garamond | 3xl | 500 | `font-heading text-3xl font-medium` |
| Card title | Cormorant Garamond | 3xl | 500 | `font-heading text-3xl font-medium` |
| Eyebrow | Inter | sm | 400 | `font-body text-sm uppercase tracking-[0.2em] text-primary` |
| Body text | Inter | base | 400 | `font-body text-base text-muted-foreground` |
| Button text | Inter | sm-base | 500 | Via Button component variants |

### Color Palette

```css
--primary: hsl(145, 25%, 36%)       /* Sage green #5a725c */
--background: hsl(40, 30%, 97%)     /* Cream #faf8f5 */
--card: hsl(40, 25%, 95%)           /* Slightly darker cream */
--foreground: hsl(30, 20%, 15%)     /* Dark brown text */
--muted-foreground: hsl(30, 15%, 45%) /* Muted text */
--border: hsl(35, 20%, 85%)         /* Subtle border */
--accent: hsl(18, 50%, 55%)         /* Terracotta (accent) */
```

### Implementation Order

```
Week 1: Foundation
├── Phase 1: Homepage service card Book buttons
├── Phase 2: Services page Book buttons + expanded descriptions
└── Test service param passing

Week 2: Cal.com Integration
├── Phase 3a: Install @calcom/embed-react
├── Phase 3b: Build new Book page structure
├── Phase 3c: Style Cal.com to match brand
└── Phase 3d: Add contact + policies sections

Week 3: Polish & Deprecation
├── Phase 4: Replace old Book.tsx
├── QA all booking flows
├── Mobile testing
└── Analytics setup
```

### File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/ServicesPreview.tsx` | Modify | Add Book buttons to cards |
| `src/page-content/Services.tsx` | Modify | Add Book buttons, expand descriptions |
| `src/page-content/Book.tsx` | Replace | New Cal.com-based implementation |
| `package.json` | Modify | Add `@calcom/embed-react` dependency |
| `src/components/ui/` | Possibly extend | May need service selector component |

### Existing Components to Reuse

- `Card`, `CardContent`, `CardHeader`, `CardTitle` — Keep existing card structure
- `Button` with `variant="outline"` and `size="sm"` — For Book buttons
- `Navigation`, `Footer` — Keep as-is
- Page header pattern (eyebrow + headline + subtitle) — Reuse structure

---

## Technical Details

### Service Pre-Selection

```tsx
// In new Book.tsx
import { useSearchParams } from 'next/navigation'

const searchParams = useSearchParams()
const serviceParam = searchParams.get('service') // "30" | "60" | "90"

// Map to Cal.com event type or internal state
const serviceMap = {
  '30': { name: '30 Minute Session', price: '$60', calLink: 'destiny/30-min' },
  '60': { name: '60 Minute Session', price: '$100', calLink: 'destiny/60-min' },
  '90': { name: '90 Minute Session', price: '$145', calLink: 'destiny/90-min' },
}
```

### Cal.com Embed Integration

```tsx
import Cal from "@calcom/embed-react"

<Cal
  calLink="destiny/massage"
  style={{ width: "100%", height: "600px", overflow: "hidden" }}
  config={{
    theme: "light",
    styles: {
      branding: { brandColor: "#5a725c" }
    }
  }}
/>
```

### Book Button Component Pattern

```tsx
// Reusable pattern for service cards
<div className="flex flex-col h-full">
  {/* Card content */}
  <CardHeader>...</CardHeader>
  <CardContent className="flex-grow">...</CardContent>

  {/* Footer pinned to bottom */}
  <div className="px-6 pb-6 mt-auto flex justify-end">
    <Button variant="outline" size="sm" asChild>
      <Link href={`/book?service=${serviceId}`}>Book</Link>
    </Button>
  </div>
</div>
```

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Cal.com embed styling doesn't match brand | Medium | Medium | Use Cal.com's CSS variables; fallback to iframe if needed |
| Cal.com account not set up yet | Medium | High | Implement UI first with placeholder; add embed when account ready |
| Service param not preserved through booking | Low | Medium | Test flow end-to-end; use Cal.com's prefill options |
| Mobile embed performance issues | Low | Medium | Test on real devices; use lazy loading |
| Breaking existing /book links | Low | Low | Maintain same URL structure, add param support |

---

## Success Criteria

### Quantitative Metrics

- [ ] **Booking conversion rate**: Track clicks on Book buttons → completed bookings
- [ ] **Time to book**: Measure from landing to booking confirmation (target: <2 minutes)
- [ ] **Mobile booking rate**: Percentage of bookings from mobile devices
- [ ] **Service selection distribution**: Which services are most booked via each entry point

### Qualitative Metrics

- [ ] **User feedback**: No confusion about booking process
- [ ] **Brand consistency**: Cal.com embed feels native to the site
- [ ] **Zero friction**: No form fields to fill before seeing availability

### Implementation Checklist

- [ ] All Book buttons link to `/book?service=X` with correct param
- [ ] Service pre-selection works from URL param
- [ ] Cal.com embed loads in <2 seconds
- [ ] Mobile responsive at all breakpoints (375px, 768px, 1024px)
- [ ] Contact info pulled from Sanity siteSettings
- [ ] Policies preview shows key booking info
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Lighthouse performance score >80

### Analytics Setup

```typescript
// Track booking funnel
const trackBookingEvent = (event: string, data: object) => {
  // Example events:
  // - 'book_button_click' { source: 'homepage' | 'services', service: '60' }
  // - 'service_selected' { service: '60' }
  // - 'booking_completed' { service: '60', source: 'direct' | 'homepage' | 'services' }
}
```

---

## Open Questions

1. **Cal.com account**: What is the Cal.com username/URL? Can we use this for now? cal.com/michael-evans-xel1zg/30min and then apend 60min and 90min for the other two calendars 
2. **Event types**: Should each service duration be a separate Cal.com event type, or one event with duration selection? Each service duration will be a URL, but lets
3. **Confirmation flow**: Does Cal.com handle confirmation emails, or do we need custom confirmation? I believe Cal.com handles it
4. **Business hours**: What are Destiny's actual availability hours for display? They will be displayed in the calendar, since her hours will vary week to week. 
5. **Cancellation policy display**: Should the policies preview link directly to the cancellation section? Yes

---

## Related Research

- [Booking Integration Research](../design/booking-integration-research-011426/booking-integration-research.md) — Cal.com options, contact patterns, payment messaging
- [Concept 4 Design Mockup](../design/booking-page-concepts-011426/booking-concept-4-refined.html) — Visual reference for all three pages

---

## Appendix: Current vs. New Comparison

### Homepage ServicesPreview

| Current | New (Concept 4) |
|---------|-----------------|
| Cards without actions | Cards with "Book" button |
| Click card → nothing | Click Book → `/book?service=X` |
| "View All Services" button | Keep, plus individual Book buttons |

### Services Page

| Current | New (Concept 4) |
|---------|-----------------|
| Cards without actions | Cards with "Book" button |
| Basic description | Expanded with techniques, best-for |
| Single CTA at bottom | Individual Book + bottom CTA |

### Book Page

| Current | New (Concept 4) |
|---------|-----------------|
| 7-field form | Cal.com embed |
| No real-time availability | Live calendar |
| Form doesn't submit | Actual booking created |
| Phone number at bottom | Contact info sidebar |
| No policies info | Policies preview section |

---

*Plan created 2026-01-15*
