# Research: Open Maps CTA for Address Card

**Date:** 2026-01-30
**Status:** Exploration
**Location:** Book page contact section

## Current State

The location card on `/book` displays the address as static text:
- Shows: street, city (missing state/zip)
- Not clickable
- Uses `MapPin` icon from lucide-react

**Existing but unused Sanity fields:**
- `googleMapsUrl` - direct link to Google Maps listing
- `googlePlaceId` - for generating Google Maps place URLs
- `geoCoordinates` - latitude/longitude (currently only used for SEO structured data)

## Platform Behavior: Desktop vs Mobile

### Desktop Browsers

On desktop, map links open in a new browser tab:

| Link Type | Behavior |
|-----------|----------|
| Google Maps URL | Opens Google Maps website |
| Apple Maps URL | Redirects to Google Maps (no native app) |
| `maps:` protocol | Not supported, fails silently |
| `geo:` protocol | Not supported on most browsers |

**Best approach for desktop:** Use Google Maps web URL.

### Mobile Browsers

Mobile devices have native map apps that can intercept links:

| Platform | Default Behavior |
|----------|------------------|
| **iOS Safari** | `maps.apple.com` opens Apple Maps app; Google Maps URLs open in browser (or Google Maps app if installed) |
| **iOS Chrome** | Google Maps URLs can open Google Maps app if installed |
| **Android** | Google Maps URLs open Google Maps app; `geo:` protocol triggers app chooser |

**Best approach for mobile:** Use a universal Google Maps URL that works everywhere.

## URL Format Options

### Option 1: Google Maps Place URL (Recommended)

Uses the Google Place ID stored in Sanity:

```
https://www.google.com/maps/place/?q=place_id:ChIJ...
```

**Pros:**
- Opens exact business listing with reviews, hours, photos
- Works on all platforms
- Most accurate location (no geocoding needed)

**Cons:**
- Requires Place ID to be configured in Sanity
- Falls back needed if Place ID missing

### Option 2: Google Maps Search URL

Uses the address as a search query:

```
https://www.google.com/maps/search/?api=1&query=105+1/2+E+1st+St,+Port+Angeles,+WA
```

**Pros:**
- Works without Place ID
- Can be generated from address fields

**Cons:**
- May show multiple results if address is ambiguous
- Less precise than Place ID

### Option 3: Google Maps Directions URL

Opens with directions from user's current location:

```
https://www.google.com/maps/dir/?api=1&destination=105+1/2+E+1st+St,+Port+Angeles,+WA
```

**Pros:**
- Immediately useful for navigation
- One tap to start directions

**Cons:**
- More aggressive UX (assumes user wants directions)
- May not be what user expects from "view on map"

### Option 4: Coordinates-based URL

Uses latitude/longitude:

```
https://www.google.com/maps?q=48.1234,-123.4567
```

**Pros:**
- Precise location
- No geocoding ambiguity

**Cons:**
- Shows a pin, not the business listing
- No business info, reviews, etc.

## Implementation Options

### A. Simple Link (Minimal Change)

Make the entire location card clickable:

```tsx
<a
  href={googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
>
  {/* existing card content */}
  <p className="font-body text-xs text-muted-foreground/60">Tap for directions</p>
</a>
```

**Pros:** Consistent with phone/email card behavior
**Cons:** Entire card is one action

### B. Separate CTA Button

Keep card static, add explicit button:

```tsx
<div className="flex items-center gap-3 p-4 ...">
  <div>{/* icon */}</div>
  <div>
    <p>{locationLabel}</p>
    <p>{address}</p>
    <a href={mapsUrl} className="text-xs text-primary">
      Open in Maps →
    </a>
  </div>
</div>
```

**Pros:** Clear, explicit action
**Cons:** Different pattern than phone/email cards

### C. Match Phone/Email Pattern

Make card clickable like phone (tap to call) and email (tap to copy):

```tsx
<a
  href={mapsUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 p-4 ..."
>
  {/* card content */}
  <p className="font-body text-xs text-muted-foreground/60">Tap for directions</p>
</a>
```

**Pros:** Consistent UX across all three cards
**Cons:** None significant

## Recommendation

**Use Option C (Match Phone/Email Pattern)** with **Option 1 URL format (Place ID)** and fallback to **Option 2 (Search URL)**.

### Proposed Implementation

1. Make location card an `<a>` tag (like phone card)
2. Use `googleMapsUrl` from Sanity if available
3. Fall back to search URL constructed from address fields
4. Add "Tap for directions" hint text (matches other cards)
5. Open in new tab with `target="_blank"`

### URL Priority

```tsx
const mapsUrl = siteSettings?.businessInfo?.googleMapsUrl
  || (siteSettings?.businessInfo?.googlePlaceId
      ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`);
```

### Mobile Considerations

- Google Maps URLs work well on both iOS and Android
- iOS users with Google Maps installed get app; others get web
- Android users get Google Maps app (or chooser if multiple map apps)
- No special `geo:` or `maps:` protocols needed

## Open Questions

1. Should the hint say "Tap for directions" or "Tap to view map"?
2. Should we include state/zip in the displayed address?
3. Is the Google Place ID configured in Sanity?

## Next Steps

1. Verify `googleMapsUrl` or `googlePlaceId` is set in Sanity CMS
2. Update Book.tsx to pass `businessInfo` to the location card
3. Implement clickable card with maps URL
4. Add hint text matching phone/email pattern
