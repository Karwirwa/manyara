import { FileText, ShoppingBag, CreditCard, Truck, AlertCircle, Scale } from "lucide-react";
import { Button } from "./ui/button";

export function TermsAndConditions() {
  return (
    <section id="terms" className="relative min-h-screen manyara-bg overflow-hidden">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#556B2F]/10 mb-6">
            <FileText className="w-8 h-8 text-[#556B2F]" />
          </div>
          
          <h1 
            className="text-5xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative mb-6"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            Terms & Conditions
            <span 
              className="absolute inset-0 text-5xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              Terms & Conditions
            </span>
          </h1>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#556B2F]/60 to-transparent mx-auto mb-6"></div>
          
          <p className="text-[#FFFFF0]/70 max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using MANYARA's services or making a purchase.
          </p>
          
          <p className="text-[#FFFFF0]/50 text-sm mt-4">
            Last updated: January 2024
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          
          {/* General Terms */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <Scale className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  General Terms
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <p>
                  By accessing and using the MANYARA website and services, you agree to be bound by these Terms and Conditions. 
                  If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  MANYARA is a luxury lingerie brand based in Kenya, specializing in intimate apparel designed for the modern, sophisticated woman. 
                  Our products are available for purchase online and at our Nairobi boutique.
                </p>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. 
                  Your continued use of our services constitutes acceptance of the revised terms.
                </p>
              </div>
            </div>
          </div>

          {/* Ordering and Products */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#556B2F]/20">
                  <ShoppingBag className="w-6 h-6 text-[#556B2F]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Ordering & Products
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Product Information</h3>
                  <p>We strive to display our products as accurately as possible. However, colors may vary slightly due to monitor settings and lighting conditions.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Availability</h3>
                  <p>All products are subject to availability. We reserve the right to discontinue any product without notice. In case of unavailability, we will contact you promptly.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Order Acceptance</h3>
                  <p>We reserve the right to refuse or cancel any order at our discretion, including orders that appear fraudulent or violate these terms.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Sizing</h3>
                  <p>Please refer to our detailed size guide before ordering. Due to the intimate nature of our products, sizing accuracy is crucial for your satisfaction.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/20">
                  <CreditCard className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Payment Terms
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <p>
                  We accept multiple payment methods including M-Pesa, Visa, Mastercard, and bank transfers. All prices are in Kenyan Shillings (KSh) unless otherwise stated.
                </p>
                <p>
                  Payment is required in full before order processing. For M-Pesa payments, you will receive a prompt on your registered mobile number. 
                  Credit card payments are processed securely through our PCI-compliant payment gateway.
                </p>
                <p>
                  In case of payment failure or declined transactions, your order will be held for 24 hours before automatic cancellation.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#556B2F]/20">
                  <Truck className="w-6 h-6 text-[#556B2F]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Shipping & Delivery
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/70">
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Delivery Areas</h3>
                  <p>We deliver throughout Kenya. Delivery times may vary based on location, with Nairobi and major cities receiving priority delivery.</p>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Delivery Times</h3>
                  <ul className="space-y-1 ml-4">
                    <li>• Nairobi: 1-2 business days</li>
                    <li>• Major cities: 2-3 business days</li>
                    <li>• Remote areas: 3-5 business days</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-[#FFFFF0]/80 mb-2">Packaging</h3>
                  <p>All orders are packaged discreetly in branded MANYARA packaging. Premium gift wrapping is available for an additional KSh 250.</p>
                </div>
              </div>
            </div>
          </div>

          {/* No Returns Policy - HIGHLIGHTED */}
          <div className="glass-panel rounded-2xl p-8 border-2 border-[#800020]/30">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-[#800020]/30">
                  <AlertCircle className="w-6 h-6 text-[#800020]" />
                </div>
                <h2 
                  className="text-2xl text-[#FFFFF0]/90"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  No Returns Policy - Important Notice
                </h2>
              </div>
              
              <div className="space-y-4 text-[#FFFFF0]/80 bg-[#800020]/10 rounded-xl p-6">
                <div className="text-center mb-4">
                  <p className="text-[#FFFFF0] text-lg font-medium">
                    PLEASE READ CAREFULLY BEFORE ORDERING
                  </p>
                </div>
                
                <p className="text-[#FFFFF0]/90">
                  <strong>Due to the intimate and hygienic nature of lingerie products, MANYARA operates a strict NO RETURNS, NO EXCHANGES, and NO REFUNDS policy.</strong>
                </p>
                
                <div className="space-y-3 text-[#FFFFF0]/80">
                  <p>This policy is in place for health and hygiene reasons and is standard practice in the lingerie industry. Once an order is placed and delivered, it cannot be returned, exchanged, or refunded under any circumstances.</p>
                  
                  <p><strong>Before placing your order, please:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Carefully review our detailed size guide</li>
                    <li>• Check product descriptions and materials</li>
                    <li>• Verify your shipping address</li>
                    <li>• Contact our customer service for sizing assistance if needed</li>
                  </ul>
                  
                  <p>
                    <strong>Exception:</strong> We will only accept returns in the rare case of manufacturing defects or if you receive a completely different item than ordered. Such claims must be reported within 24 hours of delivery with photographic evidence.
                  </p>
                </div>
                
                <div className="text-center pt-4 border-t border-[#FFFFF0]/20">
                  <p className="text-[#FFFFF0]/90">
                    By completing your purchase, you acknowledge and accept this no returns policy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <h2 
                className="text-2xl text-[#FFFFF0]/90 mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Privacy & Data Protection
              </h2>
              
              <div className="text-[#FFFFF0]/70 space-y-4">
                <p>
                  Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, 
                  which forms part of these Terms and Conditions.
                </p>
                <p>
                  We are committed to protecting your personal data in accordance with Kenyan data protection laws and international best practices.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <h2 
                className="text-2xl text-[#FFFFF0]/90 mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Limitation of Liability
              </h2>
              
              <div className="text-[#FFFFF0]/70 space-y-4">
                <p>
                  MANYARA's liability is limited to the purchase price of the product. We are not liable for any indirect, 
                  incidental, or consequential damages arising from the use of our products or services.
                </p>
                <p>
                  This limitation applies to the fullest extent permitted by Kenyan law.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="glass-panel rounded-2xl p-8">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <h2 
                className="text-2xl text-[#FFFFF0]/90 mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Governing Law
              </h2>
              
              <div className="text-[#FFFFF0]/70 space-y-4">
                <p>
                  These Terms and Conditions are governed by the laws of Kenya. Any disputes arising from these terms 
                  will be subject to the exclusive jurisdiction of Kenyan courts.
                </p>
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
                Questions About These Terms?
              </h2>
              
              <p className="text-[#FFFFF0]/70 mb-6">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              
              <div className="space-y-2 text-[#FFFFF0]/70 mb-8">
                <p>Email: legal@manyara.co.ke</p>
                <p>Phone: +254 711 234 567</p>
                <p>Address: Westlands Square, Ring Road, Nairobi, Kenya</p>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-[#556B2F] to-[#556B2F]/80 hover:from-[#556B2F]/90 hover:to-[#556B2F] text-[#FFFFF0] border-0 rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#556B2F]/25 tracking-wide"
              >
                Contact Legal Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/12 w-2 h-2 bg-[#556B2F]/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/12 w-1.5 h-1.5 bg-[#800020]/40 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#F5F5DC]/30 rounded-full animate-pulse delay-1000"></div>
    </section>
  );
}