import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-spa.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
        <div className="absolute inset-0 bg-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4 animate-fade-in">
            Massage & Wellness
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-medium text-foreground mb-6 animate-slide-up">
            Kizmet
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-delay">
            Experience the restorative power of therapeutic massage. 
            Reconnect with your body and find your balance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay">
            <Button variant="hero" size="xl" asChild>
              <Link href="/book">Book Your Session</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
