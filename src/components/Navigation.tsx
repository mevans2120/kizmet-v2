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
    { path: "/policies", label: "What to Know" },
    { path: "/services", label: "Services", highlight: true },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/65 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-body text-base tracking-wide transition-all duration-300 ${
                  link.highlight
                    ? `text-primary ${isActive(link.path) ? "font-semibold" : "font-medium"}`
                    : isActive(link.path)
                    ? "text-secondary-foreground font-semibold"
                    : "text-secondary-foreground hover:font-medium"
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
            className="md:hidden h-14 w-14 [&_svg]:size-10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div id="mobile-navigation" className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body text-base py-2 transition-all duration-300 ${
                    link.highlight
                      ? `text-primary ${isActive(link.path) ? "font-semibold" : "font-medium"}`
                      : isActive(link.path)
                      ? "text-secondary-foreground font-semibold"
                      : "text-secondary-foreground hover:font-medium"
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
