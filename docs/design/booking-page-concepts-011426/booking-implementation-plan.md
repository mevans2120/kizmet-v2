# Booking Integration Implementation Plan

**Date:** January 14, 2026
**Feature:** Cal.com Booking Integration (Concept 4)
**Reference:** [booking-concept-4-refined.html](./booking-concept-4-refined.html)

---

## Executive Summary

Replace the manual 7-field booking form with cal.com integration. Add "Pay at Studio" messaging, surface contact info in footer, and optionally enable service-specific booking from the Services page.

**Current state:** Manual form with name, email, phone, service, date, time, notes
**Target state:** Embedded cal.com calendar with simplified UX

---

## Codebase Analysis

### What Already Exists (Good News)

| Asset | Location | Notes |
|-------|----------|-------|
| Phone field | `siteSettings.phone` | Already in Sanity schema |
| Email field | `siteSettings.email` | Already in Sanity schema |
| Booking URL field | `siteSettings.bookingUrl` | Already in Sanity schema |
| Design tokens | `globals.css` | Sage, cream, terracotta defined |
| Button variants | `components/ui/button.tsx` | `hero`, `heroOutline`, etc. |
| Toast notifications | Sonner configured | For confirmation feedback |

### Files Requiring Changes

| File | Change Type | Effort |
|------|-------------|--------|
| `src/app/layout.tsx` | Add cal.com script | Small |
| `src/page-content/Book.tsx` | Replace form with embed | Large |
| `src/components/Footer.tsx` | Add phone/email | Small |
| `src/page-content/Services.tsx` | Add Book buttons | Medium |
| `src/components/ServicesPreview.tsx` | Match Services page copy | Small |

### New Components to Create

| Component | Purpose |
|-----------|---------|
| `src/components/CalEmbed.tsx` | Wrapper for cal.com embed |
| `src/components/PayAtStudioBadge.tsx` | Reusable payment messaging |
| `src/components/PoliciesPreview.tsx` | Compact policies summary |

---

## Implementation Phases

### Phase 1: Foundation

**Goal:** Quick wins that work regardless of cal.com account setup

#### 1.1 Update Footer with Contact Info

**File:** `src/components/Footer.tsx`

Current footer has 4 columns but no phone/email. Add a "Contact" section.

```tsx
// Add new column to footer grid
<div className="space-y-3">
  <h4 className="font-heading text-lg">Contact</h4>
  <ul className="space-y-2 text-sm text-muted-foreground">
    <li>
      <a href={`tel:${siteSettings?.phone}`} className="hover:text-foreground transition-colors">
        {siteSettings?.phone || "(360) 123-4567"}
      </a>
    </li>
    <li>
      <a href={`mailto:${siteSettings?.email}`} className="hover:text-foreground transition-colors">
        {siteSettings?.email || "destiny@kizmetmassage.com"}
      </a>
    </li>
  </ul>
</div>
```

#### 1.2 Create PayAtStudioBadge Component

**File:** `src/components/PayAtStudioBadge.tsx` (new)

```tsx
import { CreditCard } from "lucide-react";

export function PayAtStudioBadge() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-sage-50 border-b border-sage-100 text-sm">
      <CreditCard className="w-4 h-4 text-primary" />
      <span>
        <strong className="text-primary">Pay at Studio</strong>
        {" — "}No prepayment required. Cash, card, and mobile payments accepted.
      </span>
    </div>
  );
}
```

#### 1.3 Update Services Page Copy

**File:** `src/page-content/Services.tsx`

Add expanded descriptions, techniques, and "best for" tags to match Concept 4.

Current service card shows only: name, duration, price, description.

Add after description:
- Second paragraph with more detail
- Techniques tags (flex wrap pills)
- Best for tags (flex wrap pills)

---

### Phase 2: Cal.com Embed

**Goal:** Replace manual form with cal.com scheduling

#### 2.1 Add Cal.com Script to Layout

**File:** `src/app/layout.tsx`

```tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://app.cal.com/embed/embed.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

#### 2.2 Create CalEmbed Component

**File:** `src/components/CalEmbed.tsx` (new)

```tsx
"use client";

import { useEffect } from "react";

interface CalEmbedProps {
  calLink: string;  // e.g., "kizmet/massage"
  preselectedService?: "30" | "60" | "90";
}

