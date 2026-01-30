'use client'

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalEmbed } from "@/components/CalEmbed";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, FileText } from "lucide-react";

interface Service {
  _id?: string;
  name: string;
  duration: string;
  price: string;
  bookingUrl?: string;
}

interface PolicyPreview {
  title: string;
  summary?: string;
}

interface BookData {
  eyebrow?: string;
  headline?: string;
  description?: string;
  sessionSelectorLabel?: string;
  callLabel?: string;
  emailLabel?: string;
  locationLabel?: string;
  policiesHeading?: string;
  viewPoliciesLinkText?: string;
  policyPreviews?: PolicyPreview[];
}

interface BookProps {
  data?: BookData;
  services?: Service[];
  siteSettings?: any;
  footerSettings?: any;
}

// Default policy previews
const defaultPolicyPreviews: PolicyPreview[] = [
  { title: 'Cancellation', summary: '24 hours notice required. Late cancellations subject to 50% fee.' },
  { title: 'Arrival', summary: 'Please arrive 5 minutes early. New clients: 10-15 minutes for paperwork.' },
  { title: 'Payment', summary: 'Payment due at time of service. Cash, card, and mobile payments accepted.' },
];

const Book = ({ data, services, siteSettings, footerSettings }: BookProps) => {
  // Filter to only services with booking URLs
  const bookableServices = services?.filter(s => s.bookingUrl) || [];

  // Get initial service from URL params or default to first bookable service
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');

  const getInitialService = () => {
    if (serviceParam && bookableServices.length > 0) {
      // Try to match by duration (e.g., "30", "60", "90")
      const match = bookableServices.find(s => s.duration.includes(serviceParam));
      if (match) return match;
    }
    return bookableServices[0] || null;
  };

  const [selectedService, setSelectedService] = useState<Service | null>(getInitialService);

  // Extract calLink from full URL (e.g., "https://cal.com/user/event" -> "user/event")
  const getCalLink = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.slice(1); // Remove leading slash
    } catch {
      return url;
    }
  };


  // Header content with fallbacks
  const eyebrow = data?.eyebrow || "Schedule Your Visit";
  const headline = data?.headline || "Book an Appointment";
  const description = data?.description || "Select your service and choose a time that works for you.";

  // New CMS fields with fallbacks
  const sessionSelectorLabel = data?.sessionSelectorLabel || "Select your session:";
  const callLabel = data?.callLabel || "Call";
  const emailLabel = data?.emailLabel || "Email";
  const locationLabel = data?.locationLabel || "Location";
  const policiesHeading = data?.policiesHeading || "Before Your Visit";
  const viewPoliciesLinkText = data?.viewPoliciesLinkText || "View All Policies";
  const policyPreviews = data?.policyPreviews && data.policyPreviews.length > 0
    ? data.policyPreviews
    : defaultPolicyPreviews;

  const phone = siteSettings?.phone;
  const email = siteSettings?.email;
  const address = siteSettings?.address;
  const businessInfo = siteSettings?.businessInfo;

  // Build maps URL: prefer explicit URL, fall back to address search
  const getMapsUrl = () => {
    if (businessInfo?.googleMapsUrl) return businessInfo.googleMapsUrl;
    if (address) {
      const fullAddress = [address.street, address.city, address.state, address.zip]
        .filter(Boolean)
        .join(', ');
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };
  const mapsUrl = getMapsUrl();

  // If no bookable services, show a message
  if (bookableServices.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation siteSettings={siteSettings} />
        <main className="pt-24 pb-16">
          <section className="py-16 bg-card">
            <div className="container mx-auto px-6 text-center">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
                {eyebrow}
              </p>
              <h1 className="font-heading text-5xl md:text-6xl font-medium text-secondary-foreground mb-6">
                {headline}
              </h1>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto text-xl mb-8">
                Online booking is coming soon. Please contact us directly to schedule your appointment.
              </p>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 font-heading text-2xl text-primary hover:underline"
                >
                  <Phone className="w-6 h-6" />
                  {phone}
                </a>
              )}
            </div>
          </section>
        </main>
        <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation siteSettings={siteSettings} />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6 text-center">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">
              {eyebrow}
            </p>
            <h1 className="font-heading text-5xl md:text-6xl font-medium text-secondary-foreground mb-6">
              {headline}
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto text-xl">
              {description}
            </p>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Cal.com Embed Container */}
            <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
              {/* Service Selector */}
              <div className="p-6 border-b border-border">
                <p className="font-body text-sm text-muted-foreground mb-3">{sessionSelectorLabel}</p>
                <div className="flex flex-wrap gap-3">
                  {bookableServices.map((service) => (
                    <Button
                      key={service._id || service.name}
                      variant={selectedService?._id === service._id || selectedService?.name === service.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedService(service)}
                      className="font-body"
                    >
                      {service.duration} <span className="ml-1 opacity-80">{service.price}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cal.com Embed */}
              <div className="p-6">
                {selectedService?.bookingUrl && (
                  <CalEmbed
                    key={selectedService.bookingUrl}
                    calLink={getCalLink(selectedService.bookingUrl)}
                  />
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{callLabel}</p>
                    <p className="font-body text-sm font-medium text-foreground">{phone}</p>
                    <p className="font-body text-xs text-muted-foreground/60">Tap to call</p>
                  </div>
                </a>
              )}
              {email && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(email);
                    toast.success("Email copied to clipboard");
                  }}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors text-left cursor-pointer"
                >
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{emailLabel}</p>
                    <p className="font-body text-sm font-medium text-foreground">{email}</p>
                    <p className="font-body text-xs text-muted-foreground/60">Tap to copy</p>
                  </div>
                </button>
              )}
              {address && (
                <a
                  href={mapsUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{locationLabel}</p>
                    <p className="font-body text-sm font-medium text-foreground">
                      {address.street}, {address.city}
                    </p>
                    <p className="font-body text-xs text-muted-foreground/60">Tap for directions</p>
                  </div>
                </a>
              )}
            </div>

            {/* Policies Preview */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-medium text-secondary-foreground">{policiesHeading}</h3>
                </div>
                <Link
                  href="/policies#cancellation"
                  className="font-body text-sm text-primary hover:underline"
                >
                  {viewPoliciesLinkText}
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {policyPreviews.map((policy, index) => (
                  <div key={policy.title}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</span>
                      <h4 className="font-body text-sm font-semibold text-foreground">{policy.title}</h4>
                    </div>
                    {policy.summary && (
                      <p className="font-body text-sm text-muted-foreground pl-7">
                        {policy.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  );
};

export default Book;
