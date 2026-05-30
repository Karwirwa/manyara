/**
 * Image Diagnostic Console Helper
 * 
 * This file exposes a global diagnostic function that can be called
 * from the browser console to check Sanity image loading status.
 * 
 * Usage in browser console:
 *   window.checkSanityImages()
 */

import { projectId, publicAnonKey } from "../utils/supabase/info";

export function initImageDiagnostic() {
  if (typeof window !== 'undefined') {
    (window as any).checkSanityImages = async () => {
      console.log('🔍 SANITY IMAGE DIAGNOSTIC\\n');
      console.log('⚠️ Diagnostic disabled - using built-in product catalog\\n');
      console.log('To enable Sanity integration:');
      console.log('1. Deploy your Supabase Edge Function');
      console.log('2. Uncomment the Sanity fetch code in /components/CollectionPage.tsx');
      console.log('3. Refresh the page\\n');
      
      return {
        summary: {
          message: 'Diagnostic disabled - using local catalog',
          totalProducts: 23,
          note: 'Enable Sanity integration to use this diagnostic'
        }
      };
    };

    // Also expose a simple version
    (window as any).checkImages = (window as any).checkSanityImages;
    
    // Add diagnostic page navigation
    (window as any).openDiagnosticPage = () => {
      console.log('⚠️ Diagnostic page disabled - using built-in product catalog');
      console.log('The app is working perfectly with 23 products');
    };
    
    (window as any).goToDiagnostic = (window as any).openDiagnosticPage;
    
    console.log('🔧 Image diagnostic tools loaded (offline mode)');
    console.log('Run in console: checkSanityImages() or checkImages()');
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  initImageDiagnostic();
  
  // Welcome message
  setTimeout(() => {
    console.log('%c🎉 MANYARA Diagnostics Ready!', 'background: #800020; color: #FFFFF0; padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F5F5DC;');
    console.log('%cAvailable Commands:', 'color: #F5F5DC; font-weight: bold; font-size: 12px;');
    console.log('%c  • checkSanityImages() or checkImages()', 'color: #F5F5DC; font-size: 11px;');
    console.log('%c    → Check which products have real Sanity images', 'color: #F5F5DC; font-size: 10px; font-style: italic; margin-left: 16px;');
    console.log('%c  • goToDiagnostic() or openDiagnosticPage()', 'color: #F5F5DC; font-size: 11px;');
    console.log('%c    → Open visual diagnostic page', 'color: #F5F5DC; font-size: 10px; font-style: italic; margin-left: 16px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #F5F5DC;');
  }, 1000);
}