export function CalEmbed({ calLink, preselectedService }: CalEmbedProps) {
  useEffect(() => {
    // Initialize cal.com embed when script loads
    (window as any).Cal?.("init");
  }, []);

  return (
    <div
      data-cal-link={calLink}
      data-cal-config={JSON.stringify({
        theme: "light",
        styles: { branding: { brandColor: "#5a7a5a" } },
        ...(preselectedService && { duration: parseInt(preselectedService) })
      })}
      className="min-h-[600px] bg-white rounded-lg border border-border overflow-hidden"
    />
  );
}
```

#### 2.3 Replace Book.tsx Form

**File:** `src/page-content/Book.tsx`

Replace the form (lines ~100-249) with:

```tsx
import { CalEmbed } from "@/components/CalEmbed";
import { PayAtStudioBadge } from "@/components/PayAtStudioBadge";
import { PoliciesPreview } from "@/components/PoliciesPreview";
import { Phone, Mail, MapPin } from "lucide-react";

// In component body, replace form with:
<PayAtStudioBadge />

<section className="py-12 px-4">
  <div className="max-w-4xl mx-auto">
    {/* Header */}
    <div className="text-center mb-8">
      <p className="text-xs uppercase tracking-widest text-primary mb-2">
        Schedule Your Visit
      </p>
      <h1 className="font-heading text-4xl mb-2">Book an Appointment</h1>
      <p className="text-muted-foreground">
        Select your service and choose a time that works for you.
      </p>
    </div>

    {/* Cal.com Embed */}
    <CalEmbed
      calLink="kizmet/massage"
      preselectedService={searchParams?.service}
    />

    {/* Contact Info */}
    <div className="flex flex-wrap gap-6 p-5 bg-card rounded-lg my-8">
      <a href={`tel:${siteSettings?.phone}`} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
          <Phone className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium">{siteSettings?.phone}</span>
      </a>
      <a href={`mailto:${siteSettings?.email}`} className="flex items-center gap-2">
        <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
          <Mail className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium">{siteSettings?.email}</span>
      </a>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <span>{siteSettings?.address?.street}, {siteSettings?.address?.city}</span>
      </div>
    </div>

    {/* Policies Preview */}
    <PoliciesPreview />
  </div>
</section>
```

#### 2.4 Create PoliciesPreview Component

**File:** `src/components/PoliciesPreview.tsx` (new)

Shows 3 key policies with link to full page.

```tsx
import { FileText } from "lucide-react";
import Link from "next/link";

const policies = [
  { num: 1, title: "Cancellation", text: "24 hours notice required. Late cancellations subject to 50% fee." },
  { num: 2, title: "Arrival", text: "Please arrive 5 minutes early. New clients: 10-15 minutes for paperwork." },
  { num: 3, title: "Payment", text: "Payment due at time of service. Cash, card, and mobile payments accepted." },
];

