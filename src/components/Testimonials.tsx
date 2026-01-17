interface Testimonial {
  _id: string;
  authorName: string;
  authorLocation?: string;
  quote: string;
}

interface TestimonialsProps {
  data?: {
    testimonialsEyebrow?: string;
    testimonialsTitle?: string;
    testimonialsSubtitle?: string;
  };
  testimonials?: Testimonial[];
}

// Generate initials from author name (e.g., "Sarah M." -> "SM")
function getInitials(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Testimonials = ({ data, testimonials }: TestimonialsProps) => {
  const eyebrow = data?.testimonialsEyebrow || 'Kind Words';
  const title = data?.testimonialsTitle || 'What Clients Say';
  const subtitle = data?.testimonialsSubtitle || 'Real experiences from people who\'ve found relief and relaxation';

  // Don't render if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-eyebrow text-primary mb-4">{eyebrow}</p>
          <h2 className="text-section-title font-heading text-secondary-foreground mb-4">
            {title}
          </h2>
          <p className="text-body text-muted-foreground max-w-lg mx-auto">
            {subtitle}
          </p>
        </header>

        {/* 2-Up Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial._id}
              className="bg-background border border-border rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Quote Icon */}
              <svg
                className="w-6 h-6 text-terracotta opacity-60 mb-3 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Quote Text */}
              <p className="font-heading text-base italic text-secondary-foreground leading-relaxed mb-4 flex-grow line-clamp-4">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center font-heading font-medium text-primary text-sm flex-shrink-0">
                  {getInitials(testimonial.authorName)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-primary text-sm truncate">
                    {testimonial.authorName}
                  </span>
                  {testimonial.authorLocation && (
                    <span className="text-xs text-muted-foreground truncate">
                      {testimonial.authorLocation}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
