import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Service {
  _id?: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  bookingUrl?: string;
}

interface ServicesPreviewProps {
  services?: Service[];
  data?: {
    servicesHeading?: string;
    servicesDescription?: string;
  };
}

// Fallback services if Sanity data not available
const fallbackServices: Service[] = [
  {
    name: "Relaxation Massage",
    duration: "30 / 60 / 90 min",
    price: "$60 / $100 / $145",
    description: "Classic relaxation massage using long, flowing strokes to ease tension and promote circulation."
  },
  {
    name: "Deep Tissue",
    duration: "30 / 60 / 90 min",
    price: "$60 / $100 / $145",
    description: "Targeted pressure to release chronic muscle tension and knots in deeper layers of tissue."
  },
  {
    name: "Therapeutic Massage",
    duration: "30 / 60 / 90 min",
    price: "$60 / $100 / $145",
    description: "Customized treatment focused on your specific areas of concern for relief and recovery."
  }
];

const ServicesPreview = ({ services, data }: ServicesPreviewProps) => {
  const displayServices = services && services.length > 0 ? services : fallbackServices;
  const heading = data?.servicesHeading || "Signature Services";
  const description = data?.servicesDescription || "Each session is tailored to your individual needs";

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">OFFERINGS</p>
          <h2 className="font-heading text-5xl md:text-6xl font-medium text-foreground mb-4">
            {heading}
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto text-base">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {displayServices.map((service, index) => (
            <Card
              key={service._id || service.name}
              className="border-border bg-background hover:shadow-lg transition-all duration-300 group flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-3xl font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{service.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="text-primary font-medium">{service.price}</span>
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

        <div className="text-center">
          <Button variant="heroOutline" size="lg" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
