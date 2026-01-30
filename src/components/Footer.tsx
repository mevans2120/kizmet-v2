import Link from "next/link";

interface FooterProps {
  siteSettings?: {
    brandName?: string;
    tagline?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  footerSettings?: {
    brandDescription?: string;
    therapistName?: string;
    quickLinksHeading?: string;
    locationHeading?: string;
    therapistHeading?: string;
    copyrightText?: string;
  };
}

const Footer = ({ siteSettings, footerSettings }: FooterProps) => {
  const brandDescription = footerSettings?.brandDescription || "Nurturing your body and mind through the healing power of touch.";
  const therapistName = footerSettings?.therapistName || "Destiny";
  const address = siteSettings?.address;

  // Section headings with fallbacks
  const quickLinksHeading = footerSettings?.quickLinksHeading || "Quick Links";
  const locationHeading = footerSettings?.locationHeading || "Location";
  const therapistHeading = footerSettings?.therapistHeading || "Your Therapist";

  // Copyright with year replacement
  const copyrightTemplate = footerSettings?.copyrightText || "© {year} Kizmet Massage. All rights reserved.";
  const copyrightText = copyrightTemplate.replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4">
              {/* Hands Logo Mark */}
              <img
                src="/Kizmet-Hands.svg"
                alt=""
                className="w-[55px] h-[55px] -mt-2"
                aria-hidden="true"
              />
              <div className="flex flex-col text-center">
                <span className="nav-logo-kizmet text-secondary-foreground">
                  <span className="nav-logo-k">K</span>izmet
                </span>
                <span className="nav-logo-massage text-primary font-medium">
                  Massage
                </span>
              </div>
            </Link>
            <p className="font-body text-muted-foreground text-base leading-relaxed">
              {brandDescription}
            </p>
          </div>

          <div>
            <h4 className="font-heading text-xl font-medium text-secondary-foreground mb-4">
              {quickLinksHeading}
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="font-body text-base text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/services" className="font-body text-base text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/book" className="font-body text-base text-muted-foreground hover:text-foreground transition-colors">
                Book Appointment
              </Link>
              <Link href="/policies" className="font-body text-base text-muted-foreground hover:text-foreground transition-colors">
                What to Know
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl font-medium text-secondary-foreground mb-4">
              {locationHeading}
            </h4>
            <div className="font-body text-base text-muted-foreground space-y-2">
              <p>{address?.street || "105 1/2 E 1st St"}</p>
              <p>{address?.city || "Port Angeles"}, {address?.state || "WA"}</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-xl font-medium text-secondary-foreground mb-4">
              {therapistHeading}
            </h4>
            <p className="font-body text-base text-muted-foreground">
              {therapistName}
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="font-body text-xs text-muted-foreground">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
