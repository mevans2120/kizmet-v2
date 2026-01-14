# Plan: Sanity CMS Integration — Kizmet Massage & Wellness

**Date:** 2026-01-14
**Tags:** cms, sanity, content-management, infrastructure

---

## Objective

Integrate Sanity CMS to enable non-technical content management for the Kizmet website. The business owner should be able to update text, images, services, and policies without developer involvement.

---

## Background

Currently, all content is hardcoded in React components. While the `About.tsx` component demonstrates a Sanity-ready pattern (content as a data object), most other components have content inline. This integration will:

1. Create a Sanity project and studio
2. Define schemas matching current content structure
3. Migrate hardcoded content to Sanity
4. Update components to fetch from Sanity API

The Opal Creek v2 project provides a proven reference implementation.

---

## Requirements

### Must Have
- Sanity Studio accessible at `/studio`
- All page content editable in Sanity
- Services manageable as a collection (add/edit/reorder)
- Site settings (contact info, branding) in one place
- Images served from Sanity CDN

### Nice to Have
- Draft/preview mode for unpublished changes
- Visual editing (click-to-edit on live pages)
- Testimonials collection (future)
- Blog capability (future)

---

## Approach

**Minimal viable integration first.** Skip visual editing and draft mode initially—the owner can publish and check the live site. Add advanced features later if needed.

**Follow the About.tsx pattern:** Extract content to data objects, then swap the source from local object to Sanity fetch.

---

## Implementation Plan

### Phase 1: Project Setup
**Estimated time: 45 minutes**

#### 1.1 Create Sanity Project
- [ ] Go to [sanity.io/manage](https://sanity.io/manage)
- [ ] Create new project named "Kizmet Massage & Wellness"
- [ ] Select dataset name: `production`
- [ ] Note the Project ID for environment variables
- [ ] Create API token with "Editor" permissions

#### 1.2 Install Dependencies
- [ ] Run: `npm install sanity next-sanity @sanity/client @sanity/image-url @portabletext/react`
- [ ] Verify packages in `package.json`

#### 1.3 Environment Variables
- [ ] Create `.env.local` file (if not exists)
- [ ] Add `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] Add `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] Add `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`
- [ ] Add `SANITY_API_TOKEN` (for server-side fetching)
- [ ] Update `.env.example` with placeholder values
- [ ] Add `.env.local` to `.gitignore` (verify)

#### 1.4 Configuration Files
- [ ] Create `sanity.config.ts` in project root
  ```typescript
  import { defineConfig } from 'sanity'
  import { structureTool } from 'sanity/structure'
  import { schemaTypes } from './sanity/schemaTypes'
  import { deskStructure } from './sanity/deskStructure'

  export default defineConfig({
    name: 'kizmet',
    title: 'Kizmet Massage & Wellness',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    basePath: '/studio',
    plugins: [structureTool({ structure: deskStructure })],
    schema: { types: schemaTypes },
  })
  ```

- [ ] Create `sanity.cli.ts` in project root
  ```typescript
  import { defineCliConfig } from 'sanity/cli'

  export default defineCliConfig({
    api: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    },
  })
  ```

---

### Phase 2: Sanity Library Setup
**Estimated time: 30 minutes**

#### 2.1 Create Directory Structure
- [ ] Create `sanity/` directory in project root
- [ ] Create `sanity/lib/` directory
- [ ] Create `sanity/schemaTypes/` directory

#### 2.2 Sanity Client
- [ ] Create `sanity/lib/client.ts`
  ```typescript
  import { createClient } from '@sanity/client'

  export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
    useCdn: process.env.NODE_ENV === 'production',
    perspective: 'published',
  })
  ```

#### 2.3 Image URL Helper
- [ ] Create `sanity/lib/image.ts`
  ```typescript
  import imageUrlBuilder from '@sanity/image-url'
  import { client } from './client'

  const builder = imageUrlBuilder(client)

  export function urlFor(source: any) {
    return builder.image(source)
  }
  ```

