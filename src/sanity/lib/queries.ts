// Site-wide
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  brandName,
  tagline,
  phone,
  email,
  address,
  bookingUrl,
  seo {
    siteUrl,
    metaTitle,
    metaDescription,
    socialImage {
      asset-> { _id, url },
      hotspot,
      crop
    },
    twitterHandle,
    instagramHandle,
    facebookUrl
  },
  businessInfo {
    businessType,
    priceRange,
    businessHours[] {
      days,
      opens,
      closes
    },
    geoCoordinates {
      latitude,
      longitude
    },
    googleMapsUrl
  }
}`

export const FOOTER_SETTINGS_QUERY = `*[_type == "footerSettings"][0]`

// Homepage
export const HOMEPAGE_SETTINGS_QUERY = `*[_type == "homepageSettings"][0] {
  ...,
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
}`

// Services
export const ALL_SERVICES_QUERY = `*[_type == "service"] | order(order asc) {
  _id,
  name,
  slug,
  duration,
  price,
  description,
  extendedDescription,
  techniques,
  bestFor,
  featured,
  order,
  bookingUrl,
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
}`

export const FEATURED_SERVICES_QUERY = `*[_type == "service" && featured == true] | order(order asc) {
  _id,
  name,
  slug,
  duration,
  price,
  description,
  extendedDescription,
  techniques,
  bestFor,
  bookingUrl
}`

// Pages with SEO
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  ...,
  heroImage {
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
}`

export const POLICIES_PAGE_QUERY = `*[_type == "policiesPage"][0] {
  ...,
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
}`

export const BOOK_PAGE_QUERY = `*[_type == "bookPage"][0] {
  ...,
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
}`
