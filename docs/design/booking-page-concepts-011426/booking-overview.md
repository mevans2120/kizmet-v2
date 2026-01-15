# Booking Integration Design Concepts

**Date:** January 14, 2026
**Feature:** Cal.com Booking Integration for Kizmet Massage
**Reference:** [booking-integration-research.md](../booking-integration-research-011426/booking-integration-research.md)

---

## Design Challenge

Replace the current manual booking request form with cal.com integration to enable real-time appointment scheduling. Additionally:
- Deprioritize contact form in favor of direct phone/email
- Add "Pay at Studio" messaging to reduce booking friction
- Update footer with contact information

---

## Key Research Insights

1. **Form friction kills conversion** — Current 7-field form creates barrier; 46% of appointments are self-booked when made easy
2. **Hidden contact info erodes trust** — Users find businesses without visible phone numbers "suspicious" (NNG research)
3. **Payment uncertainty deters booking** — Users assume prepayment is required; explicit "Pay at Studio" messaging reduces anxiety
4. **Brand consistency matters** — Kizmet's refined sage/cream aesthetic should carry through to booking experience

---

## Concept 1: Embedded Calendar

**File:** [booking-concept-1-embedded.html](./booking-concept-1-embedded.html)

**Approach:** Replace the booking form with an inline cal.com embed on the `/book` page. Add sidebar with contact info and "Pay at Studio" badge.

### Key Design Decisions

| Element | Decision | Rationale |
|---------|----------|-----------|
| Layout | Two-column: embed + sidebar | Keeps contact info visible alongside booking |
| Embed placement | Main content area | Primary focus on booking action |
| Pay at Studio | Prominent badge in sidebar | Visible before user starts booking |
| Contact info | Sidebar with icons | Provides alternative without competing with booking |
| Footer | Added phone + email | Site-wide contact visibility |

### Strengths
- Clean, focused booking experience
- User stays on site throughout
- Cal.com handles all scheduling complexity
- Easy to style to match Kizmet brand

### Tradeoffs
- User must navigate to /book page first
- Single entry point for all bookings

### Implementation Effort
**Medium (3-4 hours)**
- Install @calcom/embed-react
- Create new Book page layout
- Style embed with brand colors
- Update Footer component

---

## Concept 2: Hybrid with Popups

**File:** [booking-concept-2-hybrid.html](./booking-concept-2-hybrid.html)

**Approach:** Embedded calendar on /book page PLUS popup triggers on CTAs throughout the site (Hero, CTA section, floating button).

### Key Design Decisions

| Element | Decision | Rationale |
|---------|----------|-----------|
| Hero CTA | Opens popup instead of navigation | Book from homepage without leaving |
| Floating button | Always visible, bottom-right | Omnipresent booking access |
| CTA section | Popup trigger | Consistent behavior across site |
| Popup modal | Contains cal.com embed | Same booking flow in modal format |

### Strengths
- Booking accessible from any page
- Reduces clicks to book
- Floating button provides constant reminder
- Maintains dedicated /book page for direct links

### Tradeoffs
- More integration points to maintain
- Mixed behavior (some elements navigate, some open popup)
- Floating button may compete with other UI elements

### Implementation Effort
**Medium-High (4-6 hours)**
- All of Concept 1
- Add data-cal-link attributes to CTAs
- Configure popup behavior
- Optional: Floating button component

---

## Concept 3: Full Integration

**File:** [booking-concept-3-full-integration.html](./booking-concept-3-full-integration.html)

**Approach:** Service-specific booking links. Each service on the Services page links directly to its own cal.com event type.

### Key Design Decisions

| Element | Decision | Rationale |
|---------|----------|-----------|
| Service cards | Premium design with book button | Service selection happens on site, not in cal.com |
| Per-service booking | Unique cal.com URL per service | Pre-selects the service, streamlines flow |
| Pay at Studio banner | Top of services page | Sets expectations before browsing |
| Benefit tags | Visual service differentiation | Helps users choose the right session |

### Strengths
- Most polished user experience
- Service selection happens in branded context
- Direct path from decision to booking
- Extensible for future services

### Tradeoffs
- Requires 3 cal.com event types (30/60/90 min)
- More complex cal.com configuration
- Sanity integration needed for CMS-controlled URLs

### Implementation Effort
**High (6-10 hours)**
- Set up 3 cal.com event types
- Enhanced Services page component
- Per-service booking URL configuration
- Optional: Sanity field for cal.com slugs

---

## Comparison Matrix

| Criteria | Concept 1 | Concept 2 | Concept 3 |
|----------|-----------|-----------|-----------|
| **User Experience** | Good | Better | Best |
| **Implementation Effort** | Medium | Medium-High | High |
| **Maintenance Complexity** | Low | Medium | Medium |
| **Booking Accessibility** | /book page only | Any page | Services page + /book |
| **Service Pre-selection** | In cal.com embed | In cal.com embed | Pre-selected by button |
| **Brand Consistency** | High | High | Highest |
| **Cal.com Configuration** | 1 event type | 1 event type | 3 event types |

---

## Recommendation

**Start with Concept 1 (Embedded Calendar)**, then add Concept 2 elements (popup triggers) as enhancement.

### Rationale

1. **Lower risk** — Concept 1 delivers core value with least complexity
2. **Iterative path** — Concept 2 builds on Concept 1, not a rewrite
3. **Quick wins first** — Footer contact info and Pay at Studio messaging work in all concepts
4. **Validate first** — See if clients use the embedded booking before adding popups

### Suggested Phasing

```
Phase 1: Foundation (Day 1)
├── Update Footer with phone + email
├── Add "Pay at Studio" messaging
└── Simplify or replace current form

Phase 2: Concept 1 (Day 2-3)
├── Set up cal.com account and event type
├── Implement inline embed on /book
├── Style to match Kizmet brand

Phase 3: Concept 2 Elements (Day 4+, optional)
├── Add popup trigger to Hero CTA
├── Add popup trigger to CTA section
└── Consider floating button
```

---

## Open Questions

1. **Cal.com account** — Does one exist? What username?
2. **Business hours** — What hours should show as available?
3. **Buffer time** — Time between appointments?
4. **Confirmation flow** — Email only, or SMS too?

---

## Files in This Concept Package

- `booking-concept-1-embedded.html` — Embedded calendar on /book page
- `booking-concept-2-hybrid.html` — Popup triggers throughout site
- `booking-concept-3-full-integration.html` — Service-specific booking
- `booking-overview.md` — This comparison document

---

*Concepts created January 14, 2026*