#### 2.4 GROQ Queries
- [ ] Create `sanity/lib/queries.ts`
  ```typescript
  // Site-wide
  export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`
  export const FOOTER_SETTINGS_QUERY = `*[_type == "footerSettings"][0]`

  // Homepage
  export const HOMEPAGE_SETTINGS_QUERY = `*[_type == "homepageSettings"][0]`

  // Services
  export const ALL_SERVICES_QUERY = `*[_type == "service"] | order(order asc)`
  export const FEATURED_SERVICES_QUERY = `*[_type == "service" && featured == true] | order(order asc)`

  // Pages
  export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`
  export const POLICIES_PAGE_QUERY = `*[_type == "policiesPage"][0]`
  export const BOOK_PAGE_QUERY = `*[_type == "bookPage"][0]`
  ```

---

### Phase 3: Schema Development
**Estimated time: 2-3 hours**

#### 3.1 Site Settings Schema (Singleton)
- [ ] Create `sanity/schemaTypes/siteSettings.ts`
  - Fields: brandName, tagline, phone, email, address (object), bookingUrl, seo (object)
  - Add field descriptions for editor clarity
  - Add validation (required fields, URL format)

#### 3.2 Homepage Settings Schema (Singleton)
- [ ] Create `sanity/schemaTypes/homepageSettings.ts`
  - Hero section: heroImage, heroHeadline, heroSubheadline, heroCta
  - Services preview: servicesHeading, servicesDescription
  - CTA section: ctaHeadline, ctaDescription, ctaButtonText
  - Group fields into fieldsets for organization

#### 3.3 About Page Schema (Singleton)
- [ ] Create `sanity/schemaTypes/aboutPage.ts`
  - Hero: eyebrow, headline, intro, heroImage
  - Quote: quoteText, quoteAttribution
  - Bio: bioTitle, credentials (array), bioParagraphs (array)
  - Journey: journeyTitle, journeyIntro, journeySteps (array of objects)
  - CTA: ctaHeadline, ctaButtonText

#### 3.4 Policies Page Schema (Singleton)
- [ ] Create `sanity/schemaTypes/policiesPage.ts`
  - Header: pageTitle, pageDescription
  - Policies: array of { title, items (array of text) }
  - Contact: contactHeading, contactDescription

#### 3.5 Book Page Schema (Singleton)
- [ ] Create `sanity/schemaTypes/bookPage.ts`
  - Header: eyebrow, headline, description
  - Form labels (optional—could stay hardcoded)
  - Contact section: phoneNumber, phoneLabel

#### 3.6 Footer Settings Schema (Singleton)
- [ ] Create `sanity/schemaTypes/footerSettings.ts`
  - Brand section: brandDescription
  - Therapist: therapistName
  - Note: Links pull from siteSettings

#### 3.7 Service Schema (Collection)
- [ ] Create `sanity/schemaTypes/service.ts`
  - Fields: name, slug, duration, price, description, featured, order
  - Add slug generation from name
  - Add ordering configuration
  - Add preview configuration

#### 3.8 Schema Index & Desk Structure
- [ ] Create `sanity/schemaTypes/index.ts`
  ```typescript
  import siteSettings from './siteSettings'
  import homepageSettings from './homepageSettings'
  import aboutPage from './aboutPage'
  import policiesPage from './policiesPage'
  import bookPage from './bookPage'
  import footerSettings from './footerSettings'
  import service from './service'

  export const schemaTypes = [
    siteSettings,
    homepageSettings,
    aboutPage,
    policiesPage,
    bookPage,
    footerSettings,
    service,
  ]
  ```

- [ ] Create `sanity/deskStructure.ts`
  - Group singletons at top (Site Settings, Homepage, About, etc.)
  - Services collection below
  - Hide singletons from default document list

---

### Phase 4: Studio Integration
**Estimated time: 45 minutes**

#### 4.1 Embedded Studio Route
- [ ] Create `src/app/studio/[[...tool]]/page.tsx`
  ```typescript
  'use client'

  import { NextStudio } from 'next-sanity/studio'
  import config from '../../../../sanity.config'

  export default function StudioPage() {
    return <NextStudio config={config} />
  }
  ```

- [ ] Create `src/app/studio/[[...tool]]/layout.tsx`
  ```typescript
  export const metadata = {
    title: 'Kizmet CMS',
    robots: { index: false, follow: false },
  }

  export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return children
  }
  ```

