import { MessageCircle } from "lucide-react";

export function SocialMediaIcons() {
  return (
    <>
      {/* WhatsApp Floating Button - Glassmorphic Style */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/254797040512?text=Hello%20MANYARA,%20I'm%20interested%20in%20your%20lingerie%20collection"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/10 via-[#25D366]/5 to-transparent rounded-full blur-xl scale-110"></div>
          
          {/* Main button - Glassmorphic style */}
          <div className="relative w-14 h-14 glass-card rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-2xl group-hover:shadow-[#25D366]/25">
            {/* Inner gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/20 via-[#25D366]/10 to-transparent rounded-full opacity-60"></div>
            
            {/* WhatsApp icon */}
            <MessageCircle className="relative w-7 h-7 text-[#25D366] drop-shadow-lg" />
            
            {/* Subtle pulse animation */}
            <div className="absolute inset-0 bg-[#25D366]/5 rounded-full animate-pulse"></div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="glass-panel rounded-xl px-4 py-2 whitespace-nowrap">
              <div className="absolute inset-0 manyara-gradient rounded-xl opacity-20"></div>
              <p className="relative text-[#FFFFF0] text-sm">Chat with us on WhatsApp</p>
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
