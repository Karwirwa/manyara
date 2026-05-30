import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactSocialIcons } from "./ContactSocialIcons";

export function ContactSection() {
  return (
    <section id="contact" className="relative min-h-screen manyara-bg overflow-hidden">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-[#800020]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#556B2F]/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-3/4 w-64 h-64 bg-[#F5F5DC]/8 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {/* Header section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative mb-6 sm:mb-8"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            Get in Touch
            <span
              className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              Get in Touch
            </span>
          </h1>

          <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#800020]/60 to-transparent mx-auto mb-6 sm:mb-8"></div>

          <p className="text-[#FFFFF0]/70 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 px-4">
            Experience the luxury of MANYARA lingerie. Visit our Nairobi boutique or reach out to discover
            how Kenyan craftsmanship meets contemporary elegance.
          </p>

          {/* Social Media Icons at the top */}
          <ContactSocialIcons />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
          {/* Contact Form */}
          <div className="relative">
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">
              {/* Inner gradient glow */}
              <div className="absolute inset-0 manyara-gradient rounded-3xl opacity-20"></div>
              
              <div className="relative space-y-6">
                <h2 
                  className="text-3xl text-[#FFFFF0]/90 mb-6"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                >
                  Send us a Message
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[#FFFFF0]/70 text-sm tracking-wide">First Name *</label>
                    <Input 
                      className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#FFFFF0]/70 text-sm tracking-wide">Last Name *</label>
                    <Input 
                      className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[#FFFFF0]/70 text-sm tracking-wide">Email Address *</label>
                  <Input 
                    type="email"
                    className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[#FFFFF0]/70 text-sm tracking-wide">Phone Number</label>
                  <Input 
                    type="tel"
                    className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[#FFFFF0]/70 text-sm tracking-wide">Nearest Town/City *</label>
                  <Input 
                    className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                    placeholder="e.g., Nairobi, Mombasa, Kisumu, Nakuru..."
                  />
                  <p className="text-[#FFFFF0]/50 text-xs">
                    Help us arrange convenient delivery or pickup options
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[#FFFFF0]/70 text-sm tracking-wide">Message *</label>
                  <Textarea 
                    className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl min-h-[120px] resize-none"
                    placeholder="Tell us about your interest in MANYARA, sizing questions, or any special requests..."
                  />
                </div>
                
                <div className="relative pt-4">
                  <div className="absolute inset-0 bg-[#800020]/20 rounded-full blur-sm scale-110"></div>
                  <Button 
                    className="relative w-full bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#800020]/25 tracking-wide"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Location */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
              <div className="relative flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <MapPin className="w-6 h-6 text-[#800020]" />
                </div>
                <div>
                  <h3 
                    className="text-[#FFFFF0]/90 mb-2 text-xl"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Boutique Location
                  </h3>
                  <p className="text-[#FFFFF0]/70 leading-relaxed">
                    Westlands Square, Ring Road<br />
                    Nairobi, Kenya<br />
                    Ground Floor, Suite 12
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
              <div className="relative space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-[#556B2F]/20">
                    <Phone className="w-6 h-6 text-[#556B2F]" />
                  </div>
                  <div>
                    <h3 
                      className="text-[#FFFFF0]/90 mb-2 text-xl"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      Phone
                    </h3>
                    <a href="tel:+254797040512" className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors">
                      +254 797 040 512
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-[#800020]/20">
                    <Mail className="w-6 h-6 text-[#800020]" />
                  </div>
                  <div>
                    <h3 
                      className="text-[#FFFFF0]/90 mb-2 text-xl"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      Email
                    </h3>
                    <a href="mailto:rispahkarwirwa@gmail.com" className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors">
                      rispahkarwirwa@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
              <div className="relative flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#556B2F]/20">
                  <Clock className="w-6 h-6 text-[#556B2F]" />
                </div>
                <div>
                  <h3 
                    className="text-[#FFFFF0]/90 mb-2 text-xl"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Business Hours
                  </h3>
                  <div className="text-[#FFFFF0]/70 space-y-1">
                    <p>Monday - Friday: 10:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: 12:00 PM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Appointments */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
              <div className="relative">
                <h3 
                  className="text-[#FFFFF0]/90 mb-4 text-xl"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Private Fittings
                </h3>
                <p className="text-[#FFFFF0]/70 mb-4 leading-relaxed">
                  Book an exclusive one-on-one fitting session with our expert stylists. 
                  Perfect for bridal, special occasions, or personalized consultations.
                </p>
                <Button 
                  variant="outline"
                  className="border-[#800020]/50 text-[#800020] hover:bg-[#800020]/10 hover:border-[#800020] rounded-full px-6"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 right-1/12 w-2 h-2 bg-[#800020]/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/12 w-1.5 h-1.5 bg-[#556B2F]/40 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#F5F5DC]/30 rounded-full animate-pulse delay-1000"></div>
      </div>
    </section>
  );
}