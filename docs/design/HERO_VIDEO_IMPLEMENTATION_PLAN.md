# Hero Background Video Implementation Plan

This document outlines the step-by-step implementation for adding optional background video support to the homepage hero, using Sanity-hosted files.

---

## Overview

**Goal:** Allow content editors to choose between a background image or a looping silent video for the homepage hero, managed entirely through Sanity CMS.

**Approach:** Sanity file upload for video hosting (simple workflow, single CMS).

---

## Prerequisites

- [ ] Prepare a test video file (MP4, H.264, under 15MB, 1920x1080, 10-15 seconds)
- [ ] Verify Sanity plan file size limits are sufficient

---

## Step 1: Update Sanity Schema

**File:** `src/sanity/schemaTypes/homepageSettings.ts`

### 1.1 Add Media Type Selector

Add a radio button field to toggle between image and video:

```typescript
defineField({
  name: 'heroMediaType',
  title: 'Background Media Type',
  type: 'string',
  fieldset: 'hero',
  options: {
    list: [
      { title: 'Image', value: 'image' },
      { title: 'Video', value: 'video' }
    ],
    layout: 'radio'
  },
  initialValue: 'image',
  description: 'Choose whether to display a static image or looping video background.'
})
```

### 1.2 Add Video File Field

Add a file upload field for the video, conditionally visible:

```typescript
defineField({
  name: 'heroVideo',
  title: 'Hero Background Video',
  type: 'file',
  fieldset: 'hero',
  options: {
    accept: 'video/mp4,video/webm'
  },
  description: 'Upload a short looping video (MP4 recommended, under 15MB). Video will be muted and loop automatically.',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})
```

### 1.3 Add Video Poster Image Field

Add an optional poster image shown while video loads:

```typescript
defineField({
  name: 'heroVideoPoster',
  title: 'Video Poster Image',
  type: 'image',
  fieldset: 'hero',
  options: {
    hotspot: true
  },
  description: 'Optional. Shown while video loads. If not set, falls back to the Hero Background Image.',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})
```

### 1.4 Field Order

Insert the new fields after `heroImage` in this order:
1. `heroImage` (existing)
2. `heroMediaType` (new)
3. `heroVideo` (new)
4. `heroVideoPoster` (new)
5. `heroHeadline` (existing)
6. ... rest of hero fields

---

## Step 2: Update Sanity Query

**File:** `src/sanity/lib/queries.ts`

### 2.1 Expand Homepage Query

Update `HOMEPAGE_SETTINGS_QUERY` to include video fields with asset projection:

```groq
export const HOMEPAGE_SETTINGS_QUERY = `*[_type == "homepageSettings"][0] {
  ...,
  heroImage {
    asset-> { _id, url },
    hotspot,
    crop
  },
  heroVideo {
    asset-> { _id, url, mimeType }
  },
  heroVideoPoster {
    asset-> { _id, url },
    hotspot,
    crop
  },
  aboutPreviewImage {
    asset-> { _id, url },
    hotspot,
    crop
  },
  seo {
    metaTitle,
    metaDescription,
    ogImage {
      asset-> { _id, url },
      hotspot,
      crop
    },
    noIndex
  }
}`;
```

---

## Step 3: Add Video URL Helper

**File:** `src/sanity/lib/image.ts`

### 3.1 Add Video URL Function

Add a helper function to extract the video URL from a Sanity file reference:

```typescript
/**
 * Get URL for a Sanity-hosted video file
 */
export function getVideoUrl(file: { asset?: { url?: string } } | null | undefined): string | null {
  return file?.asset?.url ?? null;
}
```

---

## Step 4: Update Hero Component

**File:** `src/components/Hero.tsx`

### 4.1 Update TypeScript Interface

Extend the data prop interface:

```typescript
interface HeroProps {
  data?: {
    heroHeadline?: string;
    heroSubheadline?: string;
    heroCta?: string;
    heroCtaLink?: string;
    heroSecondaryCta?: string;
    heroSecondaryCtaLink?: string;
    heroImage?: SanityImageSource;
    heroMediaType?: 'image' | 'video';
    heroVideo?: {
      asset?: {
        _id?: string;
        url?: string;
        mimeType?: string;
      };
    };
    heroVideoPoster?: SanityImageSource;
  };
}
```

### 4.2 Add Video URL Resolution

Inside the component, add logic to get video and poster URLs:

