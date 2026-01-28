'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHeroImageUrl, getVideoUrl, SanityFileAsset } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import heroImage from "@/assets/hero-spa.jpg";

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
    heroVideo?: SanityFileAsset;
    heroVideoPoster?: SanityImageSource;
    heroVideoPlayback?: 'loop' | 'playOnce';
  };
}

const Hero = ({ data }: HeroProps) => {
  // Respect user's reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Use Sanity data or fallback to defaults
  const headline = data?.heroHeadline || "Kizmet";
  const subheadline = data?.heroSubheadline || "Destiny Pugh offers therapeutic massage in Port Angeles. Reconnect with your body and find your balance.";
  const ctaText = data?.heroCta || "Book Your Session";
  const ctaLink = data?.heroCtaLink || "/book";
  const secondaryCtaText = data?.heroSecondaryCta || "View Services";
  const secondaryCtaLink = data?.heroSecondaryCtaLink || "/services";

  // Use Sanity image if available (with crop/hotspot respected), otherwise use local asset
  const backgroundImage = data?.heroImage
    ? getHeroImageUrl(data.heroImage, 1920, 1080)
    : heroImage.src;

  // Video URL from Sanity file asset
  const videoUrl = getVideoUrl(data?.heroVideo);

  // Poster image: videoPoster -> heroImage -> local fallback
  const posterUrl = data?.heroVideoPoster
    ? getHeroImageUrl(data.heroVideoPoster, 1920, 1080)
    : backgroundImage;

  // Show video only if: video mode selected, video exists, and user hasn't requested reduced motion
  const showVideo = data?.heroMediaType === 'video' && videoUrl && !prefersReducedMotion;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            autoPlay
            muted
            loop={data?.heroVideoPlayback !== 'playOnce'}
            playsInline
            poster={posterUrl}
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full bg-top bg-no-repeat bg-[length:auto_130%] md:bg-[length:135%]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-heading text-5xl md:text-8xl leading-none flex items-baseline justify-center gap-2 md:gap-6">
              <span className="text-secondary-foreground font-medium tracking-tighter">
                Kizmet
              </span>
              <span className="text-primary tracking-tighter">
                Massage
              </span>
            </h1>
          </div>
          <p className="font-body text-xl text-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-slow">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-slow">
            <Button variant="hero" size="xl" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Fade Edge - subtle scroll hint */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.2) 20%, hsl(var(--background) / 0.5) 40%, hsl(var(--background) / 0.8) 70%, hsl(var(--background)) 100%)'
        }}
      />
    </section>
  );
};

export default Hero;
