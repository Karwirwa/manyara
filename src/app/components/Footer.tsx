import { Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative manyara-bg border-t border-[#F5F5DC]/10">
      {/* Background texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#800020]/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#556B2F]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">

          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div>
              <h3
                className="text-xl sm:text-2xl text-[#FFFFF0] tracking-[0.15em] mb-3 sm:mb-4"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                MANYARA
              </h3>
              <p className="text-[#FFFFF0]/70 leading-relaxed text-sm sm:text-base">
                Luxury lingerie crafted in Kenya, celebrating the confident, sophisticated woman through heritage and contemporary elegance.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://www.instagram.com/manyara_intimates/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#800020]/10 hover:bg-[#800020]/20 transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFF0]/70 group-hover:text-[#FFFFF0]" />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61574430731029"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#800020]/10 hover:bg-[#800020]/20 transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFF0]/70 group-hover:text-[#FFFFF0]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h4
              className="text-[#FFFFF0]/90 text-base sm:text-lg tracking-wide"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#collections" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Collections
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#testimonials" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a 
                  href="#faq" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h4 
              className="text-[#FFFFF0]/90 text-lg tracking-wide"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Customer Service
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#faq" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#size-guide" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a 
                  href="#care-instructions" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Care Instructions
                </a>
              </li>
              <li>
                <a 
                  href="#shipping" 
                  className="text-[#FFFFF0]/70 hover:text-[#FFFFF0] transition-colors duration-300"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <span className="text-[#FFFFF0]/70">
                  No Returns Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 
              className="text-[#FFFFF0]/90 text-lg tracking-wide"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#800020] mt-0.5 flex-shrink-0" />
                <div className="text-[#FFFFF0]/70 text-sm">
                  <p>Nairobi, Kenya</p>
                  <p>Discreet delivery nationwide</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#800020] flex-shrink-0" />
                <span className="text-[#FFFFF0]/70 text-sm">
                  Contact us via social media or at checkout
                </span>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="pt-4 border-t border-[#F5F5DC]/10">
              <p className="text-[#FFFFF0]/60 text-sm mb-2">Payment Methods</p>
              <div className="text-[#FFFFF0]/70 text-xs space-y-1">
                <p>M-Pesa: Till 7121042</p>
                <p>Bank Transfer</p>
                <p>PayPal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F5F5DC]/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-[#FFFFF0]/60 text-sm">
              © 2024 MANYARA. All rights reserved. Crafted with love in Kenya.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-[#FFFFF0]/60">
                Privacy & Legal details available at checkout
              </span>
              <span className="text-[#FFFFF0]/60">
                •
              </span>
              <span className="text-[#800020]">
                No Returns Policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute bottom-1/4 left-1/12 w-1.5 h-1.5 bg-[#800020]/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/6 w-1 h-1 bg-[#556B2F]/30 rounded-full animate-pulse delay-700"></div>
    </footer>
  );
}
