# Google Places API Research Findings

**Date:** January 29, 2026
**Purpose:** Evaluate using Google Places API to automatically populate business information

---

## Executive Summary

Google Places API can fetch verified business data directly from Google's database. However, for Kizmet's use case (single-location business with static info), **manual CMS entry is more practical**. The API adds complexity without significant benefits for content that rarely changes.

**Simpler Alternative:** Use `sameAs` in your LocalBusiness schema to link to your Google Business Profile. This provides SEO benefits without API costs or complexity.

---

## 1. Finding Your Google Place ID

### Method: Place ID Finder Tool

1. Visit https://developers.google.com/maps/documentation/places/web-service/place-id
2. Enter your business name in the search bar
3. Select the correct location
4. Copy the Place ID (format: `ChIJ...`)

### Notes
- Place IDs can be stored indefinitely
- They remain constant even if business details change
- May become obsolete if business closes or relocates

---

## 2. Available Data from Places API

| Data Point | API Field | Pricing Tier |
|------------|-----------|--------------|
| Business Name | `displayName` | Pro |
| Address | `formattedAddress` | Essentials |
| Phone | `internationalPhoneNumber` | Enterprise |
| Hours | `regularOpeningHours` | Enterprise |
| Coordinates | `location` | Essentials |
| Price Level | `priceLevel` | Enterprise |
| Rating | `rating`, `userRatingCount` | Enterprise |
| Reviews | `reviews` (max 5) | Enterprise + Atmosphere |

---

## 3. Pricing

- **$200 monthly credit** from Google
- **10,000 free requests/month** for most SKUs
- After free tier: $2.83-$5.00 per 1,000 requests

For a site with ISR caching (hourly revalidation): ~720 requests/month = **$0**

---

## 4. Caching Restrictions (Important!)

### What You CAN Cache
| Data | Duration |
|------|----------|
| Place ID | Indefinitely |
| Coordinates | 30 days max |

### What You CANNOT Cache
- Business name, address, phone, hours, reviews, photos, ratings
- Must fetch fresh or delete after viewing session

### Attribution Required
- Must display Google attribution when showing Places data
- Reviews require author name/photo displayed

---

## 5. Implementation (If Using API)

```typescript
// src/lib/google-places.ts
const FIELDS = [
  'displayName',
  'formattedAddress',
  'internationalPhoneNumber',
  'regularOpeningHours',
  'location',
  'priceLevel',
].join(',');

export async function getPlaceDetails() {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${process.env.GOOGLE_PLACE_ID}`,
    {
      headers: {
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
        'X-Goog-FieldMask': FIELDS,
      },
      next: { revalidate: 3600 }, // 1 hour ISR
    }
  );
  return response.json();
}
```

---

## 6. Simpler Alternative: `sameAs` Link

Instead of the API, just add your Google Business Profile URL to the `sameAs` array in your LocalBusiness schema:

```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "Kizmet Massage",
  "sameAs": [
    "https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID",
    "https://instagram.com/kizmetmassage"
  ]
}
```

**Benefits:**
- Tells Google your website = your Business Profile (same entity)
- Helps with Knowledge Graph connections
- Zero API costs
- No caching restrictions
- No attribution requirements

**Trade-off:**
- Data doesn't auto-sync (still manual in CMS)

---

## 7. Recommendation

| Approach | Best For |
|----------|----------|
| **`sameAs` link only** | Small businesses, static info, simplicity |
| **Places API** | Multi-location, frequent changes, need reviews/ratings |
| **Hybrid** | Validate CMS against Google at build time |

**For Kizmet:** Use `sameAs` to link to Google Business Profile. Maintain business info manually in Sanity. Simple, free, effective.

---

## 8. Adding `sameAs` to Current Schema

Update `src/lib/structured-data.tsx` to include a `googlePlaceId` field:

```typescript
// In sameAs array generation:
if (settings?.businessInfo?.googlePlaceId) {
  sameAs.push(`https://www.google.com/maps/place/?q=place_id:${settings.businessInfo.googlePlaceId}`)
}
```

Add field to Sanity `siteSettings.ts`:
```typescript
defineField({
  name: 'googlePlaceId',
  title: 'Google Place ID',
  type: 'string',
  fieldset: 'business',
  description: 'Find at: developers.google.com/maps/documentation/places/web-service/place-id',
})
```

---

## Sources

- [Google Places API Pricing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)
- [Place Details Documentation](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
- [Caching Policies](https://developers.google.com/maps/documentation/places/web-service/policies)
