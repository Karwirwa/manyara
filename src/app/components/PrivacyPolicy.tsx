import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react";
import { Button } from "./ui/button";

export function PrivacyPolicy() {
  return (
    <section id="privacy" className="relative min-h-screen manyara-bg overflow-hidden">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-[#800020]/6 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#556B2F]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-3/4 w-64 h-64 bg-[#F5F5DC]/6 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#800020]/10 mb-6">
            <Shield className="w-8 h-8 text-[#800020]" />
          </div>
          
          <h1 
            className="text-5xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative mb-6"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            Privacy Policy
            <span 
              className="absolute inset-0 text-5xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              Privacy Policy
            </span>
          </h1>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#800020]/60 to-transparent mx-auto mb-6"></div>
          
          <p className="text-[#FFFFF0]/70 max-w-2xl mx-auto leading-relaxed">
            Your privacy is paramount to us. This policy outlines how MANYARA collects, uses, and protects your personal information.
          </p>
          
          <p className="text-[#FFFFF0]/50 text-sm mt-4">
            Last updated: January 2024
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          
          {/* Information We Collect */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <Eye className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Information We Collect
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Personal Information</h3>
                  <p>When you shop with MANYARA, we may collect your name, email address, phone number, billing and shipping addresses, and payment information.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Usage Information</h3>
                  <p>We collect information about how you interact with our website, including pages visited, products viewed, and purchase history to enhance your shopping experience.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Device Information</h3>
                  <p>We may collect information about your device, including IP address, browser type, and operating system for security and optimization purposes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#556B2F]/20">
                  <UserCheck className="w-6 h-6 text-[#556B2F]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  How We Use Your Information
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 text-[#FFFFF0]/70">
                <div>
                  <ul className="space-y-2">
                    <li>• Process and fulfill your orders</li>
                    <li>• Provide customer support and service</li>
                    <li>• Send order confirmations and updates</li>
                    <li>• Personalize your shopping experience</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li>• Improve our products and services</li>
                    <li>• Prevent fraud and ensure security</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Send promotional communications (with consent)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <Lock className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Data Protection & Security
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <p>
                  We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure storage of payment data.
                </p>
                <p>
                  Your payment information is processed through secure, PCI-compliant payment processors and is never stored on our servers. M-Pesa transactions are processed through Safaricom's secure gateway.
                </p>
                <p>
                  Access to your personal information is restricted to authorized personnel only, and we regularly review and update our security practices.
                </p>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#556B2F]/20">
                  <Globe className="w-6 h-6 text-[#556B2F]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Information Sharing
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <p>
                  MANYARA does not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>• With service providers who help us operate our business (shipping, payment processing)</li>
                  <li>• When required by law or to protect our rights</li>
                  <li>• In connection with a business transfer or merger</li>
                  <li>• With your explicit consent</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <Database className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Your Rights
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 text-[#FFFFF0]/70">
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">You have the right to:</h3>
                  <ul className="space-y-2">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Delete your account and data</li>
                    <li>• Opt-out of marketing communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Contact us to:</h3>
                  <ul className="space-y-2">
                    <li>• Request data portability</li>
                    <li>• Object to data processing</li>
                    <li>• File a privacy complaint</li>
                    <li>• Ask questions about this policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative text-center">
              <h2 
                className="text-2xl text-[#FFFFF0]/90 mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Questions About Privacy?
              </h2>
              
              <p className="text-[#FFFFF0]/70 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-2 text-[#FFFFF0]/70 mb-8">
                <p>Email: privacy@manyara.co.ke</p>
                <p>Phone: +254 711 234 567</p>
                <p>Address: Westlands Square, Ring Road, Nairobi, Kenya</p>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#800020]/25 tracking-wide"
              >
                Contact Privacy Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/12 w-2 h-2 bg-[#800020]/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/12 w-1.5 h-1.5 bg-[#556B2F]/40 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#F5F5DC]/30 rounded-full animate-pulse delay-1000"></div>
    </section>
  );
}