# Hero Background Video Exploration

This document explores adding an optional background video to the homepage hero section, managed through Sanity CMS.

## Current Implementation

**Hero Component** (`src/components/Hero.tsx`):
- Receives `heroImage` from Sanity via props
- Uses `getHeroImageUrl()` to generate optimized 1920x1080 URLs
- Falls back to local `/src/assets/hero-spa.jpg` if no Sanity image
- Background applied via CSS with semi-transparent overlay for text contrast

**Sanity Schema** (`src/sanity/schemaTypes/homepageSettings.ts`):
- `heroImage` field with hotspot enabled
- All hero fields grouped in a `hero` fieldset

---

## Proposed Feature

Add a toggle in Sanity to choose between a background image or a looping silent video (ambient/idle motion). The video would be relatively large on desktop to fill the hero area.

### Use Case
- Short, silent ambient video (e.g., spa atmosphere, gentle movement)
- Loops continuously as background
- Enhances visual appeal without audio distraction

---

## Hosting Tradeoffs: Sanity vs External

### Option A: Sanity File Upload

**Pros:**
- Single source of truth - all content in one CMS
- Simple editorial workflow - upload directly in Sanity Studio
- Automatic CDN delivery via Sanity's asset pipeline
- No additional service accounts or costs to manage
- Version history included with Sanity

**Cons:**
- File size limits (~200MB on most plans, but check your tier)
- No video-specific optimizations (transcoding, adaptive bitrate)
- No automatic format conversion (must upload correct format)
- Bandwidth counts against Sanity plan limits
- No built-in video compression or quality variants

**Best for:** Small to medium videos (<20MB), simple workflows, when you want everything in one place.

---

### Option B: External Video Hosting

**External Options:** Cloudinary, Mux, Bunny.net, AWS S3 + CloudFront, Vimeo (background mode)

**Pros:**
- Higher file size limits (often unlimited with paid plans)
- Automatic transcoding to multiple formats (MP4, WebM, HLS)
- Adaptive bitrate streaming for different connection speeds
- Video-specific CDN optimizations
- Can generate poster images automatically
- Better compression algorithms designed for video
- Detailed analytics on video performance

**Cons:**
- Additional service to manage and pay for
- Editorial workflow split between Sanity and video host
- Need to copy/paste URLs into Sanity fields
- Another vendor dependency
- More complex setup initially

**Best for:** Larger videos (>20MB), when you need quality variants for different devices, high-traffic sites where video bandwidth matters.

---

### Recommendation for This Project

**Start with Sanity hosting** if:
- Video is under 15-20MB compressed
- You want the simplest editorial experience
- Traffic is moderate

**Consider external hosting** if:
- Video exceeds 20MB even after compression
- You want to serve different quality levels (mobile vs desktop)
- You anticipate high traffic and want to optimize bandwidth costs

For a short ambient loop, a well-compressed 10-15 second MP4 at 1920x1080 can often fit under 10MB, making Sanity hosting viable.

---

## Video Compression Guidelines

For silent ambient background video:

| Setting | Recommendation |
|---------|----------------|
| **Duration** | 5-15 seconds (loops seamlessly) |
| **Resolution** | 1920x1080 (match hero dimensions) |
| **Codec** | H.264 (MP4) for compatibility |
| **Frame rate** | 24-30fps |
| **Bitrate** | 2-4 Mbps for good quality |
| **Target size** | Under 15MB ideally |

**Tools for compression:**
- HandBrake (free, desktop)
- FFmpeg (command line)
- Cloudinary (if using external hosting)

---

## Implementation Approach

### Schema Changes (`src/sanity/schemaTypes/homepageSettings.ts`)

```typescript
// Media type selector
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
  initialValue: 'image'
})

// Option A: Sanity-hosted video
defineField({
  name: 'heroVideo',
  title: 'Hero Background Video',
  type: 'file',
  fieldset: 'hero',
  options: { accept: 'video/mp4,video/webm' },
  description: 'Short looping video, ideally under 15MB. Will be muted.',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})

// Option B: External video URL (alternative approach)
defineField({
  name: 'heroVideoUrl',
  title: 'Video URL',
  type: 'url',
  fieldset: 'hero',
  description: 'Direct URL to MP4 file (Cloudinary, S3, etc.)',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})

// Poster image (thumbnail while video loads)
defineField({
  name: 'heroVideoPoster',
  title: 'Video Poster Image',
  type: 'image',
  fieldset: 'hero',
  options: { hotspot: true },
  description: 'Shown while video loads. Falls back to hero image if not set.',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})
```

### Component Changes (`src/components/Hero.tsx`)

```tsx
// Video URL resolution
const getVideoUrl = () => {
  if (data?.heroVideoUrl) return data.heroVideoUrl;
  if (data?.heroVideo?.asset?._ref) {
    // Sanity file URL construction
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${data.heroVideo.asset._ref.replace('file-', '').replace('-mp4', '.mp4')}`;
  }
  return null;
};

// Poster image (fallback chain: videoPoster -> heroImage -> local asset)
const posterUrl = data?.heroVideoPoster
  ? getHeroImageUrl(data.heroVideoPoster, 1920, 1080)
  : backgroundImage;

// Conditional rendering
{data?.heroMediaType === 'video' && getVideoUrl() ? (
  <video
    autoPlay
    muted
    loop
    playsInline
    poster={posterUrl}
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src={getVideoUrl()} type="video/mp4" />
  </video>
) : (
  // Existing image background
)}
```

### Query Changes (`src/sanity/lib/queries.ts`)

```groq
*[_type == "homepageSettings"][0] {
  ...,
  heroVideo {
    asset-> { _id, url }
  },
  heroVideoPoster {
    asset-> { _id, url },
    hotspot,
    crop
  },
  // ... rest of query
}
```

---

## Accessibility & Performance

### Reduced Motion Support

Respect user preferences for reduced motion:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Show poster image instead of video if user prefers reduced motion
{!prefersReducedMotion && data?.heroMediaType === 'video' ? (
  <video ... />
) : (
  <div style={{ backgroundImage }} ... />
)}
```

### Mobile Considerations

Options for mobile devices:
1. **Show video everywhere** - Works, but uses more data
2. **Image on mobile, video on desktop** - Better for performance
3. **Lower quality video on mobile** - Requires external hosting with variants

Simple mobile fallback:

```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const showVideo = !isMobile && data?.heroMediaType === 'video';
```

### Loading Strategy

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster={posterUrl}      // Shows immediately while video loads
  preload="auto"          // Start loading video right away (hero is above fold)
>
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/sanity/schemaTypes/homepageSettings.ts` | Add media type toggle, video field, poster field |
| `src/sanity/lib/queries.ts` | Project video asset in homepage query |
| `src/components/Hero.tsx` | Conditional video/image rendering |
| `src/sanity/lib/image.ts` | Optional: Add video URL helper function |

---

## Open Questions

1. **Mobile behavior:** Show video on mobile or fall back to image?
2. **Hosting choice:** Start with Sanity or go directly to external?
3. **Poster image:** Require one, or auto-fall back to heroImage?
4. **Reduced motion:** Pause video or show image entirely?
