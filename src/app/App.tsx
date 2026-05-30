import { GlassNavigation } from "./components/GlassNavigation";
import { HeroSection } from "./components/HeroSection";
import { CollectionPage } from "./components/CollectionPage";
import { AboutUsPage } from "./components/AboutUsPage";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";
import { SocialMediaIcons } from "./components/SocialMediaIcons";
import { AdminPage } from "./components/AdminPage";
import { AdminLogin } from "./components/AdminLogin";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { CategoriesShowcase } from "./components/CategoriesShowcase";
import { DataSourceIndicator } from "./components/DataSourceIndicator";
import { EdgeFunctionTester } from "./components/EdgeFunctionTester";
import { SanityFlowDiagram } from "./components/SanityFlowDiagram";
import { SanityProductTest } from "./components/SanityProductTest";
import { SanityDiagnostic } from "./components/SanityDiagnostic";
import { DiagnosticDashboard } from "./components/DiagnosticDashboard";
import { useState, useRef, useEffect } from "react";
import { Toaster } from "sonner@2.0.3";

type Page = "home" | "cart" | "checkout" | "admin" | "test-edge" | "flow-diagram" | "test-products" | "diagnostic" | "tools";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const collectionPageRef = useRef<{ setCategory: (category: string) => void }>(null);

  // Set page title and favicon
  useEffect(() => {
    // Set page title
    document.title = "MANYARA | Luxury Lingerie";
    
    // Add meta tags for SEO and social sharing
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Basic meta tags
    updateMetaTag('description', 'MANYARA - Luxury lingerie e-commerce in Kenya. Discover our curated collection of premium bras, panties, sleepwear, and intimate apparel. Discreet delivery, M-Pesa payments available.');
    updateMetaTag('keywords', 'lingerie Kenya, luxury lingerie, bras, panties, sleepwear, intimate apparel, MANYARA, online lingerie shop Kenya, M-Pesa lingerie');
    updateMetaTag('author', 'MANYARA Luxury Lingerie');
    
    // Open Graph tags for social media
    updateMetaTag('og:title', 'MANYARA | Luxury Lingerie', true);
    updateMetaTag('og:description', 'Discover our curated collection of premium intimate apparel. Discreet delivery across Kenya with M-Pesa payments.', true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'MANYARA', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'MANYARA | Luxury Lingerie');
    updateMetaTag('twitter:description', 'Discover our curated collection of premium intimate apparel. Discreet delivery across Kenya.');
    
    // Create and set favicon
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement || document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    
    // Elegant M monogram favicon with MANYARA brand colors
    const faviconSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#800020;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#556B2F;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="letterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#FFFFF0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#F5F5DC;stop-opacity:0.95" />
          </linearGradient>
        </defs>
        <!-- Background circle with gradient -->
        <circle cx="50" cy="50" r="48" fill="url(#bgGrad)"/>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#F5F5DC" stroke-width="1.5" opacity="0.25"/>

        <!-- Elegant M monogram with gradient -->
        <text x="50" y="73" font-family="serif" font-size="62" font-weight="700" font-style="italic" text-anchor="middle" fill="url(#letterGrad)">M</text>

        <!-- Decorative accent dot -->
        <circle cx="50" cy="15" r="2.5" fill="#FFFFF0" opacity="0.7"/>
      </svg>
    `.trim();
    
    favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSVG)}`;
    
    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(favicon);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('manyara_admin_auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Display startup message
  useEffect(() => {
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #800020; font-weight: bold;');
    console.log('%c🎀 MANYARA Luxury Lingerie E-Commerce 🎀', 'color: #800020; font-size: 18px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #800020; font-weight: bold;');
    console.log('%c✅ Application Status: FULLY OPERATIONAL', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
    console.log('%c📦 Data Source: Sanity CMS (Project: ximq2iuj)', 'color: #4CAF50; font-size: 12px; font-weight: bold;');
    console.log('%c🛒 Cart System: Active & Persistent', 'color: #556B2F; font-size: 12px;');
    console.log('%c🛍️  All E-commerce Features: Active', 'color: #556B2F; font-size: 12px;');
    console.log('%c💳 Payment Methods: M-Pesa, Bank Transfer, PayPal', 'color: #556B2F; font-size: 12px;');
    console.log('%c🌍 Premium Imported Lingerie', 'color: #556B2F; font-size: 12px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #800020; font-weight: bold;');
    console.log('%c🔧 DIAGNOSTIC TOOLS AVAILABLE', 'color: #F5F5DC; font-size: 14px; font-weight: bold;');
    console.log('%c   Dashboard:   window.location.href = "/?tools=true"', 'color: #F5F5DC; font-size: 11px;');
    console.log('%c   Diagnostic:  window.location.href = "/?diagnostic=true"', 'color: #F5F5DC; font-size: 11px;');
    console.log('%c   Product Test: window.location.href = "/?test-products=true"', 'color: #F5F5DC; font-size: 11px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #800020; font-weight: bold;');
  }, []);

  // Check URL parameters for special pages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test-edge') === 'true') {
      setCurrentPage('test-edge');
    }
    if (params.get('flow-diagram') === 'true') {
      setCurrentPage('flow-diagram');
    }
    if (params.get('test-products') === 'true') {
      setCurrentPage('test-products');
    }
    if (params.get('diagnostic') === 'true') {
      setCurrentPage('diagnostic');
    }
    if (params.get('tools') === 'true') {
      setCurrentPage('tools');
    }
    if (params.get('admin') === 'true') {
      setShowAdmin(true);
    }
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Use ref to directly update the CollectionPage's category
    if (collectionPageRef.current) {
      collectionPageRef.current.setCategory(category);
    }
  };

  const handleNavigate = (section: string) => {
    // First, navigate to home page if not already there
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
    
    // Then scroll to the section after a brief delay to ensure the page has rendered
    setTimeout(() => {
      const sectionId = section === 'Reviews' ? 'testimonials' : section.toLowerCase();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (section === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAdminRequest = () => {
    if (isAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdmin(true);
  };

  const handleLoginCancel = () => {
    setShowAdminLogin(false);
    // Clear URL parameter if it was set
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
    // Clear URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Check if current page requires authentication
  const requiresAuth = ['test-edge', 'flow-diagram', 'test-products', 'diagnostic', 'tools'].includes(currentPage);
  
  // Show login if authentication required but not authenticated
  if (requiresAuth && !isAuthenticated) {
    return (
      <AdminLogin 
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={() => {
          setCurrentPage('home');
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  // Show admin login modal
  if (showAdminLogin) {
    return <AdminLogin onSuccess={handleLoginSuccess} onCancel={handleLoginCancel} />;
  }

  if (showAdmin) {
    return <AdminPage onClose={handleAdminClose} />;
  }

  if (currentPage === "cart") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <CartPage
          onCheckout={() => setCurrentPage("checkout")}
        />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "checkout") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <CheckoutPage onBack={() => setCurrentPage("cart")} />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "test-edge") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <EdgeFunctionTester />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "flow-diagram") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <SanityFlowDiagram />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "test-products") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <SanityProductTest />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "diagnostic") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <SanityDiagnostic />
        <SocialMediaIcons />
      </div>
    );
  }

  if (currentPage === "tools") {
    return (
      <div className="relative w-full min-h-screen">
        <GlassNavigation
          onCartClick={() => setCurrentPage("cart")}
          onAdminClick={() => handleAdminRequest()}
          onLogoClick={() => setCurrentPage("home")}
          onNavigate={handleNavigate}
        />
        <DiagnosticDashboard />
        <SocialMediaIcons />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      <GlassNavigation
        onCartClick={() => setCurrentPage("cart")}
        onAdminClick={() => handleAdminRequest()}
        onLogoClick={() => setCurrentPage("home")}
        onNavigate={handleNavigate}
      />
      <HeroSection />
      <CategoriesShowcase onCategoryClick={handleCategoryClick} />
      <CollectionPage ref={collectionPageRef} initialCategory={selectedCategory} />
      <AboutUsPage />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <SocialMediaIcons />
      <DataSourceIndicator />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </CartProvider>
  );
}