import { Instagram, Facebook, Phone } from "lucide-react";

export function ContactSocialIcons() {
  return (
    <div className="flex items-center justify-center space-x-6 mb-8">
      {/* Instagram */}
      <a
        href="https://www.instagram.com/manyara_intimates/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#E4405F]/20 to-[#833AB4]/20 rounded-full blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <div className="relative w-12 h-12 glass-panel rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
          <div className="absolute inset-0 manyara-gradient rounded-full opacity-15"></div>
          <Instagram className="relative w-5 h-5 text-[#E4405F]" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="glass-panel rounded-xl px-3 py-2 whitespace-nowrap">
            <div className="absolute inset-0 manyara-gradient rounded-xl opacity-20"></div>
            <p className="relative text-[#FFFFF0] text-xs">@manyara_intimates</p>
          </div>
        </div>
      </a>

      {/* Facebook */}
      <a
        href="https://web.facebook.com/profile.php?id=61574430731029"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        <div className="absolute inset-0 bg-[#1877F2]/20 rounded-full blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <div className="relative w-12 h-12 glass-panel rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
          <div className="absolute inset-0 manyara-gradient rounded-full opacity-15"></div>
          <Facebook className="relative w-5 h-5 text-[#1877F2]" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="glass-panel rounded-xl px-3 py-2 whitespace-nowrap">
            <div className="absolute inset-0 manyara-gradient rounded-xl opacity-20"></div>
            <p className="relative text-[#FFFFF0] text-xs">MANYARA Intimates</p>
          </div>
        </div>
      </a>

      {/* Phone */}
      <a
        href="tel:+254797040512"
        className="group relative"
      >
        <div className="absolute inset-0 bg-[#800020]/20 rounded-full blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        <div className="relative w-12 h-12 glass-panel rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
          <div className="absolute inset-0 manyara-gradient rounded-full opacity-15"></div>
          <Phone className="relative w-5 h-5 text-[#800020]" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="glass-panel rounded-xl px-3 py-2 whitespace-nowrap">
            <div className="absolute inset-0 manyara-gradient rounded-xl opacity-20"></div>
            <p className="relative text-[#FFFFF0] text-xs">+254 797 040 512</p>
          </div>
        </div>
      </a>
    </div>
  );
}
