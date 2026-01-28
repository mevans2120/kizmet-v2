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
}`

// Services Page Settings
export const SERVICES_PAGE_SETTINGS_QUERY = `*[_type == "servicesPageSettings"][0] {
  eyebrow,
  title,
  description,
  sectionTitle,
  bookButtonText,
  ctaHeading,
  ctaDescription,
  ctaButtonText,
  ctaButtonLink,
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

// Testimonials
export const TESTIMONIALS_QUERY = `*[_type == "testimonial" && featured == true] | order(order asc) {
  _id,
  authorName,
  authorLocation,
  quote
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
