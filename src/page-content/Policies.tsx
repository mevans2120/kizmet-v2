import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PolicyItem {
  _key?: string;
  title: string;
  items?: string[];
}

interface PoliciesData {
  pageTitle?: string;
  pageDescription?: string;
  eyebrow?: string;
  questionsHeading?: string;
  questionsDescription?: string;
  policies?: PolicyItem[];
}

interface PoliciesProps {
  data?: PoliciesData;
  siteSettings?: any;
  footerSettings?: any;
}

// Fallback policies
const fallbackPolicies = [
  {
    title: "Appointment Policy",
    items: [
      "Please arrive 5 minutes early for your appointment. If you're a new client, please come 10-15 minutes early to fill out new client paperwork.",
      "I recommend avoiding heavy meals and caffeine before your massage for the most comfortable experience.",
      "Please communicate any health conditions, injuries, or areas of concern with your therapist before your session begins.",
    ],
  },
  {
    title: "Cancellation Policy",
    items: [
      "We require at least 24 hours notice for cancellations or rescheduling. This allows us to offer the time slot to other clients who may be waiting.",
      "Cancellations made less than 24 hours in advance will be subject to a fee equal to 50% of the scheduled service.",
      "No-shows without any prior communication will be charged the full service amount.",
      "We understand emergencies happen—please contact us as soon as possible if you need to cancel.",
    ],
  },
  {
    title: "Late Arrival Policy",
    items: [
      "If you arrive late for your appointment, your session may be shortened to accommodate the next client.",
      "You will still be charged the full price for your originally scheduled service.",
      "If you are running more than 15 minutes late, please call us—we may need to reschedule your appointment.",
    ],
  },
  {
    title: "Payment Policy",
    items: [
      "Payment is due at the time of service. We accept cash, credit cards (Visa, MasterCard, American Express), and select mobile payment options.",
      "Gift certificates are available for purchase and make wonderful presents for loved ones.",
      "Gratuity is not included in service prices and is greatly appreciated when you feel your therapist has exceeded expectations.",
    ],
  },
  {
    title: "Health & Safety",
    items: [
      "Please reschedule your appointment if you are experiencing cold or flu symptoms, fever, or any contagious condition.",
      "Certain medical conditions may require physician clearance before receiving massage therapy. Please inform us of any health concerns.",
      "All linens and equipment are sanitized between clients. Your health and safety is our top priority.",
    ],
  },
  {
    title: "Draping Policy",
    items: [
      "Professional draping is used during all massage sessions to ensure your comfort and privacy.",
      "Only the area being worked on will be exposed. You may undress to your comfort level.",
      "Please communicate with your therapist if you have any concerns about draping or coverage.",
    ],
  },
];

const Policies = ({ data, siteSettings, footerSettings }: PoliciesProps) => {
  const pageTitle = data?.pageTitle || "Policies";
  const pageDescription = data?.pageDescription || "I appreciate your understanding and cooperation with these policies. They help me provide the best possible experience for all clients.";
  const policies = data?.policies && data.policies.length > 0 ? data.policies : fallbackPolicies;

  // New CMS fields with fallbacks
  const eyebrow = data?.eyebrow || "Important Information";
  const questionsHeading = data?.questionsHeading || "Questions?";
  const questionsDescription = data?.questionsDescription || "If you have any questions about our policies or need to discuss special circumstances, please don't hesitate to reach out.";

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
              {pageTitle}
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto text-xl">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* Policies */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-12">
              {policies.map((policy, index) => (
                <div
                  key={policy._key || policy.title}
                  className="pb-12 border-b border-border last:border-0 last:pb-0"
                >
                  <h2 className="font-heading text-3xl font-medium text-secondary-foreground mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-body flex items-center justify-center">
                      {index + 1}
                    </span>
                    {policy.title}
                  </h2>
                  <ul className="space-y-4">
                    {policy.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="font-body text-base text-muted-foreground leading-relaxed pl-6 relative">
                        <span className="absolute left-0 top-2 w-2 h-2 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="font-heading text-3xl font-medium text-secondary-foreground mb-4">
              {questionsHeading}
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              {questionsDescription}
            </p>
            <p className="font-body text-foreground">
              <a href={`mailto:${siteSettings?.email || "hello@kizmetwellness.com"}`} className="text-primary hover:underline">
                {siteSettings?.email || "hello@kizmetwellness.com"}
              </a>
              {" "}•{" "}
              <a href={`tel:${siteSettings?.phone?.replace(/\D/g, '') || "+15551234567"}`} className="text-primary hover:underline">
                {siteSettings?.phone || "(555) 123-4567"}
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  );
};

export default Policies;
