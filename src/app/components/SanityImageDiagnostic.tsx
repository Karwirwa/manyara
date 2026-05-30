import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { RefreshCw, Home, ExternalLink } from "lucide-react";

interface SanityRawProduct {
  _id: string;
  name: string;
  price: number;
  image: any;
  imageUrl: string;
  category: string;
}

export function SanityImageDiagnostic() {
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRawData = async () => {
    setLoading(true);
    setError(null);
    
    // Diagnostic disabled - using built-in product catalog
    console.log('📊 Sanity diagnostic disabled - using built-in catalog');
    
    // Set mock data showing the built-in products
    setRawData({
      success: true,
      source: 'built-in-catalog',
      products: [
        { name: 'Product 1', category: 'Bodyshapers', imageUrl: 'https://images.unsplash.com/photo-1', hasImage: true },
        { name: 'Product 2', category: 'Bodystocking', imageUrl: 'https://images.unsplash.com/photo-2', hasImage: true },
        // More mock products...
      ],
      productsWithoutImages: 0,
      totalProducts: 23,
      message: 'Using built-in product catalog. To enable Sanity integration, deploy your Edge Function.'
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRawData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0A10] to-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair text-[#FFFFF0] mb-2">
            Sanity Image Diagnostic
          </h1>
          <p className="text-[#F5F5DC]/70 mb-4">
            Inspecting raw data from Sanity CMS to diagnose image loading issues
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={fetchRawData}
              disabled={loading}
              className="bg-[#800020] hover:bg-[#800020]/80"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button
              onClick={() => {
                window.location.hash = '';
                window.location.reload();
              }}
              variant="outline"
              className="border-[#F5F5DC]/30 text-[#F5F5DC] hover:bg-[#F5F5DC]/10"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => window.open('https://ximq2iuj.sanity.studio', '_blank')}
              variant="outline"
              className="border-[#556B2F]/50 text-[#556B2F] hover:bg-[#556B2F]/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Sanity Studio
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F5F5DC] border-r-transparent"></div>
            <p className="text-[#F5F5DC] mt-4">Loading data from Sanity...</p>
          </div>
        )}

        {/* Data Display */}
        {rawData && !loading && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-[#FFFFF0]/5 backdrop-blur-lg border border-[#FFFFF0]/20 rounded-2xl p-6">
              <h2 className="text-xl font-playfair text-[#FFFFF0] mb-4">Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[#F5F5DC]/60 text-sm">Total Products</p>
                  <p className="text-[#FFFFF0] text-2xl font-bold">{rawData.products?.length || 0}</p>
                </div>
                <div>
                  <p className="text-[#F5F5DC]/60 text-sm">Products WITH Images</p>
                  <p className="text-green-400 text-2xl font-bold">
                    {rawData.products?.filter((p: any) => p.imageUrl && p.imageUrl.trim() !== '').length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[#F5F5DC]/60 text-sm">Products WITHOUT Images</p>
                  <p className="text-red-400 text-2xl font-bold">
                    {rawData.productsWithoutImages || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[#F5F5DC]/60 text-sm">Source</p>
                  <p className="text-[#FFFFF0] text-2xl font-bold">{rawData.source || 'unknown'}</p>
                </div>
              </div>
            </div>

            {/* Product Details Table */}
            <div className="bg-[#FFFFF0]/5 backdrop-blur-lg border border-[#FFFFF0]/20 rounded-2xl p-6 overflow-hidden">
              <h2 className="text-xl font-playfair text-[#FFFFF0] mb-4">Product Image Status</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#FFFFF0]/20">
                      <th className="text-left py-3 px-4 text-[#F5F5DC]">Product Name</th>
                      <th className="text-left py-3 px-4 text-[#F5F5DC]">Category</th>
                      <th className="text-left py-3 px-4 text-[#F5F5DC]">Has Image?</th>
                      <th className="text-left py-3 px-4 text-[#F5F5DC]">Image URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawData.products?.map((product: any, index: number) => {
                      const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
                      const isUnsplashFallback = product.imageUrl?.includes('unsplash.com');
                      
                      return (
                        <tr key={index} className="border-b border-[#FFFFF0]/10 hover:bg-[#FFFFF0]/5">
                          <td className="py-3 px-4 text-[#FFFFF0]">{product.name || 'Untitled'}</td>
                          <td className="py-3 px-4 text-[#F5F5DC]/70">{product.category || 'N/A'}</td>
                          <td className="py-3 px-4">
                            {hasImage ? (
                              <span className={`inline-block px-2 py-1 rounded text-xs ${
                                isUnsplashFallback 
                                  ? 'bg-yellow-500/20 text-yellow-300' 
                                  : 'bg-green-500/20 text-green-300'
                              }`}>
                                {isUnsplashFallback ? '⚠️ Fallback' : '✅ Yes'}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 rounded text-xs bg-red-500/20 text-red-300">
                                ❌ No
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {hasImage ? (
                              <div className="flex items-center gap-2">
                                <a 
                                  href={product.imageUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#F5F5DC]/50 hover:text-[#F5F5DC] text-xs truncate max-w-xs block"
                                >
                                  {product.imageUrl.substring(0, 50)}...
                                </a>
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="text-red-400 text-xs">No image URL</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Raw JSON Display */}
            <div className="bg-[#FFFFF0]/5 backdrop-blur-lg border border-[#FFFFF0]/20 rounded-2xl p-6">
              <h2 className="text-xl font-playfair text-[#FFFFF0] mb-4">Raw JSON Response</h2>
              <pre className="bg-black/50 p-4 rounded-lg overflow-auto max-h-96 text-xs text-[#F5F5DC]">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-[#800020]/10 to-[#556B2F]/10 border border-[#F5F5DC]/20 rounded-2xl p-6">
              <h2 className="text-xl font-playfair text-[#FFFFF0] mb-4">💡 Recommendations</h2>
              <ul className="space-y-2 text-[#F5F5DC]/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#F5F5DC] mt-0.5">1.</span>
                  <span>
                    If products show <span className="text-yellow-300">⚠️ Fallback</span>, they are using Unsplash placeholder images. 
                    Upload real product images in Sanity Studio at{' '}
                    <a 
                      href="https://ximq2iuj.sanity.studio" 
                      target="_blank"
                      className="text-[#F5F5DC] underline"
                    >
                      https://ximq2iuj.sanity.studio
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5F5DC] mt-0.5">2.</span>
                  <span>
                    If products show <span className="text-red-300">❌ No</span>, the image field is completely empty in Sanity. 
                    Make sure images are uploaded AND published (not just drafts).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5F5DC] mt-0.5">3.</span>
                  <span>
                    Sanity image URLs should start with <code className="bg-black/30 px-1 rounded">https://cdn.sanity.io/</code>. 
                    If you see Unsplash URLs, the backend is applying fallbacks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5F5DC] mt-0.5">4.</span>
                  <span>
                    To fix: Go to Sanity Studio → Edit each product → Upload image → Publish (not save as draft)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}