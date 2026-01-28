# Hero Video Playback Speed Setting

This document explores adding a configurable playback speed for the hero background video, managed through Sanity CMS.

---

## Current Implementation

The video playback rate is currently **hardcoded to 0.125 (8x slower)** in the Hero component.

**File:** `src/components/Hero.tsx`

```tsx
// Set video playback rate to 8x slower (0.125)
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.125;
  }
}, [showVideo]);
```

---

## What Would Need to Be Undone/Modified

To implement a configurable playback speed, we need to modify:

| File | Current State | Change Required |
|------|---------------|-----------------|
| `src/sanity/schemaTypes/homepageSettings.ts` | No speed field | Add `heroVideoSpeed` field |
| `src/components/Hero.tsx` | Hardcoded `0.125` | Use `data?.heroVideoSpeed` with fallback |

### Code to Remove/Replace

**In `src/components/Hero.tsx` (lines ~63-68):**

```tsx
// REMOVE THIS:
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.125;
  }
}, [showVideo]);

// REPLACE WITH:
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = data?.heroVideoSpeed ?? 0.125;
  }
}, [showVideo, data?.heroVideoSpeed]);
```

---

## Proposed Schema Addition

### Option A: Dropdown with Presets (Recommended)

Simpler for editors, clear labels explaining what each option means.

```typescript
defineField({
  name: 'heroVideoSpeed',
  title: 'Video Playback Speed',
  type: 'string',
  fieldset: 'hero',
  options: {
    list: [
      { title: '32x Slower (very slow motion)', value: '0.03125' },
      { title: '16x Slower', value: '0.0625' },
      { title: '8x Slower', value: '0.125' },
      { title: '4x Slower', value: '0.25' },
      { title: '2x Slower (half speed)', value: '0.5' },
      { title: 'Normal Speed', value: '1' },
    ],
    layout: 'dropdown'
  },
  initialValue: '0.125',
  description: 'Controls how slow the background video plays. Slower speeds create a more ambient, calming effect.',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})
```

**Note:** Values stored as strings, parsed to float in component.

### Option B: Numeric Slider

More flexibility, but harder for editors to understand the scale.

```typescript
defineField({
  name: 'heroVideoSpeed',
  title: 'Video Playback Speed',
  type: 'number',
  fieldset: 'hero',
  options: {
    // Sanity doesn't have a native slider, would need custom input component
  },
  validation: (Rule) => Rule.min(0.03125).max(1),
  initialValue: 0.125,
  description: 'Speed multiplier: 0.03125 = 32x slower, 0.5 = half speed, 1 = normal',
  hidden: ({ parent }) => parent?.heroMediaType !== 'video'
})
```

**Downside:** Requires custom input component for a good slider UX.

---

## Component Changes

### Update TypeScript Interface

```typescript
interface HeroProps {
  data?: {
    // ... existing fields
    heroVideoSpeed?: string; // Option A (dropdown)
    // OR
    heroVideoSpeed?: number; // Option B (slider)
  };
}
```

### Update useEffect

**For Option A (string values):**

```typescript
useEffect(() => {
  if (videoRef.current) {
    const speed = data?.heroVideoSpeed ? parseFloat(data.heroVideoSpeed) : 0.125;
    videoRef.current.playbackRate = speed;
  }
}, [showVideo, data?.heroVideoSpeed]);
```

**For Option B (numeric values):**

```typescript
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = data?.heroVideoSpeed ?? 0.125;
  }
}, [showVideo, data?.heroVideoSpeed]);
```

---

## Browser Considerations

### Minimum Playback Rate

Different browsers have different minimum `playbackRate` values:

| Browser | Minimum Rate | Notes |
|---------|--------------|-------|
| Chrome | 0.0625 | May vary by version |
| Firefox | 0.25 | More restrictive |
| Safari | 0.5 | Most restrictive |
| Edge | 0.0625 | Chromium-based |

**Recommendation:** Test 32x slower (0.03125) in Safari. If it doesn't work, the browser will likely clamp to its minimum supported rate. Consider adding a note in Sanity that very slow speeds may not work in all browsers.

### Fallback Strategy

```typescript
useEffect(() => {
  if (videoRef.current) {
    const speed = data?.heroVideoSpeed ? parseFloat(data.heroVideoSpeed) : 0.125;
    try {
      videoRef.current.playbackRate = speed;
    } catch {
      // Browser doesn't support this rate, use fallback
      videoRef.current.playbackRate = 0.5;
    }
  }
}, [showVideo, data?.heroVideoSpeed]);
```

---

## Playback Rate Reference

| Label | Value | Effect |
|-------|-------|--------|
| 32x Slower | 0.03125 | 1 second of video takes 32 seconds |
| 16x Slower | 0.0625 | 1 second of video takes 16 seconds |
| 8x Slower | 0.125 | 1 second of video takes 8 seconds |
| 4x Slower | 0.25 | 1 second of video takes 4 seconds |
| 2x Slower | 0.5 | 1 second of video takes 2 seconds |
| Normal | 1.0 | Real-time playback |

---

## Implementation Steps

1. **Update Sanity Schema** (`src/sanity/schemaTypes/homepageSettings.ts`)
   - Add `heroVideoSpeed` field after `heroVideoPoster`
   - Use dropdown with preset values (Option A)

2. **Update Hero Component** (`src/components/Hero.tsx`)
   - Add `heroVideoSpeed` to interface
   - Modify useEffect to use the value from Sanity
   - Add fallback for undefined/invalid values

3. **Test**
   - Verify dropdown appears in Sanity Studio when video mode selected
   - Test each speed option in Chrome, Firefox, Safari
   - Verify fallback works when no speed is set

---

## Rollback Instructions

If this feature causes issues:

### Quick Rollback (Content Only)
1. In Sanity Studio, set speed to "8x Slower" (or leave unset)
2. No code changes needed

### Full Rollback (Remove Feature)

1. **Revert Hero component** to hardcoded value:
   ```tsx
   useEffect(() => {
     if (videoRef.current) {
       videoRef.current.playbackRate = 0.125;
     }
   }, [showVideo]);
   ```

2. **Remove schema field** (optional - field will just be ignored):
   - Delete `heroVideoSpeed` field from `homepageSettings.ts`

3. **Remove from interface** (optional):
   - Delete `heroVideoSpeed?: string;` from HeroProps

---

## Recommendation

Use **Option A (Dropdown with Presets)** because:
- Clear, human-readable labels
- No custom components needed
- Prevents invalid values
- Easy for content editors to understand

Start with the 6 preset values listed above. If more granularity is needed later, add intermediate values to the dropdown.
