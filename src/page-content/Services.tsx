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
    description: "A focused session perfect for targeting a specific area of concern. Great for a quick tune-up or when you're short on time.",
  },
  {
    name: "60 Minute Session",
    duration: "60 min",
    price: "$100",
    description: "The most popular choice. Enough time for a full-body massage or to thoroughly address multiple areas of tension and discomfort.",
  },
  {
    name: "90 Minute Session",
    duration: "90 min",
    price: "$145",
    description: "The ultimate relaxation experience. Allows time for comprehensive full-body work with extra attention to problem areas.",
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
                    </CardContent>
                    {service.bookingUrl && (
                      <div className="px-6 pb-6 mt-auto flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={service.bookingUrl}>Book</Link>
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
