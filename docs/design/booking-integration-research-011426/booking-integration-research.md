# Booking Integration Design Research

**Date:** January 14, 2026
**Feature:** Client Appointment Booking with Cal.com
**Objective:** Explore ways to allow clients to quickly book appointments, deprioritize contact form in favor of direct contact methods, and clarify payment expectations.

---

## Executive Summary

This research explores integration options for cal.com appointment booking, alternatives to contact forms, and UX patterns for communicating payment policies. Key recommendations:

1. **Use inline embed** for dedicated booking page, **floating pop-up** for site-wide availability
2. **Replace contact form** with prominent phone number and email display
3. **Add clear "Pay at Studio" messaging** near booking interface

---

## Jobs-to-be-Done Analysis

### Functional Jobs
| Job | Current State | Desired State |
|-----|---------------|---------------|
| Book an appointment quickly | Unknown/friction | 1-2 clicks to booking flow |
| Know how to contact the studio | Contact form creates friction | Direct phone/email visible |
| Understand payment expectations | Unclear | Explicit "pay at studio" messaging |

### Emotional Jobs
- **Feel confident** booking won't require immediate payment
- **Feel welcomed** by easy access to real human contact
- **Trust the business** through transparency about process

### Context Triggers
- User lands on site after Google search or referral
- User wants to schedule without creating accounts or entering payment info
- User prefers calling/texting over filling forms

---

## Cal.com Integration Options

### Option 1: Inline Embed (Recommended for Booking Page)

**Description:** Calendar displays directly within page content. User sees available slots immediately without clicks.

**Pros:**
- Seamless, native feel—looks like part of your site
- Entire booking happens without leaving your website
- Best conversion for dedicated booking pages
- Highly customizable (colors, branding)
- Recent performance improvements: loads in <1 second

**Cons:**
- Takes up page real estate
- May require dedicated page or section

**Best For:** Dedicated "Book Now" or "Schedule" page where booking is the primary action.

**Implementation:**
```html
<!-- Cal.com Inline Embed -->
<div id="cal-inline-embed"></div>
<script>
  (function (C, A, L) { ... })  // Cal.com embed script
  Cal("inline", {
    elementOrSelector: "#cal-inline-embed",
    calLink: "your-username/event-type"
  });
</script>
```

---

### Option 2: Floating Pop-up Button (Recommended for Site-Wide)

**Description:** Persistent floating button appears on all pages. Clicking opens booking modal.

**Pros:**
- Available on every page without taking content space
- Non-intrusive until clicked
- Customizable button text, colors, position
- Great for "always available" booking access

**Cons:**
- Requires user to click to see availability
- May compete with other floating elements (chat widgets)

**Best For:** Making booking accessible across entire site, especially on pages where booking isn't the primary focus.

**Implementation:**
```html
<script>
  Cal("floatingButton", {
    calLink: "your-username/event-type",
    buttonText: "Book Appointment",
    buttonColor: "#your-brand-color"
  });
</script>
```

---

### Option 3: Element Click Pop-up

**Description:** Any element (button, link, image) triggers booking modal when clicked.

**Pros:**
- Full control over trigger placement and design
- Works with existing CTAs
- Multiple triggers possible

**Cons:**
- Requires identifying/creating trigger elements
- Slightly more setup

**Best For:** Integrating booking into existing page elements like hero CTAs or service cards.

**Implementation:**
```html
<button data-cal-link="your-username/event-type">
  Book Now
</button>
```

---

### Option 4: Direct Link (No Embed)

**Description:** Link opens cal.com booking page in new tab or same window.

**Pros:**
- Zero code integration—just a link
- Works anywhere (email, social, print)
- No script loading on your site

**Cons:**
- User leaves your website
- Less seamless experience
- Loses brand immersion

**Best For:** Email signatures, social media bios, or minimal-code situations.

---

### Comparison Matrix

