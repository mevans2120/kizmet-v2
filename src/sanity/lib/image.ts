import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const builder = imageUrlBuilder(client)

/**
 * Basic image URL builder - returns the builder for chaining.
 * The @sanity/image-url library automatically applies crop and hotspot
 * when the source image contains that metadata AND you specify dimensions.
 *
 * For crop to be applied, use .width() and/or .height() with .fit('crop')
 * Example: urlFor(image).width(800).height(600).fit('crop').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Get a cropped image URL that respects Sanity's crop and hotspot settings.
 * This ensures the focal point is preserved when the image is cropped.
 *
 * @param source - Sanity image object (with crop/hotspot data)
 * @param width - Desired width
 * @param height - Optional height (if not provided, maintains aspect ratio)
 * @param quality - Image quality (default: 85)
 */
export function getCroppedImageUrl(
  source: SanityImageSource,
  width: number,
  height?: number,
  quality: number = 85
): string {
  let img = builder.image(source).width(width).quality(quality)

  if (height) {
    // When both dimensions specified, use fit('crop') to crop around hotspot
    img = img.height(height).fit('crop')
  }

  return img.url()
}

/**
 * Get a background image URL optimized for full-width hero sections.
 * Uses fit('crop') to ensure the hotspot is centered.
 *
 * @param source - Sanity image object
 * @param width - Desired width (default: 1920 for full HD)
 * @param height - Desired height (default: 1080 for 16:9 aspect)
 */
export function getHeroImageUrl(
  source: SanityImageSource,
  width: number = 1920,
  height: number = 1080
): string {
  return builder
    .image(source)
    .width(width)
    .height(height)
    .fit('crop')
    .quality(85)
    .url()
}
