import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Grace Wanjiku",
      location: "Nairobi",
      rating: 5,
      text: "MANYARA pieces are absolutely stunning! The quality is exceptional and the fit is perfect. I ordered the Emerald Enchantment set and it exceeded my expectations. Discreet packaging and fast delivery to Westlands.",
      product: "Emerald Enchantment Set",
      verified: true
    },
    {
      id: 2,
      name: "Faith Nyambura",
      location: "Mombasa",
      rating: 5,
      text: "Finally, luxury lingerie made for us! The Pearl Goddess Corset for my wedding was breathtaking. The customer service team helped me with sizing and it was worth every shilling. No regrets!",
      product: "Pearl Goddess Corset",
      verified: true
    },
    {
      id: 3,
      name: "Mercy Akinyi",
      location: "Kisumu",
      rating: 5,
      text: "I was hesitant about ordering online, but MANYARA's size guide was accurate and the M-Pesa payment was seamless. The Silk Dreams Gown arrived in 2 days in beautiful packaging. Highly recommend!",
      product: "Silk Dreams Gown",
      verified: true
    },
    {
      id: 4,
      name: "Catherine Mutua",
      location: "Nakuru",
      rating: 5,
      text: "The Victorian Romance corset is a work of art! The craftsmanship is incredible and you can tell it's made with love. The burgundy color is exactly as shown. MANYARA understands what Kenyan women want.",
      product: "Victorian Romance Corset",
      verified: true
    },
    {
      id: 5,
      name: "Sarah Wambui",
      location: "Eldoret",
      rating: 5,
      text: "Ordered for my honeymoon and couldn't be happier! The Tropical Breeze Set is gorgeous and the fit is amazing. Delivery was discrete and professional. Already planning my next order!",
      product: "Tropical Breeze Set",
      verified: true
    },
    {
      id: 6,
      name: "Linda Chebet",
      location: "Thika",
      rating: 5,
      text: "MANYARA has changed my confidence completely! The Silhouette Sculptor does exactly what it promises. The quality justifies the price and the customer service is top-notch. Proud to support a Kenyan brand!",
      product: "Silhouette Sculptor",
      verified: true
    }
  ];

  return (
    <section id="testimonials" className="relative min-h-screen manyara-bg overflow-hidden">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-[#800020]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#556B2F]/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-3/4 w-64 h-64 bg-[#F5F5DC]/8 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {/* Header section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0] tracking-[0.05em] leading-[0.9] relative mb-6 sm:mb-8"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
          >
            What Our Customers Say
            <span
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFF0]/20 blur-sm"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
            >
              What Our Customers Say
            </span>
          </h1>

          <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#800020]/60 to-transparent mx-auto mb-6 sm:mb-8"></div>

          <p className="text-[#FFFFF0]/70 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg px-4">
            Real experiences from Kenyan women who love MANYARA lingerie.
            Join thousands of satisfied customers across Kenya.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative group">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5DC]/10 via-[#F5F5DC]/5 to-transparent rounded-2xl blur-xl scale-105 opacity-60 group-hover:opacity-80 transition-all duration-700"></div>
              
              {/* Testimonial card */}
              <div className="relative glass-panel rounded-2xl p-6 h-full transition-all duration-300 hover:scale-105">
                {/* Inner gradient */}
                <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
                
                <div className="relative">
                  {/* Quote icon */}
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="w-8 h-8 text-[#800020]/60" />
                    {testimonial.verified && (
                      <span className="text-xs text-[#00A651] bg-[#00A651]/10 px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  {/* Star rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-[#FFFFF0]/80 mb-6 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Product purchased */}
                  <div className="mb-4 p-3 bg-[#800020]/10 rounded-xl">
                    <p className="text-[#FFFFF0]/60 text-xs">Purchased:</p>
                    <p className="text-[#FFFFF0]/90 text-sm font-medium">{testimonial.product}</p>
                  </div>
                  
                  {/* Customer info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800020]/30 to-[#556B2F]/30 flex items-center justify-center">
                      <span 
                        className="text-[#FFFFF0] font-medium"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                      >
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#FFFFF0]/90 font-medium text-sm">{testimonial.name}</p>
                      <p className="text-[#FFFFF0]/60 text-xs">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="glass-panel rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-15"></div>
            <div className="relative">
              <h3 
                className="text-2xl text-[#FFFFF0]/90 mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Trusted by Kenyan Women
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl text-[#800020] mb-2">2,500+</div>
                  <p className="text-[#FFFFF0]/70">Happy Customers</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl text-[#800020] mb-2">4.9★</div>
                  <p className="text-[#FFFFF0]/70">Average Rating</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl text-[#800020] mb-2">47</div>
                  <p className="text-[#FFFFF0]/70">Counties Served</p>
                </div>
              </div>
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