| Criteria | Inline Embed | Floating Button | Element Click | Direct Link |
|----------|-------------|-----------------|---------------|-------------|
| UX Seamlessness | 5/5 | 4/5 | 4/5 | 2/5 |
| Implementation Effort | Medium | Low | Medium | None |
| Site-Wide Availability | Low | High | Medium | N/A |
| Conversion Potential | High | Medium | Medium | Low |
| Mobile Experience | Good | Good | Good | Acceptable |
| Customization | High | High | High | Low |

---

## Recommendation: Hybrid Approach

**Primary:** Inline embed on dedicated `/book` or `/schedule` page
**Secondary:** Floating button site-wide for persistent access

This provides:
- High-conversion dedicated booking experience
- Omnipresent booking access without cluttering pages
- Consistent brand experience throughout

---

## Contact Section: Replacing the Form

### Research Insight

> "Users still expect to see company addresses, phone numbers, and email addresses on 'Contact Us' pages. Don't hide or replace these elements with automated tools such as 'Contact Us' forms or chat."
> — Nielsen Norman Group

> "There are companies that don't even give you a phone number anymore. I don't like it at all... it makes them seem suspicious to me."
> — User research participant

### Recommended Contact Display

**Instead of a contact form, display:**

```
┌─────────────────────────────────────┐
│           GET IN TOUCH              │
│                                     │
│  📞  (555) 123-4567                 │
│      Mon–Sat: 9am–7pm               │
│                                     │
│  ✉️  hello@yourstudio.com           │
│      We respond within 24 hours     │
│                                     │
│  📍  123 Main Street                │
│      City, State 12345              │
└─────────────────────────────────────┘
```

### Key Elements

1. **Phone Number** — Large, tappable on mobile (use `tel:` link)
2. **Hours of Operation** — Sets expectations for response
3. **Email Address** — Direct mailto link, not a form
4. **Physical Address** — Builds trust and helps local SEO
5. **Response Time Expectation** — Reduces anxiety

### Why This Works

| Contact Form Problems | Direct Contact Benefits |
|-----------------------|------------------------|
| Feels like a barrier | Immediate action possible |
| Users suspect email harvesting | Transparent communication |
| Delays response | User controls timing |
| Impersonal | Human connection |
| Form abandonment risk | No friction |

---

## Payment Messaging: "Pay at Studio"

### The Problem

When booking systems are present, users often assume prepayment is required. This can deter bookings if users:
- Don't want to enter payment info online
- Prefer to pay in cash
- Want to meet/evaluate before committing payment

### Recommended Messaging

Place **near or within** the booking interface:

**Option A: Badge/Tag Style**
```
┌──────────────────────┐
│  💳 Pay at Studio    │
│  No prepayment       │
│  required            │
└──────────────────────┘
```

**Option B: Inline Text**
> "Book your appointment online — pay when you arrive at the studio. We accept cash, card, and mobile payments."

**Option C: FAQ Style**
> **Do I need to pay online?**
> No! Simply book your time slot and pay at the studio when you arrive.

### Placement Recommendations

1. **Above or beside the booking calendar** — Seen before booking starts
2. **In confirmation/success message** — Reinforces after booking
3. **In email confirmation** — Reminder of what to expect

### Trust Signals to Include

- Payment methods accepted (cash, cards, mobile)
- No hidden fees messaging
- Cancellation/rescheduling policy

---

## Design Principles

### 1. Booking Over Browsing
*Make scheduling the path of least resistance*

**Insight:** 46% of appointments are self-booked by clients online. Reducing friction increases conversions.

**Application:** Inline embed on dedicated page, floating button everywhere else.

---

### 2. Human Contact Over Forms
*Direct lines build trust; forms create barriers*

**Insight:** Users view contact forms as barriers and prefer calling real people. Hidden phone numbers make businesses seem "suspicious."

**Application:** Prominent phone/email display, no contact form required.

---

### 3. Transparency Over Assumption
*Tell users what to expect before they ask*

**Insight:** Uncertainty about payment requirements deters bookings. Clear expectations reduce anxiety.

**Application:** Explicit "Pay at Studio" messaging near booking interface.

---

### 4. Mobile-First Booking
*Thumb-friendly scheduling for on-the-go clients*

**Insight:** Many bookings happen on mobile devices. Tappable phone numbers and responsive embeds are essential.

