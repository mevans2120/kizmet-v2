'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  siteSettings?: {
    brandName?: string;
    tagline?: string;
  };
}

const Navigation = ({ siteSettings }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const brandName = siteSettings?.brandName || "Kizmet";
  const tagline = siteSettings?.tagline || "Massage and Wellness";

  const navLinks = [
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/policies", label: "Policies" },
    { path: "/book", label: "Book Now" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span
              className="font-heading text-2xl text-foreground"
              style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
            >
              <span className="text-3xl">K</span>izmet
            </span>
            <span
              className="font-heading text-2xl text-primary -mt-3"
              style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              <span className="text-3xl">M</span>assage
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-body text-base tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-base py-2 transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
