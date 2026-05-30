import { useState } from 'react';
import { X, Shield, FileText, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'contact';
}

export function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'contact'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/10 via-[#F5F5DC]/5 to-transparent rounded-3xl blur-xl scale-105"></div>
        
        {/* Main modal content */}
        <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Inner gradient glow */}
          <div className="absolute inset-0 manyara-gradient rounded-3xl opacity-20"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-[#F5F5DC]/10">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'privacy'
                      ? 'bg-[#800020]/20 text-[#FFFFF0]'
                      : 'text-[#FFFFF0]/70 hover:text-[#FFFFF0] hover:bg-[#F5F5DC]/10'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'terms'
                      ? 'bg-[#556B2F]/20 text-[#FFFFF0]'
                      : 'text-[#FFFFF0]/70 hover:text-[#FFFFF0] hover:bg-[#F5F5DC]/10'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Terms & Conditions</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'contact'
                      ? 'bg-[#800020]/20 text-[#FFFFF0]'
                      : 'text-[#FFFFF0]/70 hover:text-[#FFFFF0] hover:bg-[#F5F5DC]/10'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Us</span>
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#F5F5DC]/10 hover:bg-[#F5F5DC]/20 transition-all duration-300"
              >
                <X className="w-5 h-5 text-[#FFFFF0]/70" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 
                    className="text-3xl text-[#FFFFF0] mb-6"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Privacy Policy
                  </h2>
                  
                  <div className="space-y-4 text-[#FFFFF0]/80">
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">Information We Collect</h3>
                      <p>When you shop with MANYARA, we collect your name, email, phone number, billing and shipping addresses, and payment information to process your orders and provide excellent service.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">How We Use Your Information</h3>
                      <ul className="space-y-1 ml-4">
                        <li>• Process and fulfill your orders</li>
                        <li>• Provide customer support</li>
                        <li>• Send order confirmations and updates</li>
                        <li>• Improve our products and services</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">Data Protection</h3>
                      <p>We implement industry-standard security measures including SSL encryption for all transactions. Your payment information is processed through secure, PCI-compliant payment processors and is never stored on our servers.</p>
                    </div>
                    
                    <div className="bg-[#800020]/10 rounded-xl p-4">
                      <h3 className="text-[#FFFFF0] text-lg mb-2">Your Rights</h3>
                      <p>You have the right to access, correct, delete your personal information, and opt-out of marketing communications. Contact us at privacy@manyara.co.ke for any privacy-related requests.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <h2 
                    className="text-3xl text-[#FFFFF0] mb-6"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Terms & Conditions
                  </h2>
                  
                  <div className="space-y-4 text-[#FFFFF0]/80">
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">General Terms</h3>
                      <p>By using MANYARA's services, you agree to these terms. We reserve the right to modify these terms at any time, with changes effective immediately upon posting.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">Product & Ordering</h3>
                      <p>All products are subject to availability. We reserve the right to refuse or cancel any order. Please review our size guide carefully before ordering.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-[#FFFFF0] text-lg mb-2">Payment & Shipping</h3>
                      <ul className="space-y-1 ml-4">
                        <li>• Payment required in full before processing</li>
                        <li>• Nairobi: 1-2 business days delivery</li>
                        <li>• Major cities: 2-3 business days</li>
                        <li>• Remote areas: 3-5 business days</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#800020]/20 rounded-xl p-4 border border-[#800020]/30">
                      <h3 className="text-[#FFFFF0] text-lg mb-2 flex items-center">
                        <span className="text-red-400 mr-2">⚠️</span>
                        No Returns Policy
                      </h3>
                      <p className="text-[#FFFFF0]">
                        <strong>Due to the intimate nature of lingerie, we operate a strict NO RETURNS, NO EXCHANGES, and NO REFUNDS policy.</strong> This is for health and hygiene reasons. By completing your purchase, you accept this policy.
                      </p>
                      <p className="mt-2 text-sm">
                        Exception: Manufacturing defects or wrong items delivered (must be reported within 24 hours with photo evidence).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 
                    className="text-3xl text-[#FFFFF0] mb-6"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    Contact Us
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="space-y-4">
                      <h3 className="text-[#FFFFF0]/90 text-lg mb-4">Send us a Message</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#FFFFF0]/70 text-sm block mb-2">First Name *</label>
                          <Input 
                            className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label className="text-[#FFFFF0]/70 text-sm block mb-2">Last Name *</label>
                          <Input 
                            className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[#FFFFF0]/70 text-sm block mb-2">Email *</label>
                        <Input 
                          type="email"
                          className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[#FFFFF0]/70 text-sm block mb-2">Phone</label>
                        <Input 
                          type="tel"
                          className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl"
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[#FFFFF0]/70 text-sm block mb-2">Message *</label>
                        <Textarea 
                          className="bg-[#F5F5DC]/5 border-[#F5F5DC]/20 text-[#FFFFF0] placeholder:text-[#FFFFF0]/40 focus:border-[#800020]/50 rounded-xl min-h-[100px]"
                          placeholder="How can we help you?"
                        />
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] border-0 rounded-full py-3 transition-all duration-300 hover:scale-105">
                        Send Message
                      </Button>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-6">
                      <h3 className="text-[#FFFFF0]/90 text-lg mb-4">Get in Touch</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-[#800020] mt-0.5" />
                          <div>
                            <p className="text-[#FFFFF0]/90 font-medium">Visit Our Boutique</p>
                            <p className="text-[#FFFFF0]/70 text-sm">
                              Westlands Square, Ring Road<br />
                              Nairobi, Kenya<br />
                              Ground Floor, Suite 12
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-[#556B2F]" />
                          <div>
                            <p className="text-[#FFFFF0]/90 font-medium">Call Us</p>
                            <p className="text-[#FFFFF0]/70">+254 711 234 567</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-[#800020]" />
                          <div>
                            <p className="text-[#FFFFF0]/90 font-medium">Email Us</p>
                            <p className="text-[#FFFFF0]/70">rispahkarwirwa@gmail.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#556B2F]/10 rounded-xl p-4">
                        <h4 className="text-[#FFFFF0]/90 font-medium mb-2">Business Hours</h4>
                        <div className="text-[#FFFFF0]/70 text-sm space-y-1">
                          <p>Monday - Friday: 10:00 AM - 8:00 PM</p>
                          <p>Saturday: 10:00 AM - 6:00 PM</p>
                          <p>Sunday: 12:00 PM - 5:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(245, 245, 220, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 0, 32, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 0, 32, 0.5);
        }
      `}</style>
    </div>
  );
}
