import { Button } from "./ui/button";

export function AboutUsPage() {
  return (
    <section id="about" className="relative min-h-screen manyara-bg overflow-hidden">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-[#F5F5DC]/2 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects matching MANYARA palette */}
        <div className="absolute top-1/4 right-1/6 w-96 h-96 bg-[#800020]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#556B2F]/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-3/4 w-64 h-64 bg-[#F5F5DC]/8 rounded-full blur-2xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 min-h-screen flex items-center">
        {/* Single panel layout - centered text content */}
        <div className="w-full">
          {/* Text Content */}
          <div className="relative group max-w-3xl mx-auto">
            {/* Glow effect behind panel */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#F5F5DC]/12 via-[#F5F5DC]/6 to-[#F5F5DC]/12 rounded-2xl sm:rounded-3xl blur-xl scale-105 opacity-50 group-hover:opacity-70 transition-all duration-700"></div>

            {/* Glass panel container */}
            <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
              {/* Inner gradient */}
              <div className="absolute inset-0 manyara-gradient rounded-2xl sm:rounded-3xl opacity-15"></div>

              {/* Content */}
              <div className="relative space-y-5 sm:space-y-6 md:space-y-8">
                {/* Headline */}
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl text-[#FFFFF0] tracking-[0.02em] leading-[1.1] relative"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                >
                  Our Kenyan Soul
                  {/* Text glow */}
                  <span
                    className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl text-[#FFFFF0]/25 blur-sm"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}
                  >
                    Our Kenyan Soul
                  </span>
                </h1>

                {/* Decorative line */}
                <div className="w-12 sm:w-14 md:w-16 h-px bg-gradient-to-r from-[#800020]/60 to-transparent"></div>

                {/* Body text */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-[#FFFFF0]/70 leading-relaxed text-sm sm:text-base">
                  <p className="font-light tracking-wide">
                    Born from the vibrant heart of Nairobi, MANYARA embodies the spirit of modern Kenya—where ancient traditions meet contemporary elegance. Our designs celebrate the confident, sophisticated woman who honors her heritage while embracing the future.
                  </p>

                  <p className="font-light tracking-wide">
                    Each piece in our collection features premium imported lingerie, carefully curated from the world's finest ateliers. From the rolling hills of the Great Rift Valley to the bustling energy of our capital, we bring you international luxury with discreet, local delivery across Kenya.
                  </p>

                  <p className="font-light tracking-wide">
                    We believe luxury is not just about the finest materials—it's about the connection between the woman who wears our pieces and the meticulous craftsmanship that creates them. Every item is selected with unwavering attention to quality, comfort, and timeless elegance.
                  </p>

                  <div className="glass-panel rounded-xl p-3 sm:p-4 mt-6 sm:mt-8 border border-[#F5F5DC]/20">
                    <p className="text-[#F5F5DC] text-xs sm:text-sm font-light tracking-wide text-center">
                      ✨ <span className="text-[#800020]">Premium Imported Lingerie</span> | Discreet Packaging | Nationwide Delivery ✨
                    </p>
                  </div>
                </div>

                {/* Discover Collection Button */}
                <div className="relative pt-4 sm:pt-6">
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-[#800020]/25 rounded-full blur-md scale-110"></div>

                  <Button className="relative bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full border border-[#800020]/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#800020]/30 tracking-wide text-sm sm:text-base">
                    Discover Our Collection
                  </Button>
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