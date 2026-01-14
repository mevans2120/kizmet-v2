import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const services = [{
  name: "Relaxation Massage",
  duration: "30 / 60 / 90 min",
  price: "$60 / $100 / $145",
  description: "Classic relaxation massage using long, flowing strokes to ease tension and promote circulation."
}, {
  name: "Deep Tissue",
  duration: "30 / 60 / 90 min",
  price: "$60 / $100 / $145",
  description: "Targeted pressure to release chronic muscle tension and knots in deeper layers of tissue."
}, {
  name: "Therapeutic Massage",
  duration: "30 / 60 / 90 min",
  price: "$60 / $100 / $145",
  description: "Customized treatment focused on your specific areas of concern for relief and recovery."
}];
const ServicesPreview = () => {
  return <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">OFFERINGS</p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground mb-4">
            Signature Services
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Each session is tailored to your individual needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => <Card key={service.name} className="border-border bg-background hover:shadow-lg transition-all duration-300 group" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-2xl font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{service.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="text-primary font-medium">{service.price}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>)}
        </div>
        
        <div className="text-center">
          <Button variant="heroOutline" size="lg" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default ServicesPreview;