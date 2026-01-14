import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  data?: {
    ctaHeadline?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
  };
}

const CTASection = ({ data }: CTASectionProps) => {
  const headline = data?.ctaHeadline || "It's Time to Feel Good";
  const description = data?.ctaDescription || "Book your first session today and experience the transformative power of therapeutic massage.";
  const buttonText = data?.ctaButtonText || "Book Your Appointment";

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sage-600/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-sage-600/20 rounded-full translate-x-1/4 translate-y-1/4" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-5xl md:text-6xl font-medium text-primary-foreground mb-6">
            {headline}
          </h2>
          <p className="font-body text-primary-foreground/80 mb-10 text-xl">
            {description}
          </p>
          <Button
            size="xl"
            className="bg-background text-foreground hover:bg-cream-100 shadow-lg"
            asChild
          >
            <Link href="/book">{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
