'use client'

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Service {
  _id?: string;
  name: string;
  price: string;
}

interface BookData {
  eyebrow?: string;
  headline?: string;
  description?: string;
}

interface BookProps {
  data?: BookData;
  services?: Service[];
  siteSettings?: any;
  footerSettings?: any;
}

// Fallback services
const fallbackServices = [
  { name: "30 Minute Session", price: "$60" },
  { name: "60 Minute Session", price: "$100" },
  { name: "90 Minute Session", price: "$145" },
];

const Book = ({ data, services, siteSettings, footerSettings }: BookProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const eyebrow = data?.eyebrow || "Schedule Your Visit";
  const headline = data?.headline || "Book an Appointment";
  const description = data?.description || "Fill out the form below and I'll get back to you within 24 hours to confirm your booking.";

  const displayServices = services && services.length > 0 ? services : fallbackServices;
  const serviceOptions = displayServices.map(s => `${s.name} - ${s.price}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request submitted!", {
      description: "I'll contact you shortly to confirm your appointment.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
            <h1 className="font-heading text-5xl md:text-6xl font-medium text-foreground mb-6">
              {headline}
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto text-xl">
              {description}
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <Card className="border-border bg-card shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="font-heading text-3xl text-center text-foreground">
                  Booking Request Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-body flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service" className="font-body">
                        Select Service
                      </Label>
                      <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose a service" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {serviceOptions.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="font-body flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Preferred Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={(e) => handleChange("preferredDate", e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="font-body flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Preferred Time
                      </Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                          <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                          <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                          <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                          <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                          <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                          <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                          <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                          <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-body flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Any special requests, health conditions, or areas of focus..."
                      rows={4}
                      className="bg-background resize-none"
                    />
                  </div>

                  <Button type="submit" variant="hero" size="xl" className="w-full">
                    Submit Booking Request
                  </Button>

                  <p className="font-body text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our{" "}
                    <Link href="/policies" className="text-primary hover:underline">
                      booking and cancellation policies
                    </Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="font-body text-muted-foreground mb-2">
              Prefer to book by phone?
            </p>
            <a href={`tel:${siteSettings?.phone?.replace(/\D/g, '') || "+15551234567"}`} className="font-heading text-3xl text-primary hover:underline">
              {siteSettings?.phone || "(555) 123-4567"}
            </a>
          </div>
        </section>
      </main>

      <Footer siteSettings={siteSettings} footerSettings={footerSettings} />
    </div>
  );
};

export default Book;
