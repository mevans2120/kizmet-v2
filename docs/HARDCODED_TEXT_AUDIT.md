# Hardcoded Text Audit

This document identifies all user-facing hardcoded text in the site that lacks CMS (Sanity) options.

**Audit Date:** January 2026

---

## Summary

| Page/Component | Hardcoded Items | Severity |
|----------------|-----------------|----------|
| Navigation | 5 items | Medium |
| Footer | 12 items | Medium |
| Hero | 6 items | Low (has CMS fallbacks) |
| Services Preview | 5 items | Low (has CMS fallbacks) |
| About Preview | 5 items | Low (has CMS fallbacks) |
| Testimonials | 3 items | Low (has CMS fallbacks) |
| CTA Section | 3 items | Low (has CMS fallbacks) |
| About Page | 20+ items | High |
| Services Page | 30+ items | High |
| Book Page | 15 items | Medium |
| Policies Page | 25+ items | High |
| 404 Page | 3 items | Low |

---

## Global Components

### Navigation (`src/components/Navigation.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 20 | `"Kizmet"` | Brand name (has CMS fallback) |
| 21 | `"Massage and Wellness"` | Tagline (has CMS fallback) |
| 24 | `"About"` | Nav link label - no CMS option |
| 25 | `"What to Know"` | Nav link label - no CMS option |
| 26 | `"Services"` | Nav link label - no CMS option |

### Footer (`src/components/Footer.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 21 | `"Kizmet"` | Brand name fallback |
| 22 | `"Nurturing your body and mind through the healing power of touch."` | Brand description fallback |
| 23 | `"Destiny"` | Therapist name fallback |
| 42 | `"Quick Links"` | Section heading - no CMS option |
| 43-46 | `"About"`, `"Services"`, `"Book Appointment"`, `"What to Know"` | Link labels - no CMS option |
| 63 | `"Location"` | Section heading - no CMS option |
| 66-67 | `"105 1/2 E 1st St"`, `"Port Angeles"`, `"WA"` | Address fallback |
| 72-73 | `"Your Therapist"` | Section heading - no CMS option |
| 83 | `"© {year} Kizmet Massage. All rights reserved."` | Copyright - no CMS option |

---

## Home Page

### Hero (`src/components/Hero.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 39 | `"Kizmet"` | Headline fallback |
| 40 | `"Destiny Pugh offers therapeutic massage in Port Angeles..."` | Subheadline fallback |
| 41 | `"Book Your Session"` | Primary CTA fallback |
| 43 | `"View Services"` | Secondary CTA fallback |
| 94-97 | `"Kizmet"`, `"Massage"` | Hardcoded in JSX (not using headline variable) |

### Services Preview (`src/components/ServicesPreview.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 49 | `"Signature Services"` | Heading fallback |
| 50 | `"Each session is tailored to your individual needs"` | Description fallback |
| 56 | `"OFFERINGS"` | Eyebrow - no CMS option |
| 90 | `"Book"` | Card button label - no CMS option |
| 100 | `"Learn More"` | CTA button - no CMS option |

### About Preview (`src/components/AboutPreview.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 22 | `"Meet Your Therapist"` | Eyebrow fallback |
| 23 | `"In my family, healing was never something you learned..."` | Quote fallback |
| 25 | `"Destiny"` | Attribution name fallback |
| 26 | `"Third-Generation Healer"` | Attribution title fallback |
| 27 | `"Read My Story"` | CTA button fallback |

### Testimonials (`src/components/Testimonials.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 29 | `"Kind Words"` | Eyebrow fallback |
| 30 | `"What Clients Say"` | Title fallback |
| 31 | `"Real experiences from people who've found relief..."` | Subtitle fallback |

### CTA Section (`src/components/CTASection.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 14 | `"It's Time to Feel Good"` | Headline fallback |
| 15 | `"Book your first session today..."` | Description fallback |
| 17 | `"Book Your Appointment"` | Button text fallback |

---

## About Page (`src/page-content/About.tsx`)

**High Priority - Extensive hardcoded content with fallbacks**

### Hero Section (Lines 40-45)
- `"About Destiny"` - eyebrow
- `"Healing Hands, Open Heart"` - headline
- Full intro paragraph (2 sentences)

### Quote Section (Lines 45-46)
- Full quote: `"In my family, healing was never something you learned from a textbook..."`
- Attribution: `"Destiny, Founder of Kizmet"`

### Bio Section (Lines 49-61)
- `"My Roots"` - section title
- 5 credential items (LMT, Third-Generation Healer, Deep Tissue, Swedish, Prenatal)
- 3 full bio paragraphs about family healing background, formal training, and Kizmet's mission

### Session Journey Section (Lines 64-70)
- `"What a Session Looks Like"` - section title
- Intro paragraph
- 3 journey steps with titles and descriptions:
  - "We Connect" + description
  - "We Work" + description
  - "You Leave Transformed" + description

