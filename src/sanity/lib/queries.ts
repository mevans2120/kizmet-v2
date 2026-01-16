// Site-wide
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`
export const FOOTER_SETTINGS_QUERY = `*[_type == "footerSettings"][0]`

// Homepage
export const HOMEPAGE_SETTINGS_QUERY = `*[_type == "homepageSettings"][0]`

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
  bookingUrl
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

// Pages
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`
export const POLICIES_PAGE_QUERY = `*[_type == "policiesPage"][0]`
export const BOOK_PAGE_QUERY = `*[_type == "bookPage"][0]`