**Application:** Use `tel:` links, test embed on mobile, ensure touch targets are adequate.

---

## Implementation Roadmap

### Phase 1: Quick Wins
- [ ] Add cal.com floating button site-wide
- [ ] Replace contact form with phone/email display
- [ ] Add "Pay at Studio" badge to existing booking references

### Phase 2: Dedicated Booking Experience
- [ ] Create dedicated `/book` or `/schedule` page
- [ ] Implement inline cal.com embed
- [ ] Add payment messaging and trust signals
- [ ] Include service descriptions with booking options

### Phase 3: Optimization
- [ ] Add UTM tracking to booking links
- [ ] Monitor booking conversion rates
- [ ] A/B test floating button text/position
- [ ] Gather user feedback on booking experience

---

## Open Questions for Validation

1. **Event Types:** What appointment types need to be bookable? (consultation, session, follow-up?)
2. **Duration Options:** Should clients select duration, or is it fixed per service?
3. **Team/Provider:** Is there one provider or multiple to choose from?
4. **Timezone Handling:** Is the client base local or distributed?
5. **Confirmation Flow:** What should happen after booking? (email, SMS, both?)

---

## Sources

- [Cal.com Embed Documentation](https://cal.com/embed)
- [Cal.com Features: Embed](https://cal.com/features/embed)
- [Cal.com Blog: How to Add Booking Pages](https://cal.com/blog/how-to-add-booking-pages-to-your-website)
- [Nielsen Norman Group: Contact Us Page Guidelines](https://www.nngroup.com/articles/contact-us-pages/)
- [HubSpot: Best Contact Us Pages](https://blog.hubspot.com/service/best-contact-us-pages)
- [Apptoto: Online Scheduling Best Practices](https://www.apptoto.com/best-practices/online-scheduling-best-practices)
- [Booknetic: Appointment Scheduling Process](https://www.booknetic.com/blog/appointment-scheduling-process)

---

## Kizmet Site Audit

### Current Site Structure

```
Homepage
├── Navigation (About, Services, Policies, Book Now)
├── Hero → CTA: "Book Your Session" → /book
├── ServicesPreview
├── AboutPreview
├── CTASection → CTA: "Book Your Appointment" → /book
└── Footer (Quick Links, Location, Therapist Name)

/book (Current)
├── Header: "Book an Appointment"
├── Manual Form (7 fields: name, email, phone, service, date, time, message)
├── Submit → Toast notification (no actual submission)
└── "Prefer to book by phone?" + phone number
```

### Current Pain Points Identified

| Issue | Location | Impact |
|-------|----------|--------|
| Manual booking form | `/book` | High friction, no real-time availability |
| No email displayed | Entire site | Users can't email directly |
| Phone only on book page | `/book` bottom | Easy to miss, not prominent |
| Footer lacks contact info | All pages | Missed trust-building opportunity |
| No payment expectations | Anywhere | User uncertainty |
| Form doesn't actually work | `/book` | Placeholder only, toast feedback |

### Data Available in Sanity

The `siteSettings` schema already supports:
- `phone` - Business phone number
- `email` - Business email address
- `address` - Street, city, state, zip
- `bookingUrl` - External booking link (could be cal.com URL)

**Currently unused:** `phone` and `email` are only used on the Book page. Footer only displays address.

---

## Kizmet-Specific Approaches

### Approach A: Minimal Change (Link-Based)

**Philosophy:** Keep current site structure, replace form with cal.com link.

**Changes:**
1. Remove booking form from `/book`
2. Add prominent "Book Now" button linking to cal.com
3. Display phone + email prominently on `/book`
4. Add "Pay at Studio" messaging
5. Update Footer with phone/email

**Book Page Layout:**
```
┌─────────────────────────────────────────────┐
│  SCHEDULE YOUR VISIT                        │
│  Book an Appointment                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Book Online with Cal.com] →       │   │
│  │  See real-time availability         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  💳 Pay at Studio                          │
│  No prepayment required                     │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Prefer to reach out directly?              │
│                                             │
│  📞 (360) 123-4567                         │
│  ✉️ destiny@kizmetmassage.com              │
│                                             │
│  📍 105 1/2 E 1st St                       │
│     Port Angeles, WA                        │
└─────────────────────────────────────────────┘
```

**Pros:**
- Fastest to implement
- No embed code needed
- Works if cal.com styling can't match site

**Cons:**
- User leaves site to book
- Less seamless experience
- Loses brand immersion during booking

**Effort:** Low (1-2 hours)

---

### Approach B: Embedded Calendar (Recommended)

**Philosophy:** Native booking experience within the site.

**Changes:**
1. Replace form with inline cal.com embed on `/book`
2. Style embed to match sage/cream palette
3. Add contact info sidebar or below embed
4. Add "Pay at Studio" badge
5. Update Footer with phone/email
6. Optional: Add floating button site-wide

**Book Page Layout:**
```
┌───────────────────────────────────────────────────────────┐
│  SCHEDULE YOUR VISIT                                      │
│  Book an Appointment                                      │
│  Select a time that works for you                         │
│                                                           │
│  ┌─────────────────────────────────┬────────────────────┐ │
│  │                                 │                    │ │
│  │   [Cal.com Inline Embed]        │  💳 Pay at Studio  │ │
│  │   - Shows calendar              │  No prepayment     │ │
│  │   - Available time slots        │  required          │ │
│  │   - Service selection           │                    │ │
│  │   - Booking confirmation        │  ────────────────  │ │
│  │                                 │                    │ │
│  │                                 │  Questions?        │ │
│  │                                 │  📞 (360) 123-4567 │ │
│  │                                 │  ✉️ destiny@...    │ │
│  │                                 │                    │ │
│  └─────────────────────────────────┴────────────────────┘ │
│                                                           │
│  📍 105 1/2 E 1st St, Port Angeles, WA                   │
└───────────────────────────────────────────────────────────┘
```

**Pros:**
- Seamless brand experience
- User never leaves site
- Real-time availability
- Higher conversion potential
- Cal.com handles confirmations

**Cons:**
- More implementation effort
- Need to style embed to match
- Script adds page weight (though <1s load now)

**Effort:** Medium (3-4 hours)

---

### Approach C: Hybrid (Best of Both)

**Philosophy:** Embedded for dedicated page, triggers throughout site.

**Changes:**
1. Inline embed on `/book` (Approach B)
2. Element-click triggers on existing CTAs:
   - Hero "Book Your Session" → opens cal.com modal
   - CTA Section "Book Your Appointment" → opens cal.com modal
   - Service cards → could link to specific service booking
3. Update Footer with contact info
4. Optional floating button

**Additional CTA Behavior:**
```tsx
// Hero.tsx - CTA triggers cal.com popup instead of navigation
<Button
  variant="hero"
  size="xl"
  data-cal-link="destiny/massage"
  data-cal-config='{"theme":"light"}'
>
  Book Your Session
</Button>
```

**Pros:**
- Booking accessible from any page
- Users don't need to navigate to /book
- Maintains dedicated booking page for direct links
- Reduces clicks to book

**Cons:**
- Most implementation effort
- Multiple integration points to maintain
- May confuse users if behavior differs (some CTAs navigate, some open modal)

**Effort:** Medium-High (4-6 hours)

---

### Approach D: Full Integration (Premium)

**Philosophy:** Cal.com deeply integrated with site data.

**Changes:**
1. All of Approach C
2. Services page cards link to specific cal.com event types
3. Sanity `bookingUrl` field used to configure cal.com username
4. Cal.com React component instead of script embed
5. Custom confirmation page on site (advanced)

**Service Card Enhancement:**
```
┌─────────────────────────────────────┐
│  60 Minute Session                  │
│  ⏱ 60 min  |  💲 $100              │
│                                     │
│  The most popular choice...         │
│                                     │
│  [Book This Service] → cal.com/60   │
└─────────────────────────────────────┘
```

**Pros:**
- Most polished experience
- Service-specific booking flows
- Extensible for future needs

**Cons:**
- Highest effort
- Requires cal.com event type setup per service
- More complex maintenance

**Effort:** High (6-10 hours)

---

## Recommendation for Kizmet

**Start with Approach B (Embedded Calendar)** with elements of C.

### Rationale:

1. **Brand alignment** — Kizmet has a refined aesthetic (sage/cream palette, Cormorant Garamond headings). An embedded calendar preserves this.

2. **Single provider** — Destiny is the only therapist, so no complex provider selection needed.

3. **Local clientele** — Port Angeles is a small town; clients likely prefer the personal touch of seeing booking on the site vs. being sent elsewhere.

4. **Existing infrastructure** — Sanity already has `phone`, `email`, and `bookingUrl` fields ready to use.

5. **Quick win available** — Footer contact info can be added immediately regardless of cal.com timeline.

### Suggested Implementation Order:

```
Phase 1: Foundation (Before cal.com)
├── Update Footer with phone + email from siteSettings
├── Add phone/email to Book page prominently
├── Remove or simplify current form (or hide behind "I'll reach out" option)
└── Add "Pay at Studio" messaging

Phase 2: Cal.com Integration
├── Set up cal.com account with event types (30/60/90 min)
├── Add inline embed to /book page
├── Style embed to match site (sage primary, cream background)
├── Test on mobile

Phase 3: Enhancement (Optional)
├── Add element-click triggers to Hero/CTA buttons
├── Consider floating button
└── Add service-specific booking links
```

---

## Footer Enhancement Spec

Current Footer:
```
[Brand] | Quick Links | Location | Your Therapist
```

Proposed Footer:
```
[Brand] | Quick Links | Contact | Location
                      │
                      ├── 📞 Phone (tel: link)
                      ├── ✉️ Email (mailto: link)
                      └── Hours: Mon-Sat 9am-6pm
```

**Code location:** `src/components/Footer.tsx`
**Data source:** `siteSettings.phone`, `siteSettings.email`

---

## Technical Notes

### Cal.com Embed in Next.js

```tsx
// Option 1: Script tag in layout.tsx or _document
<Script src="https://cal.com/embed.js" strategy="lazyOnload" />

// Option 2: React component (preferred for Next.js)
npm install @calcom/embed-react

import Cal from "@calcom/embed-react";

<Cal
  calLink="destiny/massage"
  style={{ width: "100%", height: "100%", overflow: "scroll" }}
  config={{
    theme: "light",
    styles: {
      branding: { brandColor: "#5a7a5a" } // sage-500
    }
  }}
/>
```

### Styling Cal.com to Match Kizmet

```css
/* Cal.com supports these CSS variables */
--cal-brand-color: hsl(145, 25%, 36%);      /* sage-500 / primary */
--cal-brand-text-color: hsl(40, 30%, 97%);  /* cream / primary-foreground */
--cal-bg-color: hsl(40, 30%, 97%);          /* background */
--cal-text-color: hsl(30, 20%, 15%);        /* foreground */
```

---

## Open Questions (Updated)

1. ~~Event Types~~ → **30, 60, 90 minute sessions** (confirmed from Services page)
2. ~~Provider~~ → **Single provider (Destiny)** (confirmed)
3. **Cal.com account** — Does one exist? What's the username?
4. **Business hours** — What are the actual hours for the studio?
5. **Cancellation policy** — Already on Policies page, link from booking?

---

## Sources

- [Cal.com Embed Documentation](https://cal.com/embed)
- [Cal.com Features: Embed](https://cal.com/features/embed)
- [Cal.com Blog: How to Add Booking Pages](https://cal.com/blog/how-to-add-booking-pages-to-your-website)
- [Nielsen Norman Group: Contact Us Page Guidelines](https://www.nngroup.com/articles/contact-us-pages/)
- [HubSpot: Best Contact Us Pages](https://blog.hubspot.com/service/best-contact-us-pages)
- [Apptoto: Online Scheduling Best Practices](https://www.apptoto.com/best-practices/online-scheduling-best-practices)
- [Booknetic: Appointment Scheduling Process](https://www.booknetic.com/blog/appointment-scheduling-process)

---

*Research conducted January 14, 2026*
*Updated with Kizmet site audit and specific approaches*