### CTA Section (Lines 73-74)
- `"Ready to Begin Your Journey?"` - headline
- `"Book Your Session"` - button text

---

## Services Page (`src/page-content/Services.tsx`)

**High Priority - Service details and descriptions**

### Page Header (Lines 74-82)
- `"What I Offer"` - eyebrow
- `"Services & Pricing"` - page title
- Full description paragraph
- `"Massage Sessions"` - section title
- `"Book"` - button text
- `"Ready to Feel Your Best?"` - CTA heading
- `"Not sure which session length is right for you?..."` - CTA description
- `"Book Your Session"` - CTA button

### Service Entries (Lines 40-68)

**30-Minute Session:**
- Title: `"30 Minute Session"`
- Duration: `"30 min"`
- Price: `"$60"`
- Full description + extended description
- 3 techniques
- 3 "best for" categories

**60-Minute Session:**
- Title: `"60 Minute Session"`
- Duration: `"60 min"`
- Price: `"$100"`
- Full description + extended description
- 4 techniques
- 4 "best for" categories

**90-Minute Session:**
- Title: `"90 Minute Session"`
- Duration: `"90 min"`
- Price: `"$145"`
- Full description + extended description
- 4 techniques
- 4 "best for" categories

### UI Labels (Lines 141, 154)
- `"Techniques"` - section label
- `"Best For"` - section label

---

## Book Page (`src/page-content/Book.tsx`)

### Page Header (Lines 73-75)
- `"Schedule Your Visit"` - eyebrow fallback
- `"Book an Appointment"` - headline fallback
- `"Select your service and choose a time..."` - description fallback

### UI Elements
| Line | Text | Notes |
|------|------|-------|
| 96 | `"Online booking is coming soon..."` | No services message |
| 142 | `"Select your session:"` | Form label - no CMS option |
| 185 | `"Call"` | Contact section label - no CMS option |
| 199 | `"Email"` | Contact section label - no CMS option |
| 210 | `"Location"` | Contact section label - no CMS option |
| 224 | `"Before Your Visit"` | Section heading - no CMS option |
| 230 | `"View All Policies"` | Link text - no CMS option |

### Policy Preview Items (Lines 237-260) - No CMS option
| Policy | Text |
|--------|------|
| Cancellation | `"24 hours notice required. Late cancellations subject to 50% fee."` |
| Arrival | `"Please arrive 5 minutes early. New clients: 10-15 minutes for paperwork."` |
| Payment | `"Payment due at time of service. Cash, card, and mobile payments accepted."` |

---

## Policies Page (`src/page-content/Policies.tsx`)

**High Priority - All policy content is hardcoded**

### Page Header (Lines 76-77)
- `"Policies"` - page title fallback
- `"I appreciate your understanding and cooperation..."` - description fallback

### Section Label (Line 89)
- `"Important Information"` - eyebrow, no CMS option

### Policy Sections (Lines 23-73)

**Appointment Policy (3 items):**
- Booking process
- Required info
- Confirmation

**Cancellation Policy (4 items):**
- 24-hour notice requirement
- Late cancellation fee
- No-show fee
- Emergency exceptions

**Late Arrival Policy (3 items):**
- Session time impact
- Rescheduling option
- Full charge notice

**Payment Policy (3 items):**
- Payment timing
- Accepted methods
- Tipping policy

**Health & Safety (3 items):**
- Health disclosure
- Contraindications
- Illness policy

**Draping Policy (3 items):**
- Professional standards
- Client comfort
- Communication

### Questions Section (Lines 133-145)
- `"Questions?"` - heading
- `"If you have any questions about our policies..."` - description
- `"hello@kizmetwellness.com"` - fallback email
- `"(555) 123-4567"` - fallback phone

---

## 404 Page (`src/app/not-found.tsx`)

| Line | Text | Notes |
|------|------|-------|
| 11 | `"404"` | Page heading - no CMS option |
| 13 | `"Page not found"` | Error message - no CMS option |
| 19 | `"Return Home"` | Button text - no CMS option |

---

## Recommendations

### High Priority (Create CMS schemas)
1. **About Page Content** - Create `aboutPageSettings` schema for hero, quote, bio, and journey sections
2. **Services Page Content** - Ensure services schema includes all description fields, techniques, and "best for" categories
3. **Policies Page Content** - Create `policiesPageSettings` schema for all policy sections

### Medium Priority (Add CMS fields)
4. **Navigation Labels** - Add to site settings schema
5. **Footer Content** - Add section headings and copyright text to site settings
6. **Book Page** - Add policy preview items and UI labels to booking settings

### Low Priority (Nice to have)
7. **404 Page** - Add error page content to site settings
8. **UI Labels** - Create a `uiStrings` schema for reusable labels like "Book", "Learn More", etc.

---

## Notes

- Items marked "fallback" have corresponding CMS fields but use hardcoded defaults when CMS data is missing
- Items marked "no CMS option" have no corresponding Sanity schema field
- The severity is based on how often content editors might need to change the text
