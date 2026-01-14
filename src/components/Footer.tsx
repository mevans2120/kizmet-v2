import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
              Kizmet
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Massage & Wellness<br />
              Nurturing your body and mind through the healing power of touch.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-medium text-foreground mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/services" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/book" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                Book Appointment
              </Link>
              <Link href="/policies" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                Policies
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-medium text-foreground mb-4">
              Location
            </h4>
            <div className="font-body text-sm text-muted-foreground space-y-2">
              <p>105 1/2 E 1st St</p>
              <p>Port Angeles, WA</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-medium text-foreground mb-4">
              Your Therapist
            </h4>
            <p className="font-body text-sm text-muted-foreground">
              Destiny
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kizmet Massage & Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
