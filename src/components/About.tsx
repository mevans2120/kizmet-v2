import Link from "next/link";
import { Button } from "@/components/ui/button";
const About = () => {
  return <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          
          <div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Meet Destiny
            </p>
            <h2 className="font-heading text-5xl md:text-6xl font-medium text-foreground mb-6">
              Healing Through Touch
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              At Kizmet Massage & Wellness, I believe in the profound connection 
              between body and mind. I combine traditional techniques with modern 
              approaches to create personalized treatments that address your unique needs.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Whether you're seeking relief from chronic pain, recovering from 
              injury, or simply need a moment of relaxation, I'm here to 
              support your wellness journey.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default About;