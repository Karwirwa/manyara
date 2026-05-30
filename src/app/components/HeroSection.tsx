import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden manyara-bg">
      {/* Background texture and ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-25 bg-gradient-to-br from-transparent via-[#F5F5DC]/3 to-transparent kenyan-pattern"></div>
        
        {/* Ambient light effects matching MANYARA palette */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#800020]/12 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#556B2F]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#F5F5DC]/8 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center space-y-8 sm:space-y-12 px-4 sm:px-6">
        {/* Central glass morphic panel */}
        <div className="relative group w-full max-w-4xl">
          {/* Glow effect behind panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5DC]/20 via-[#F5F5DC]/30 to-[#F5F5DC]/20 rounded-3xl blur-xl scale-110 opacity-60 group-hover:opacity-80 transition-all duration-700"></div>

          {/* Main glass panel */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 manyara-gradient rounded-2xl sm:rounded-3xl opacity-25"></div>

            {/* Content */}
            <div className="relative text-center space-y-4 sm:space-y-6">
              {/* MANYARA logotype - elegant serif with responsive sizing */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#FFFFF0] tracking-[0.1em] relative" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}>
                MANYARA
                {/* Text glow */}
                <span className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#FFFFF0]/30 blur-sm" style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 300 }}>MANYARA</span>
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#FFFFF0]/80 font-thin tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                Kenyan Luxury Redefined
              </p>

              {/* Decorative line */}
              <div className="w-20 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#800020]/60 to-transparent mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Floating Shop Now button */}
        <div className="relative">
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-[#800020]/30 rounded-full blur-lg scale-110 opacity-60 animate-pulse"></div>

          <Button
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative bg-gradient-to-r from-[#800020] to-[#800020]/80 hover:from-[#800020]/90 hover:to-[#800020] text-[#FFFFF0] px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full border border-[#800020]/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#800020]/25 tracking-wide text-sm sm:text-base"
          >
            Explore Collection
          </Button>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-[#800020]/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-1 h-1 bg-[#556B2F]/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-[#F5F5DC]/30 rounded-full animate-pulse delay-500"></div>
      </div>
    </section>
  );
}
