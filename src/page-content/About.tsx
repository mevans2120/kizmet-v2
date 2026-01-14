import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

// =============================================================================
// CONTENT DATA (Sanity-ready structure)
// When Sanity is integrated, replace this object with GROQ query results
// =============================================================================

const aboutContent = {
  hero: {
    eyebrow: "About Destiny",
    headline: "Healing Hands, Open Heart",
    intro:
      "I grew up watching my grandmother's hands work magic on aching muscles and tired spirits. Now I'm carrying that tradition forward, blending generations of natural healing wisdom with modern therapeutic techniques.",
    image: {
      src: "/placeholder.svg",
      alt: "Destiny, founder of Kizmet Massage & Wellness",
    },
  },
  quote: {
    text: "In my family, healing was never something you learned from a textbook. It was passed down through touch, through presence, through care.",
    attribution: "Destiny, Founder of Kizmet",
  },
  bio: {
    title: "My Roots",
    credentials: [
      "Licensed Massage Therapist",
      "Third-Generation Healer",
      "Deep Tissue Certified",
      "Swedish Massage Trained",
      "Prenatal Massage Certified",
    ],
    paragraphs: [
      "Healing has always been the family business. My grandmother was the person everyone in our community called when their backs went out or their shoulders seized up. My mother inherited those same intuitive hands. I spent my childhood learning by watching—absorbing techniques that no school could teach.",
      "When I decided to make this my profession, formal training gave me the language and anatomy to understand what my hands already knew. The Pacific Northwest School of Massage helped me bridge generations of folk wisdom with evidence-based practice.",
      "Kizmet is the culmination of that journey—a place where heritage meets technique, where the old ways inform the new. Every session carries the weight of my grandmother's knowledge and the precision of modern therapeutic methods.",
    ],
  },
  journey: {
    title: "What a Session Looks Like",
    intro:
      "No two bodies are the same, but every session follows a rhythm that honors both tradition and your individual needs.",
    steps: [
      {
        number: 1,
        title: "We Connect",
        description:
          "I want to hear what brought you in—not just the pain, but the life around it. Then my hands find what words sometimes can't.",
      },
      {
        number: 2,
        title: "We Work",
        description:
          "Drawing from deep tissue, Swedish, and techniques passed down through my family—whatever serves you best.",
      },
      {
        number: 3,
        title: "You Leave Transformed",
        description:
          "Not just relaxed. More aware of your body, with tools to continue the work at home.",
      },
    ],
  },
  cta: {
    headline: "Ready to Begin Your Journey?",
    buttonText: "Book Your Session",
    buttonLink: "/book",
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

const About = () => {
  const { hero, quote, bio, journey, cta } = aboutContent;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="lg:pr-8">
                <p className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-4">
                  {hero.eyebrow}
                </p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
                  {hero.headline}
                </h1>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  {hero.intro}
                </p>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-muted">
                  <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Decorative accent circle */}
                <div className="absolute -top-6 -right-6 w-32 h-32 md:w-48 md:h-48 bg-sage-100 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-20 bg-sage-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-heading text-8xl md:text-9xl text-terracotta-400 opacity-50 leading-none">
                "
              </span>
              <blockquote className="font-heading text-2xl md:text-3xl italic text-foreground -mt-12 mb-6">
                {quote.text}
              </blockquote>
              <p className="font-body text-sm uppercase tracking-[0.15em] text-sage-600">
                — {quote.attribution}
              </p>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Sidebar */}
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-4">
                  {bio.title}
                </h2>
                <div className="w-16 h-0.5 bg-terracotta-500 mb-6" />
                <ul className="space-y-0">
                  {bio.credentials.map((credential, index) => (
                    <li
                      key={index}
                      className="font-body text-muted-foreground py-3 border-b border-border last:border-b-0"
                    >
                      {credential}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                {bio.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`font-body text-foreground leading-relaxed mb-6 last:mb-0 ${
                      index === 0
                        ? "first-letter:font-heading first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-sage-600"
                        : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Session Journey Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground mb-4">
                {journey.title}
              </h2>
              <p className="font-body text-muted-foreground">
                {journey.intro}
              </p>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto">
              {/* Desktop: Horizontal */}
              <div className="hidden md:block relative">
                {/* Connecting line */}
                <div className="absolute top-7 left-0 right-0 h-0.5 bg-sage-200" />

                <div className="flex justify-between">
                  {journey.steps.map((step, index) => (
                    <div key={index} className="flex-1 text-center px-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 font-heading text-2xl text-white ${
                          index === 1
                            ? "bg-terracotta-500"
                            : index === 2
                            ? "bg-sage-600"
                            : "bg-sage-500"
                        }`}
                      >
                        {step.number}
                      </div>
                      <h3 className="font-heading text-xl font-medium text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: Vertical */}
              <div className="md:hidden space-y-8">
                {journey.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-heading text-xl text-white ${
                        index === 1
                          ? "bg-terracotta-500"
                          : index === 2
                          ? "bg-sage-600"
                          : "bg-sage-500"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-sage-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-cream-50 mb-6">
              {cta.headline}
            </h2>
            <Button variant="hero" size="xl" asChild>
              <Link href={cta.buttonLink}>{cta.buttonText}</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