#### 4.2 Verify Studio Access
- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/studio`
- [ ] Verify Sanity Studio loads
- [ ] Check all schema types appear in sidebar

#### 4.3 Deploy Schemas
- [ ] Run `npx sanity deploy` (optional—deploys hosted studio)
- [ ] Alternatively, use embedded studio only

---

### Phase 5: Content Migration
**Estimated time: 1-2 hours**

#### 5.1 Create Singleton Documents
- [ ] In Studio, create Site Settings document
  - Enter brand name: "Kizmet"
  - Enter tagline: "Massage and Wellness"
  - Enter contact info from Footer.tsx
  - Enter address from Footer.tsx

- [ ] Create Homepage Settings document
  - Copy hero content from Hero.tsx
  - Copy CTA content from CTASection.tsx
  - Upload hero image to Sanity

- [ ] Create About Page document
  - Copy all fields from `aboutContent` object in About.tsx
  - Upload about image (when available)

- [ ] Create Policies Page document
  - Copy all policies from `policies` array in Policies.tsx

- [ ] Create Book Page document
  - Copy header content from Book.tsx

- [ ] Create Footer Settings document
  - Copy description and therapist name

#### 5.2 Create Service Documents
- [ ] Create "30 Minute Session" service
  - Duration: "30 min"
  - Price: "$60"
  - Description from Services.tsx
  - Order: 1
  - Featured: true

- [ ] Create "60 Minute Session" service
  - Duration: "60 min"
  - Price: "$100"
  - Description from Services.tsx
  - Order: 2
  - Featured: true

- [ ] Create "90 Minute Session" service
  - Duration: "90 min"
  - Price: "$145"
  - Description from Services.tsx
  - Order: 3
  - Featured: true

#### 5.3 Verify Content
- [ ] Review all documents in Studio
- [ ] Check for typos or missing fields
- [ ] Verify image uploads display correctly

---

### Phase 6: Frontend Integration
**Estimated time: 3-4 hours**

#### 6.1 Update Homepage
- [ ] Update `src/app/page.tsx` to fetch from Sanity
  ```typescript
  import { client } from '@/sanity/lib/client'
  import { HOMEPAGE_SETTINGS_QUERY, FEATURED_SERVICES_QUERY } from '@/sanity/lib/queries'

  export default async function HomePage() {
    const [homepage, services] = await Promise.all([
      client.fetch(HOMEPAGE_SETTINGS_QUERY),
      client.fetch(FEATURED_SERVICES_QUERY),
    ])

    return (
      <>
        <Hero data={homepage} />
        <ServicesPreview services={services} />
        <CTASection data={homepage} />
      </>
    )
  }
  ```

- [ ] Update `Hero.tsx` to accept `data` prop
- [ ] Update `ServicesPreview.tsx` to accept `services` prop
- [ ] Update `CTASection.tsx` to accept `data` prop

#### 6.2 Update Services Page
- [ ] Update `src/app/services/page.tsx` to fetch services
- [ ] Update `Services.tsx` to accept `services` prop
- [ ] Remove hardcoded `allServices` array

#### 6.3 Update About Page
- [ ] Update `src/app/about/page.tsx` to fetch about content
- [ ] Update `About.tsx` to accept `data` prop instead of using `aboutContent`
- [ ] Remove hardcoded `aboutContent` object

#### 6.4 Update Policies Page
- [ ] Update `src/app/policies/page.tsx` to fetch policies
- [ ] Update `Policies.tsx` to accept `data` prop
- [ ] Remove hardcoded `policies` array

#### 6.5 Update Book Page
- [ ] Update `src/app/book/page.tsx` to fetch book page content + services
- [ ] Update `Book.tsx` to accept props
- [ ] Remove hardcoded `services` array

#### 6.6 Update Navigation
- [ ] Update `Navigation.tsx` to accept site settings
- [ ] Fetch site settings in layout or pass from page

#### 6.7 Update Footer
- [ ] Update `Footer.tsx` to accept footer settings + site settings
- [ ] Fetch in layout or pass from pages

#### 6.8 Image Handling
- [ ] Import `urlFor` helper where images are used
- [ ] Replace static image imports with Sanity image URLs
- [ ] Add width/quality optimization to image URLs
- [ ] Update `next.config.mjs` to allow Sanity CDN domain:
  ```javascript
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  ```

---

### Phase 7: Testing & Polish
**Estimated time: 1-2 hours**

#### 7.1 Functional Testing
- [ ] Test homepage loads with Sanity content
- [ ] Test services page displays all services
- [ ] Test about page displays all sections
- [ ] Test policies page displays all policies
- [ ] Test book page displays services dropdown
- [ ] Test navigation links work
- [ ] Test footer displays correct info

#### 7.2 Content Update Testing
- [ ] Change a headline in Sanity Studio
- [ ] Verify change appears on site (may need page refresh in dev)
- [ ] Add a new service in Sanity
- [ ] Verify new service appears on services page and book page

#### 7.3 Image Testing
- [ ] Verify hero image loads from Sanity CDN
- [ ] Verify images have correct dimensions
- [ ] Test image loading performance

#### 7.4 Error Handling
- [ ] Add null checks for optional Sanity fields
- [ ] Handle case where Sanity is unreachable (fallback content?)
- [ ] Verify build succeeds with `npm run build`

#### 7.5 Mobile Testing
- [ ] Test all pages on mobile viewport
- [ ] Verify images scale correctly
- [ ] Check content doesn't overflow

---

### Phase 8: Deployment
**Estimated time: 30 minutes**

#### 8.1 Environment Variables (Production)
- [ ] Add all Sanity env vars to hosting platform (Vercel, Netlify, etc.)
- [ ] Verify `NEXT_PUBLIC_` vars are accessible client-side
- [ ] Verify `SANITY_API_TOKEN` is server-only

#### 8.2 Deploy & Verify
- [ ] Deploy to production
- [ ] Verify Studio accessible at production URL `/studio`
- [ ] Test content updates flow to production site

#### 8.3 Documentation
- [ ] Document Studio access URL for client
- [ ] Create simple guide for common content updates
- [ ] Note any gotchas (CDN cache delay, etc.)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Sanity API rate limits | Low | Medium | Use CDN in production, cache responses |
| Content migration errors | Medium | Low | Review all content in Studio before going live |
| Image loading slow | Low | Medium | Use Sanity's image optimization, set width/quality |
| Schema changes after launch | Medium | Medium | Plan schema carefully upfront, use migrations |
| Studio access security | Low | High | Sanity has built-in auth; add custom auth if needed |

---

## Success Criteria

- [ ] All pages load content from Sanity (no hardcoded content in components)
- [ ] Business owner can log into Studio and edit content
- [ ] Content changes appear on live site within 2 minutes
- [ ] Services can be added/edited/reordered without code changes
- [ ] Build succeeds and no console errors
- [ ] Mobile experience unchanged from current site

---

## Open Questions

1. **Authentication:** Should Studio require login? (Sanity provides this by default)
2. **Booking System:** External link or keep current form? Affects bookPage schema.
3. **Future Content Types:** Blog, testimonials, FAQs planned? Design schemas now.
4. **CDN Caching:** Acceptable delay for content updates? (1-2 min default)

---

## Related Research

- [Sanity CMS Implementation Research](../research/RESEARCH_2026-01-14_sanity-cms-implementation.md) - Full technical research with schema examples and Opal Creek reference

---

## File Checklist

When complete, these files should exist:

```
Root:
├── sanity.config.ts
├── sanity.cli.ts

sanity/:
├── schemaTypes/
│   ├── index.ts
│   ├── siteSettings.ts
│   ├── homepageSettings.ts
│   ├── aboutPage.ts
│   ├── policiesPage.ts
│   ├── bookPage.ts
│   ├── footerSettings.ts
│   └── service.ts
├── lib/
│   ├── client.ts
│   ├── image.ts
│   └── queries.ts
└── deskStructure.ts

src/app/:
└── studio/
    └── [[...tool]]/
        ├── page.tsx
        └── layout.tsx
```

---

## Estimated Total Effort

| Phase | Time |
|-------|------|
| 1. Project Setup | 45 min |
| 2. Library Setup | 30 min |
| 3. Schema Development | 2-3 hrs |
| 4. Studio Integration | 45 min |
| 5. Content Migration | 1-2 hrs |
| 6. Frontend Integration | 3-4 hrs |
| 7. Testing & Polish | 1-2 hrs |
| 8. Deployment | 30 min |
| **Total** | **10-14 hours** |
