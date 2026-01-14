import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sage-600/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-sage-600/20 rounded-full translate-x-1/4 translate-y-1/4" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-primary-foreground mb-6">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="font-body text-primary-foreground/80 mb-10 text-lg">
            Book your first session today and experience the transformative 
            power of therapeutic massage.
          </p>
          <Button 
            size="xl" 
            className="bg-background text-foreground hover:bg-cream-100 shadow-lg"
            asChild
          >
            <Link href="/book">Book Your Appointment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
