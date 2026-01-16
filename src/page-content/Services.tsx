import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";

interface Service {
  _id?: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  extendedDescription?: string;
  techniques?: string[];
  bestFor?: string[];
  bookingUrl?: string;
}

interface ServicesProps {
  services?: Service[];
  siteSettings?: any;
  footerSettings?: any;
}

// Fallback services if Sanity data not available
const fallbackServices: Service[] = [
  {
    name: "30 Minute Session",
    duration: "30 min",
    price: "$60",
    description: "Targeted work on a single area of concern. I use focused pressure and trigger point techniques to address specific tension in the neck, shoulders, or lower back.",
    extendedDescription: "This session works well for maintenance between longer appointments, addressing a flare-up, or when your schedule is tight. We'll spend the full time on your priority area rather than spreading attention thin.",
    techniques: ["Trigger point therapy", "Focused deep tissue", "Myofascial release"],
    bestFor: ["Desk workers with neck tension", "Runners with tight calves", "Maintenance between sessions"],
  },
  {
    name: "60 Minute Session",
    duration: "60 min",
    price: "$100",
    description: "A complete full-body treatment combining Swedish strokes, kneading, and deeper pressure where needed. This is my most popular session—enough time to address your back, neck, shoulders, and legs while promoting full-body relaxation.",
    extendedDescription: "I'll check in about pressure throughout and adjust my approach based on what your body needs that day. Whether you want relaxation or more therapeutic work, an hour gives us the flexibility to do both.",
    techniques: ["Swedish massage", "Deep tissue", "Kneading", "Long flowing strokes"],
    bestFor: ["Regular wellness maintenance", "Stress relief", "First-time clients", "General tension"],
  },
  {
    name: "90 Minute Session",
    duration: "90 min",
    price: "$145",
    description: "An unhurried, comprehensive session with time for detailed work on problem areas. The extra thirty minutes allows me to thoroughly address chronic tension without rushing, incorporating hot towel application and optional stretching or aromatherapy.",
    extendedDescription: "This is my most thorough treatment—ideal when you're carrying significant tension, recovering from an event, or simply want to fully disconnect. We can spend extra time on stubborn areas while still providing complete full-body coverage.",
    techniques: ["Combined modalities", "Hot towels", "Assisted stretching", "Aromatherapy (optional)"],
    bestFor: ["Chronic pain", "Athletes", "High-stress periods", "Complete restoration", "Treating yourself"],
  },
];

const Services = ({ services, siteSettings, footerSettings }: ServicesProps) => {
  const displayServices = services && services.length > 0 ? services : fallbackServices;

  return (
    <div className="min-h-screen bg-background">
      <Navigation siteSettings={siteSettings} />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6 text-center">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
              What I Offer
            </p>
            <h1 className="font-heading text-5xl md:text-6xl font-medium text-foreground mb-6">
              Services & Pricing
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto text-xl">
              Every massage is customized to your individual needs.
              Let me know your goals and I'll create the perfect treatment for you.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="font-heading text-3xl font-medium text-foreground mb-8 pb-4 border-b border-border">
                Massage Sessions
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayServices.map((service) => (
                  <Card key={service._id || service.name} className="border-border bg-card hover:shadow-md transition-all duration-300 flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-heading text-3xl font-medium text-foreground">
                        {service.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium">{service.price}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="font-body text-muted-foreground text-base leading-relaxed">
                        {service.description}
                      </p>
                      {service.extendedDescription && (
                        <p className="font-body text-muted-foreground text-base leading-relaxed mt-3">
                          {service.extendedDescription}
                        </p>
                      )}
                      {service.techniques && service.techniques.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-caps text-foreground font-medium mb-2">
                            Techniques
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.techniques.map((t) => (
                              <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {service.bestFor && service.bestFor.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs uppercase tracking-caps text-foreground font-medium mb-2">
                            Best For
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.bestFor.map((b) => (
                              <span key={b} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    {service.bookingUrl && (
                      <div className="px-6 pb-6 mt-auto flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/book?service=${service.duration.split(' ')[0]}`}>Book</Link>
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading text-3xl font-medium text-foreground mb-4">
              Ready to Feel Your Best?
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
              Not sure which session length is right for you? I'm happy to help you choose.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link href="/book">Book Your Session</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  );
};

export default Services;
