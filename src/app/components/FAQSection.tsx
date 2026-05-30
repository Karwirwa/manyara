import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Shield, Truck, CreditCard, Package, Users, AlertCircle } from "lucide-react";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Ordering & Payment",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept M-Pesa (Till 7121042), Bank Transfer (Equity Bank), and PayPal for international customers. Payment is required before shipping to ensure secure transactions."
        },
        {
          question: "Is M-Pesa payment secure?",
          answer: "Yes! M-Pesa payments are processed through Safaricom's secure gateway. You'll receive a prompt on your registered mobile number and enter your M-Pesa PIN to complete the transaction."
        },
        {
          question: "Do you accept PayPal?",
          answer: "Yes, we accept PayPal for both local and international customers. PayPal offers buyer protection and secure payment processing worldwide."
        },
        {
          question: "How do I know my order went through?",
          answer: "You'll receive an SMS and email confirmation immediately after successful payment, including your order number and expected delivery date."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      icon: Truck,
      questions: [
        {
          question: "Where do you source your lingerie?",
          answer: "All our pieces are premium imported lingerie, carefully curated from the world's finest manufacturers. We select only the highest quality pieces that meet our strict standards for luxury, comfort, and elegance."
        },
        {
          question: "Is packaging discreet?",
          answer: "Absolutely! All orders are packaged in plain, unmarked boxes with only your address and our return address. No product details or MANYARA branding is visible on the outside packaging. Inside, items are beautifully wrapped in our signature tissue paper."
        },
        {
          question: "How long does delivery take?",
          answer: "Delivery times vary by location: Nairobi (1-2 business days), major cities like Mombasa, Kisumu, Nakuru (2-3 business days), and remote areas (3-5 business days). Orders placed before 2 PM are processed the same day."
        },
        {
          question: "Do you deliver nationwide?",
          answer: "Yes! We deliver to all 47 counties in Kenya. We use reliable courier services including G4S, Wells Fargo, and local partners to ensure your order reaches you safely."
        },
        {
          question: "Can I track my order?",
          answer: "Yes, you'll receive a tracking number via SMS once your order ships. You can track your package online or call our customer service for updates."
        },
        {
          question: "What if I'm not home during delivery?",
          answer: "Our courier partners will call you before delivery. If you're not available, they can deliver to a trusted neighbor or hold the package at their local office for pickup."
        }
      ]
    },
    {
      category: "Products & Sizing",
      icon: Package,
      questions: [
        {
          question: "How do I choose the right size?",
          answer: "We have a detailed size guide with measurements in both international and local sizes. If you're unsure, contact our customer service team for personalized sizing assistance. Remember, due to our no-returns policy, accurate sizing is crucial."
        },
        {
          question: "Are the colors accurate?",
          answer: "We photograph all products in natural light to show true colors. However, colors may vary slightly due to monitor settings. If you're concerned about a specific color, contact us for additional photos."
        },
        {
          question: "What materials do you use?",
          answer: "We use premium materials including silk, lace, satin, microfiber, and cotton. Each product description includes detailed material information and care instructions."
        },
        {
          question: "Do you have plus sizes?",
          answer: "Yes! We cater to all body types with sizes ranging from XS to 3XL in most categories. Our shapewear collection is particularly popular among plus-size customers."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: AlertCircle,
      questions: [
        {
          question: "Can I return or exchange items?",
          answer: "Due to the intimate nature of lingerie and for hygiene reasons, we have a strict NO RETURNS, NO EXCHANGES, and NO REFUNDS policy. This is standard in the lingerie industry and helps us maintain the highest hygiene standards."
        },
        {
          question: "What if there's a manufacturing defect?",
          answer: "We will accept returns only for manufacturing defects or if you receive a completely different item than ordered. Such claims must be reported within 24 hours of delivery with photographic evidence."
        },
        {
          question: "What if the item doesn't fit?",
          answer: "Unfortunately, sizing issues are not grounds for returns. This is why we encourage customers to carefully review our size guide and contact us for sizing assistance before ordering."
        },
        {
          question: "Why don't you accept returns?",
          answer: "Lingerie is intimate apparel that comes into direct contact with the body. For health, hygiene, and safety reasons, we cannot resell returned intimate items. This policy is standard across the lingerie industry globally."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      questions: [
        {
          question: "Is my personal information safe?",
          answer: "Yes! We use SSL encryption for all transactions and never store payment information on our servers. Your data is protected according to international privacy standards and Kenyan data protection laws."
        },
        {
          question: "Will anyone know what I ordered?",
          answer: "Your privacy is paramount. Orders are shipped in completely discreet packaging, and we never share customer information with third parties for marketing purposes."
        },
        {
          question: "Do you send marketing emails?",
          answer: "Only if you opt-in during checkout. You can unsubscribe at any time. We respect your privacy and only send relevant updates about new collections and exclusive offers."
        }
      ]
    },
    {
      category: "Customer Service",
      icon: Users,
      questions: [
        {
          question: "How can I contact customer service?",
          answer: "You can reach us via phone (+254 797 040 512), email (rispahkarwirwa@gmail.com), WhatsApp, or visit our boutique in Westlands, Nairobi. Our customer service hours are Monday-Friday 10 AM-8 PM, Saturday 10 AM-6 PM, and Sunday 12 PM-5 PM."
        },
        {
          question: "Do you offer fitting consultations?",
          answer: "Yes! We offer private fitting consultations at our Nairobi boutique. Perfect for bridal lingerie, special occasions, or if you need personalized sizing assistance. Book an appointment through our website or by calling us."
        },
        {
          question: "Can I visit your physical store?",
          answer: "Absolutely! Our boutique is located at Westlands Square, Ring Road, Nairobi, Ground Floor, Suite 12. You can see products in person, get fitted, and receive personalized styling advice from our expert team."
        }
      ]
    }
  ];

  return (
    <section id="faq" className="relative min-h-screen manyara-bg overflow-hidden">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-[#800020]/6 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#556B2F]/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-3/4 w-64 h-64 bg-[#F5F5DC]/6 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {/* Header section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#556B2F]/10 mb-4 sm:mb-5 md:mb-6">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#556B2F]" />
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative mb-6 sm:mb-8"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            Frequently Asked Questions
            <span
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              Frequently Asked Questions
            </span>
          </h1>

          <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#556B2F]/60 to-transparent mx-auto mb-6 sm:mb-8"></div>

          <p className="text-[#FFFFF0]/70 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg px-4">
            Find answers to common questions about ordering, sizing, delivery, and our policies.
            Can't find what you're looking for? Contact our customer service team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative">
              {/* Category header */}
              <div className="glass-panel rounded-2xl p-6 mb-4">
                <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#800020]/20">
                    <category.icon className="w-6 h-6 text-[#800020]" />
                  </div>
                  <h2 
                    className="text-2xl text-[#FFFFF0]/90"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {category.category}
                  </h2>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemIndex = categoryIndex * 10 + questionIndex; // Unique index
                  const isOpen = openItems.includes(itemIndex);
                  
                  return (
                    <div key={questionIndex} className="glass-panel rounded-xl overflow-hidden">
                      <div className="absolute inset-0 manyara-gradient rounded-xl opacity-10"></div>
                      
                      <div className="relative">
                        {/* Question */}
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F5F5DC]/5 transition-all duration-300"
                        >
                          <h3 className="text-[#FFFFF0]/90 pr-4 flex-1">{faq.question}</h3>
                          <div className="flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-[#800020]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#800020]" />
                            )}
                          </div>
                        </button>
                        
                        {/* Answer */}
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <div className="border-t border-[#F5F5DC]/10 pt-4">
                              <p className="text-[#FFFFF0]/80 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <h3 
                className="text-2xl text-[#FFFFF0]/90 mb-4"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Still Have Questions?
              </h3>
              
              <p className="text-[#FFFFF0]/70 mb-6">
                Our customer service team is here to help you find the perfect fit and answer any questions about MANYARA lingerie.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+254797040512"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#556B2F] to-[#556B2F]/80 hover:from-[#556B2F]/90 hover:to-[#556B2F] text-[#FFFFF0] rounded-full transition-all duration-300 hover:scale-105"
                >
                  Call Us: +254 797 040 512
                </a>
                
                <a 
                  href="mailto:rispahkarwirwa@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] rounded-full transition-all duration-300 hover:scale-105"
                >
                  Email: rispahkarwirwa@gmail.com
                </a>
              </div>
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