```typescript
import { getHeroImageUrl, getVideoUrl } from '@/sanity/lib/image';

// Existing background image logic
const backgroundImage = data?.heroImage
  ? getHeroImageUrl(data.heroImage, 1920, 1080)
  : heroImage.src;

// Video URL (from Sanity asset)
const videoUrl = getVideoUrl(data?.heroVideo);

// Poster image: videoPoster -> heroImage -> local fallback
const posterUrl = data?.heroVideoPoster
  ? getHeroImageUrl(data.heroVideoPoster, 1920, 1080)
  : backgroundImage;

// Determine if we should show video
const showVideo = data?.heroMediaType === 'video' && videoUrl;
```

### 4.3 Add Reduced Motion Hook

Create a hook or inline check for accessibility:

```typescript
'use client';

import { useEffect, useState } from 'react';

// Inside component:
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);

  const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, []);
```

### 4.4 Update JSX Rendering

Replace the background div with conditional rendering:

```tsx
{/* Background media layer */}
<div className="absolute inset-0 -z-10">
  {showVideo && !prefersReducedMotion ? (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={posterUrl}
      className="h-full w-full object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
      {/* Fallback for browsers that don't support video */}
      <img src={posterUrl} alt="" className="h-full w-full object-cover" />
    </video>
  ) : (
    <div
      className="h-full w-full bg-top bg-no-repeat bg-[length:auto_130%] md:bg-[length:135%]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  )}

  {/* Overlay for text contrast */}
  <div className="absolute inset-0 bg-background/60" />

  {/* Bottom gradient fade */}
  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
</div>
```

---

## Step 5: TypeScript Types (Optional)

**File:** `src/sanity/types.ts` (create if needed)

Define reusable types for Sanity assets:

```typescript
export interface SanityFileAsset {
  asset?: {
    _id?: string;
    url?: string;
    mimeType?: string;
  };
}

export interface SanityImageAsset {
  asset?: {
    _id?: string;
    url?: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
```

---

## Step 6: Testing Checklist

### 6.1 Sanity Studio
- [ ] Media type toggle appears in Homepage settings
- [ ] Selecting "Video" reveals video upload and poster fields
- [ ] Selecting "Image" hides video fields
- [ ] Video file uploads successfully
- [ ] Poster image uploads with hotspot editor

### 6.2 Frontend - Video Mode
- [ ] Video displays full-width in hero
- [ ] Video autoplays on page load
- [ ] Video is muted (no audio)
- [ ] Video loops continuously
- [ ] Poster image shows while video loads
- [ ] Overlay maintains text readability
- [ ] Bottom gradient fade renders correctly

### 6.3 Frontend - Image Mode
- [ ] Existing image background still works
- [ ] No video element rendered when image mode selected
- [ ] Fallback to local asset works when no Sanity image

### 6.4 Accessibility
- [ ] Video pauses/shows image when `prefers-reduced-motion` is enabled
- [ ] Test in browser with reduced motion setting enabled

### 6.5 Mobile
- [ ] Video plays on iOS Safari (requires `playsInline`)
- [ ] Video plays on Android Chrome
- [ ] Performance acceptable on mobile connection

### 6.6 Edge Cases
- [ ] No video uploaded but video mode selected → falls back to image
- [ ] No poster and no hero image → falls back to local asset
- [ ] Large video file → verify Sanity accepts it

---

## File Summary

| File | Action | Changes |
|------|--------|---------|
| `src/sanity/schemaTypes/homepageSettings.ts` | Edit | Add 3 fields: `heroMediaType`, `heroVideo`, `heroVideoPoster` |
| `src/sanity/lib/queries.ts` | Edit | Expand query to project video and poster assets |
| `src/sanity/lib/image.ts` | Edit | Add `getVideoUrl()` helper function |
| `src/components/Hero.tsx` | Edit | Add video rendering, reduced motion support |
| `src/sanity/types.ts` | Create (optional) | Add shared TypeScript types |

---

## Rollback Plan

If issues arise after deployment:

1. In Sanity Studio, set `heroMediaType` back to "Image"
2. Site immediately falls back to image background
3. No code deployment needed for content rollback

---

## Future Enhancements (Out of Scope)

- Mobile-specific video (lower resolution)
- WebM format support for better compression
- Video preview in Sanity Studio
- Multiple video sources for format fallback
- External video URL field as alternative to upload
