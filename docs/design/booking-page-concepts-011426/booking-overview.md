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

| Criteria | Concept 1 | Concept 2 | Concept 3 | Concept 4 |
|----------|-----------|-----------|-----------|-----------|
| **User Experience** | Good | Better | Best | Best |
| **Implementation Effort** | Medium | Medium-High | High | Medium-High |
| **Maintenance Complexity** | Low | Medium | Medium | Low-Medium |
| **Booking Accessibility** | /book page only | Any page | Services + /book | Services + /book |
| **Service Pre-selection** | In embed | In embed | Pre-selected | URL param |
| **Brand Consistency** | High | High | Highest | Highest |
| **Cal.com Configuration** | 1 event type | 1 event type | 3 event types | 1 event type |
| **Mobile UX** | Good | Modal (crowded) | Good | Best (full page) |

---

## Concept 4: Refined Flow (Recommended)

**File:** [booking-concept-4-refined.html](./booking-concept-4-refined.html)

**Approach:** Best of Concepts 1-3: embedded calendar on /book page, service pre-selection via URL params from Services page, full page (not popup) for better mobile UX.

### Key Design Decisions

| Element | Decision | Rationale |
|---------|----------|-----------|
| Booking location | Full /book page | Better mobile UX than popup |
| Service selection | URL param (?service=60) | Pre-selects in embed, user can change |
| Pay at Studio | Single-line banner | Visible without overwhelming |
| Contact info | Inline below embed | Easy access without sidebar clutter |
| Policies | Compact preview | Key info with link to full page |

### Strengths
- Best mobile experience (full page, not cramped popup)
- Service pre-selection without 3 separate cal.com events
- Simplified "Pay at Studio" messaging
- Policies preview reduces friction
- Single cal.com event type to maintain

### Tradeoffs
- User must navigate to /book (like Concept 1)
- No floating button (could add later)

---

## Recommendation

**Implement Concept 4 (Refined Flow)** as the primary approach.

See [booking-implementation-plan.md](./booking-implementation-plan.md) for technical details.

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
- `booking-concept-4-refined.html` — **Recommended:** Refined flow with service pre-selection
- `booking-overview.md` — This comparison document
- `booking-implementation-plan.md` — Technical implementation guide

---

*Concepts created January 14, 2026*