export function PoliciesPreview() {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        <h3 className="font-heading text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Before Your Visit
        </h3>
        <Link href="/policies" className="text-sm text-primary hover:underline">
          View All Policies →
        </Link>
      </div>
      <div className="p-5 space-y-4">
        {policies.map((p) => (
          <div key={p.num}>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
              <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                {p.num}
              </span>
              {p.title}
            </h4>
            <p className="text-sm text-muted-foreground pl-7">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 3: Services Page Integration

**Goal:** Allow booking specific services directly from Services page

#### 3.1 Add Book Buttons to Service Cards

**File:** `src/page-content/Services.tsx`

Add to each service card:

```tsx
<div className="flex justify-end mt-4">
  <Button variant="outline" size="sm" asChild>
    <Link href={`/book?service=${service.duration || 60}`}>
      Book
    </Link>
  </Button>
</div>
```

#### 3.2 Handle URL Params in Book Page

**File:** `src/app/book/page.tsx`

Pass search params to Book component:

```tsx
export default async function BookPage({ searchParams }) {
  // ... existing data fetching
  return (
    <Book
      data={data}
      siteSettings={siteSettings}
      searchParams={searchParams}  // Add this
    />
  );
}
```

#### 3.3 Update Homepage ServicesPreview

**File:** `src/components/ServicesPreview.tsx`

Match the expanded copy from Services page for consistency.

---

### Phase 4: Polish (Optional)

#### 4.1 Style Cal.com Embed

**File:** `src/app/globals.css`

Add cal.com style overrides:

```css
/* Cal.com brand customization */
:root {
  --cal-brand-color: hsl(145, 25%, 36%);
}

/* Override cal.com defaults */
[data-cal-link] {
  font-family: var(--font-jakarta), sans-serif;
}
```

#### 4.2 Add Popup Triggers (Concept 2)

For Hero and CTA sections:

```tsx
<Button
  variant="hero"
  data-cal-link="kizmet/massage"
  data-cal-config='{"layout":"popup"}'
>
  Book Your Session
</Button>
```

#### 4.3 Service-Specific Event Types (Concept 3)

If using separate cal.com event types per service:

**Sanity Schema Addition:**
```ts
// In src/sanity/schemaTypes/service.ts
defineField({
  name: 'calcomSlug',
  title: 'Cal.com Event Slug',
  type: 'string',
  description: 'e.g., "30-minute-session"',
})
```

---

## Cal.com Account Setup

### Required Before Implementation

1. **Create cal.com account** at cal.com
2. **Set username** (e.g., "kizmet" → cal.com/kizmet)
3. **Create event type(s)**:
   - Option A: Single event with duration options
   - Option B: Separate events per duration (30/60/90 min)
4. **Configure availability**:
   - Business hours
   - Buffer between appointments
   - Minimum notice period
5. **Set timezone** to Pacific Time (Port Angeles, WA)

### Event Type Configuration

| Field | Recommended Value |
|-------|-------------------|
| Title | "Massage Session" |
| Duration | 30, 60, or 90 minutes (or allow selection) |
| Location | In-person at studio address |
| Booking limits | As needed |
| Requires confirmation | Optional (recommend auto-confirm) |

---

## Sanity CMS Updates

### Required Changes: None

All needed fields already exist in the schema.

### Optional Enhancements

**Add to `siteSettings.ts`:**
```ts
defineField({
  name: 'calcomUsername',
  title: 'Cal.com Username',
  type: 'string',
  description: 'Your cal.com username (e.g., "kizmet")',
})
```

**Add to `service.ts`:**
```ts
defineField({
  name: 'calcomEventSlug',
  title: 'Cal.com Event Slug',
  type: 'string',
  description: 'Slug for service-specific booking',
})
```

---

## Dependencies

### No New Packages Required

Cal.com provides a script-based embed that doesn't require npm packages.

### Optional Package

If React wrapper is preferred:
```bash
npm install @calcom/embed-react
```

---

## Testing Checklist

### Phase 1 (Foundation)
- [ ] Footer displays phone number
- [ ] Footer displays email address
- [ ] Phone/email links work (tel:, mailto:)
- [ ] Pay at Studio badge displays correctly
- [ ] Services page shows expanded copy

### Phase 2 (Cal.com Embed)
- [ ] Cal.com script loads without console errors
- [ ] Embed renders on /book page
- [ ] Calendar navigation works
- [ ] Time slot selection works
- [ ] Booking submission works
- [ ] Confirmation email received
- [ ] Contact info displays below embed
- [ ] Policies preview displays correctly
- [ ] Link to full policies works

### Phase 3 (Services Integration)
- [ ] Book buttons appear on service cards
- [ ] Clicking Book navigates to /book?service=X
- [ ] Service pre-selected in embed (if supported)
- [ ] Homepage preview matches Services page

### Responsive Testing
- [ ] Mobile: Embed adapts to small screens
- [ ] Mobile: Contact info stacks vertically
- [ ] Tablet: Layout remains readable
- [ ] Desktop: Two-column layout works

---

## Rollback Plan

If cal.com integration has issues:

1. **Quick fix:** Comment out CalEmbed, restore form HTML
2. **Keep:** Footer contact info (useful regardless)
3. **Keep:** Pay at Studio messaging (useful regardless)
4. **Alternative:** Link directly to cal.com hosted page

---

## Files Summary

### New Files to Create

```
src/components/
├── CalEmbed.tsx           # Cal.com embed wrapper
├── PayAtStudioBadge.tsx   # Payment messaging component
└── PoliciesPreview.tsx    # Compact policies for Book page
```

### Files to Modify

```
src/app/layout.tsx              # Add cal.com script
src/app/book/page.tsx           # Pass searchParams
src/page-content/Book.tsx       # Replace form with embed
src/page-content/Services.tsx   # Add Book buttons, expand copy
src/components/Footer.tsx       # Add phone/email
src/components/ServicesPreview.tsx  # Match expanded copy
```

### Optional Schema Additions

```
src/sanity/schemaTypes/siteSettings.ts  # Add calcomUsername
src/sanity/schemaTypes/service.ts       # Add calcomEventSlug
```

---

## Open Questions

1. **Cal.com account:** Does one exist? What's the username?
2. **Event types:** Single event with duration options, or separate per duration?
3. **Confirmation flow:** Email only, or SMS too?
4. **Buffer time:** How much time between appointments?
5. **Advance booking:** How far ahead can clients book?

---

*Implementation plan created January 14, 2026*
