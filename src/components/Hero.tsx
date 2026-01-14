import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-spa.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: '135%'
        }}
      >
        <div className="absolute inset-0 bg-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="animate-slide-up mb-6">
            <h1 className="font-heading text-5xl md:text-7xl font-semibold text-foreground leading-tight">
              Kizmet
            </h1>
            <p className="font-body text-base md:text-lg text-primary tracking-wide">
              Massage and Wellness
            </p>
          </div>
          <p className="font-body text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-delay">
            Destiny Pugh offers therapeutic massage in Port Angeles.
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
