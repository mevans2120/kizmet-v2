import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AboutPreviewProps {
  data?: {
    aboutPreviewEyebrow?: string;
    aboutPreviewQuote?: string;
    aboutPreviewAttributionName?: string;
    aboutPreviewAttributionTitle?: string;
    aboutPreviewCtaText?: string;
    aboutPreviewCtaLink?: string;
  };
}

// Fallback content
const fallbackData = {
  eyebrow: 'Meet Your Therapist',
  quote: 'In my family, healing was never something you learned from a textbook. It was passed down through touch, through presence, through care.',
  attributionName: 'Destiny',
  attributionTitle: 'Third-Generation Healer',
  ctaText: 'Read My Story',
  ctaLink: '/about',
};

const AboutPreview = ({ data }: AboutPreviewProps) => {
  const content = {
    eyebrow: data?.aboutPreviewEyebrow || fallbackData.eyebrow,
    quote: data?.aboutPreviewQuote || fallbackData.quote,
    attributionName: data?.aboutPreviewAttributionName || fallbackData.attributionName,
    attributionTitle: data?.aboutPreviewAttributionTitle || fallbackData.attributionTitle,
    ctaText: data?.aboutPreviewCtaText || fallbackData.ctaText,
    ctaLink: data?.aboutPreviewCtaLink || fallbackData.ctaLink,
  };

  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="container mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-6">
          {content.eyebrow}
        </p>

        {/* Quote Mark */}
        <span className="font-heading text-8xl md:text-9xl text-terracotta-400 opacity-40 leading-none block -mb-6 md:-mb-8">
          "
        </span>

        {/* Quote */}
        <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl italic text-secondary-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
          {content.quote}
        </blockquote>

        {/* Attribution */}
        <p className="font-body text-sm text-muted-foreground mb-8">
          — <span className="text-primary font-medium">{content.attributionName}</span>, {content.attributionTitle}
        </p>

        {/* CTA */}
        <Link
          href={content.ctaLink}
          className="inline-flex items-center gap-2 font-body text-base font-medium text-primary border-2 border-primary px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(90,114,92,0.4)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {content.ctaText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default AboutPreview;
