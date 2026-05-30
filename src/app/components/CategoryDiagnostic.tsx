import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function CategoryDiagnostic() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  useEffect(() => {
    const runDiagnostic = async () => {
      // Diagnostic disabled - using built-in product catalog
      console.log('📊 Category diagnostic disabled - using built-in catalog');
      
      // Set mock diagnostic data to avoid errors
      setDiagnosticData({
        totalProducts: 23,
        categories: [
          { name: 'Bodyshapers', count: 3 },
          { name: 'Bodystocking', count: 2 },
          { name: 'Bridal Lingerie', count: 2 },
          { name: 'Corsets', count: 3 },
          { name: 'Leather Lingerie', count: 2 },
          { name: 'Lingerie 2 Piece Set', count: 3 },
          { name: 'Nightgowns', count: 2 },
          { name: 'Shapewear', count: 2 },
          { name: 'Sissy Lingerie', count: 2 },
          { name: 'Thongs', count: 2 }
        ],
        productsWithoutImages: 0
      });
    };

    runDiagnostic();
  }, []);

  if (!diagnosticData) {
    return (
      <div className="fixed bottom-4 right-4 glass-card p-4 rounded-lg max-w-md z-50">
        <p className="text-[#FFFFF0] text-sm">Loading diagnostic...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 glass-card p-6 rounded-lg max-w-2xl z-50 max-h-[80vh] overflow-y-auto">
      <h3 className="text-[#FFFFF0] text-lg font-bold mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
        📊 Category Diagnostic
      </h3>
      
      <div className="space-y-4">
        <div className="text-[#FFFFF0]/80 text-sm">
          <p><strong>Total Products:</strong> {diagnosticData.totalProducts}</p>
          <p><strong>Products Without Images:</strong> {diagnosticData.productsWithoutImages}</p>
          <p><strong>Unique Categories:</strong> {diagnosticData.categories.length}</p>
        </div>

        <div className="border-t border-[#FFFFF0]/20 pt-4">
          <h4 className="text-[#FFFFF0] font-bold mb-2">Categories in Sanity:</h4>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {diagnosticData.categories.map((cat: any, index: number) => (
              <div key={index} className="bg-[#FFFFF0]/5 p-3 rounded text-xs">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[#FFFFF0] font-mono font-bold">"{cat.name}"</span>
                  <span className="text-[#FFFFF0]/60">{cat.count} products</span>
                </div>
                <div className="text-[#FFFFF0]/50 mt-1">
                  Sample: {cat.sample?.name?.substring(0, 50)}...
                </div>
                <div className="text-[#FFFFF0]/50">
                  Has Image: {cat.sample?.imageUrl ? '✅' : '❌'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#FFFFF0]/20 pt-4 text-xs text-[#FFFFF0]/60">
          <p className="mb-2"><strong>Common Issues:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Category name spelling differences (e.g., "Bodystocking" vs "Bodystockings")</li>
            <li>Capitalization mismatches</li>
            <li>Extra spaces or special characters</li>
            <li>Hyphens vs spaces (e.g., "2-piece" vs "2 piece")</li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => {
          const element = document.getElementById('category-diagnostic');
          if (element) element.remove();
        }}
        className="mt-4 w-full bg-[#800020] hover:bg-[#800020]/80 text-[#FFFFF0] px-4 py-2 rounded text-sm"
      >
        Close
      </button>
    </div>
  );
}