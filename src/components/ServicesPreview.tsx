import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface ServicesPreviewProps {
  services?: Service[];
  data?: {
    servicesHeading?: string;
    servicesDescription?: string;
    servicesEyebrow?: string;
    servicesBookButtonText?: string;
    servicesLearnMoreText?: string;
    servicesLearnMoreLink?: string;
  };
}

// Fallback services if Sanity data not available
const fallbackServices: Service[] = [
  {
    name: "30 Minute Session",
    duration: "30 min",
    price: "$60",
    description: "Targeted work on a single area of concern. I use focused pressure and trigger point techniques to address specific tension in the neck, shoulders, or lower back."
  },
  {
    name: "60 Minute Session",
    duration: "60 min",
    price: "$100",
    description: "A complete full-body treatment combining Swedish strokes, kneading, and deeper pressure where needed. This is my most popular session."
  },
  {
    name: "90 Minute Session",
    duration: "90 min",
    price: "$145",
    description: "An unhurried, comprehensive session with time for detailed work on problem areas, incorporating hot towel application and optional aromatherapy."
  }
];

const ServicesPreview = ({ services, data }: ServicesPreviewProps) => {
  const displayServices = services && services.length > 0 ? services : fallbackServices;
  const heading = data?.servicesHeading || "Signature Services";
  const description = data?.servicesDescription || "Each session is tailored to your individual needs";

  // New CMS fields with fallbacks
  const eyebrow = data?.servicesEyebrow || "OFFERINGS";
  const bookButtonText = data?.servicesBookButtonText || "Book";
  const learnMoreText = data?.servicesLearnMoreText || "Learn More";
  const learnMoreLink = data?.servicesLearnMoreLink || "/services";

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">{eyebrow}</p>
          <h2 className="font-heading text-5xl md:text-6xl font-medium text-secondary-foreground mb-4">
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
                <CardTitle className="font-heading text-3xl font-medium text-secondary-foreground group-hover:text-primary transition-colors">
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
                    <Link href={`/book?service=${service.duration.split(' ')[0]}`}>{bookButtonText}</Link>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="heroOutline" size="lg" asChild>
            <Link href={learnMoreLink}>{learnMoreText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
