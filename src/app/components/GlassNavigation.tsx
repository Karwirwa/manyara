import { ShoppingBag, Settings, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface GlassNavigationProps {
  onCartClick: () => void;
  onAdminClick: () => void;
  onLogoClick: () => void;
  onNavigate?: (section: string) => void;
}

export function GlassNavigation({ onCartClick, onAdminClick, onLogoClick, onNavigate }: GlassNavigationProps) {
  const navItems = ['Home', 'Collections', 'About', 'Reviews', 'FAQ', 'Contact'];
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(item);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden lg:block w-auto max-w-6xl">
        <div className="glass-panel rounded-2xl px-8 py-4 shadow-2xl">
          <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-30"></div>

          <ul className="relative flex items-center space-x-8">
            <li className="mr-4">
              <button
                onClick={onLogoClick}
                className="text-[#FFFFF0] tracking-[0.15em] text-lg hover:text-[#F5F5DC] transition-colors"
                style={{ fontFamily: 'Cinzel, Playfair Display, Georgia, serif' }}
              >
                MANYARA
              </button>
            </li>

            <div className="w-px h-6 bg-[#F5F5DC]/30"></div>

            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item === 'Reviews' ? 'testimonials' : item.toLowerCase()}`}
                  className="text-[#FFFFF0]/80 hover:text-[#FFFFF0] transition-all duration-300 text-sm tracking-wide relative group"
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#800020]/60 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}

            <li>
              <button
                onClick={onCartClick}
                className="relative p-2 rounded-full hover:bg-[#FFFFF0]/10 transition-all duration-300 group"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#FFFFF0]/80 group-hover:text-[#FFFFF0]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#800020] text-[#FFFFF0] text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>

            <li>
              <button
                onClick={onAdminClick}
                className="p-2 rounded-full hover:bg-[#FFFFF0]/5 transition-all duration-300 group opacity-30 hover:opacity-100"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5 text-[#FFFFF0]/60 group-hover:text-[#FFFFF0]" />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass-panel mx-4 mt-4 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="absolute inset-0 manyara-gradient rounded-2xl opacity-30"></div>

          <div className="relative flex items-center justify-between">
            <button
              onClick={onLogoClick}
              className="text-[#FFFFF0] tracking-[0.15em] text-base sm:text-lg hover:text-[#F5F5DC] transition-colors"
              style={{ fontFamily: 'Cinzel, Playfair Display, Georgia, serif' }}
            >
              MANYARA
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={onCartClick}
                className="relative p-2 rounded-full hover:bg-[#FFFFF0]/10 transition-all duration-300"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#FFFFF0]/80" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#800020] text-[#FFFFF0] text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-[#FFFFF0]/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#FFFFF0]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#FFFFF0]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="glass-panel mx-4 mt-2 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 manyara-gradient opacity-30"></div>

            <ul className="relative py-2">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item === 'Reviews' ? 'testimonials' : item.toLowerCase()}`}
                    className="block px-6 py-3 text-[#FFFFF0]/80 hover:text-[#FFFFF0] hover:bg-[#FFFFF0]/10 transition-all duration-300 text-base tracking-wide"
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li className="border-t border-[#F5F5DC]/20 mt-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onAdminClick();
                  }}
                  className="w-full text-left px-6 py-3 text-[#FFFFF0]/60 hover:text-[#FFFFF0] hover:bg-[#FFFFF0]/10 transition-all duration-300 text-sm tracking-wide flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}