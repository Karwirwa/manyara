import { useState, useEffect } from "react";
import { X, Upload, Trash2, RefreshCw, Database, AlertCircle, CheckCircle, Download, Package } from "lucide-react";
import { AdminOrdersPage } from "./AdminOrdersPage";
import { fetchProducts as loadSanityProducts } from "../utils/sanity/productService";

interface Product {
  id: string | number;
  name: string;
  imageUrl: string;
  price: string;
  priceFormatted?: string;
  category: string;
  categorySlug?: string;
  colors: string[];
  sizes: string[];
  shortDescription: string;
  longDescription: string;
  additionalImages?: string[];
  inStock?: boolean;
  featured?: boolean;
}

export function AdminPage({ onClose }: { onClose: () => void }) {
  const [jsonInput, setJsonInput] = useState("");
  const [existingProducts, setExistingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingSanity, setFetchingSanity] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, 'loading' | 'success' | 'failed'>>({});

  // Fetch existing products from Sanity CMS directly
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Loading products from Sanity CMS...' });
      
      const products = await loadSanityProducts();
      
      // Debug: Log image URLs
      console.log('🖼️ Admin Panel - Product Images Debug:');
      products.forEach((product, index) => {
        console.log(`Product ${index + 1}: ${product.name}`);
        console.log(`  - imageUrl: ${product.imageUrl}`);
        console.log(`  - additionalImages: ${product.additionalImages?.length || 0} images`);
        if (product.additionalImages && product.additionalImages.length > 0) {
          product.additionalImages.forEach((url, i) => {
            console.log(`    [${i}]: ${url}`);
          });
        }
      });
      
      // Store raw product data for debugging
      setDebugInfo({
        products: products,
        totalCount: products.length,
        withImages: products.filter(p => p.imageUrl).length,
        withoutImages: products.filter(p => !p.imageUrl).length,
      });
      
      setExistingProducts(products);
      setMessage({ 
        type: 'success', 
        text: `Loaded ${products.length} products from Sanity CMS` 
      });
    } catch (err: any) {
      console.error('Fetch error:', err);
      setMessage({ 
        type: 'error', 
        text: `Failed to load products: ${err.message}. Make sure CORS is configured in Sanity.` 
      });
      setExistingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch debug info placeholder
  const fetchDebugInfo = async () => {
    // No debug info needed for Sanity CMS
    setDebugInfo(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from Sanity CMS and populate textarea
  const fetchSanityProducts = async () => {
    try {
      setFetchingSanity(true);
      setMessage({ type: 'info', text: 'Fetching products from Sanity CMS...' });
      
      const products = await loadSanityProducts();
      
      // Convert to JSON and populate textarea
      setJsonInput(JSON.stringify(products, null, 2));
      setMessage({ 
        type: 'success', 
        text: `Fetched ${products.length} products from Sanity CMS. Review the JSON below.` 
      });
    } catch (err: any) {
      console.error('Sanity fetch error:', err);
      setMessage({ 
        type: 'error', 
        text: `Failed to fetch from Sanity: ${err.message}. Make sure CORS is configured.` 
      });
    } finally {
      setFetchingSanity(false);
    }
  };

  // Upload products - Disabled (Sanity Studio should be used for content management)
  const handleUpload = async () => {
    setMessage({ 
      type: 'info', 
      text: 'To add products, please use Sanity Studio at: https://ximq2iuj.sanity.studio - This ensures proper content management and image optimization.' 
    });
    return;
  };

  // Delete a product - Disabled (Sanity Studio should be used for content management)
  const handleDelete = async (productId: string | number) => {
    setMessage({ 
      type: 'info', 
      text: 'To delete products, please use Sanity Studio at: https://ximq2iuj.sanity.studio - This ensures data integrity.' 
    });
    return;
  };

  // Sample product template
  const sampleProduct = {
    id: "sample-1",
    name: "Luxury Lace Bodysuit",
    imageUrl: "https://images.unsplash.com/photo-1575272775908-7332223be38a",
    price: "KSh 3,500",
    category: "Bodysuits",
    colors: ["Black", "Red", "Nude"],
    sizes: ["S", "M", "L", "XL"],
    shortDescription: "Elegant lace bodysuit with adjustable straps",
    longDescription: "Premium quality lace bodysuit featuring intricate floral patterns, adjustable straps, and comfortable stretch fabric. Perfect for special occasions or everyday luxury.",
    additionalImages: [
      "https://images.unsplash.com/photo-1575272775908-7332223be38a",
      "https://images.unsplash.com/photo-1583846792781-3f3643e3ee36"
    ],
    inStock: true,
    featured: false
  };

  // Early return AFTER all hooks
  if (showOrders) {
    return <AdminOrdersPage onClose={() => setShowOrders(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#0A0A0A] border border-[#FFFFF0]/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#FFFFF0]/10 bg-[#0A0A0A]/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[#F5F5DC]" />
            <h2 className="text-2xl text-[#FFFFF0]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Product Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOrders(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#556B2F] hover:bg-[#556B2F]/90 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5 text-[#FFFFF0]"/>
              <span className="text-[#FFFFF0]">View Orders</span>
            </button>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-[#800020] hover:bg-[#800020]/90 rounded-lg transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-[#FFFFF0]"/>
              <span className="text-[#FFFFF0]">Image Debug</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#FFFFF0]/10 transition-colors"
            >
              <X className="w-6 h-6 text-[#FFFFF0]"/>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Message Banner */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
              message.type === 'error' ? 'bg-red-500/10 border border-red-500/20' :
              'bg-blue-500/10 border border-blue-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
               message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
               <AlertCircle className="w-5 h-5 text-blue-400" />}
              <p className={`${
                message.type === 'success' ? 'text-green-400' :
                message.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Sanity CMS Info Banner */}
          <div className="mb-6 p-4 rounded-lg bg-[#556B2F]/10 border border-[#556B2F]/20">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#F5F5DC] mt-0.5" />
              <div className="flex-1">
                <h4 className="text-[#F5F5DC] font-semibold mb-1">Connected to Sanity CMS</h4>
                <p className="text-sm text-[#FFFFF0]/70 mb-2">
                  This admin panel displays products from your Sanity CMS (Project: ximq2iuj). 
                  To add, edit, or delete products, please use Sanity Studio.
                </p>
                <a
                  href="https://ximq2iuj.sanity.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#F5F5DC] hover:text-[#FFFFF0] underline"
                >
                  Open Sanity Studio
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Image Debug Panel */}
          {showDebugPanel && existingProducts.length > 0 && (
            <div className="mb-6 p-6 rounded-lg bg-[#800020]/10 border-2 border-[#800020]/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-[#F5F5DC] font-semibold">🔍 Image Diagnostic Report</h3>
                <button
                  onClick={() => setShowDebugPanel(false)}
                  className="text-sm text-[#FFFFF0]/60 hover:text-[#FFFFF0] underline"
                >
                  Hide
                </button>
              </div>
              
              <div className="space-y-4">
                {existingProducts.map((product) => (
                  <div key={product.id} className="p-4 bg-[#0A0A0A] rounded-lg border border-[#FFFFF0]/10">
                    <div className="flex items-start gap-4">
                      {/* Diagnostic Info */}
                      <div className="flex-1">
                        <h4 className="text-[#FFFFF0] font-medium mb-2">{product.name}</h4>
                        
                        {/* Main Image URL */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#F5F5DC]">Main Image URL:</span>
                            {imageLoadStatus[product.id] === 'success' && (
                              <span className="text-xs text-green-400">✓ Loading Successfully</span>
                            )}
                            {imageLoadStatus[product.id] === 'failed' && (
                              <span className="text-xs text-red-400">✗ Failed to Load</span>
                            )}
                            {!imageLoadStatus[product.id] && (
                              <span className="text-xs text-yellow-400">⚠ Not tested yet</span>
                            )}
                          </div>
                          <code className="block text-xs text-[#FFFFF0]/80 bg-[#FFFFF0]/5 p-2 rounded break-all">
                            {product.imageUrl || '❌ NO IMAGE URL'}
                          </code>
                        </div>

                        {/* Additional Images */}
                        {product.additionalImages && product.additionalImages.length > 0 && (
                          <div>
                            <span className="text-xs text-[#F5F5DC]">Additional Images ({product.additionalImages.length}):</span>
                            <div className="mt-1 space-y-1">
                              {product.additionalImages.map((url, i) => (
                                <code key={i} className="block text-xs text-[#FFFFF0]/60 bg-[#FFFFF0]/5 p-2 rounded break-all">
                                  [{i+1}] {url}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Data Check */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${product.imageUrl ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.imageUrl ? '✓ Has imageUrl' : '✗ Missing imageUrl'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${product.colors?.length ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.colors?.length ? `✓ ${product.colors.length} colors` : '✗ No colors'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${product.sizes?.length ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.sizes?.length ? `✓ ${product.sizes.length} sizes` : '✗ No sizes'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Test */}
                      <div className="flex-shrink-0">
                        <div className="text-xs text-[#FFFFF0]/60 mb-1">Visual Test:</div>
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#FFFFF0]/5 border border-[#FFFFF0]/20">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={() => setImageLoadStatus(prev => ({ ...prev, [`test-${product.id}`]: 'failed' }))}
                              onLoad={() => setImageLoadStatus(prev => ({ ...prev, [`test-${product.id}`]: 'success' }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#FFFFF0]/40">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-[#F5F5DC]/5 rounded-lg">
                <h4 className="text-sm text-[#F5F5DC] font-semibold mb-2">📊 Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#FFFFF0]/60">Total Products:</span>
                    <span className="ml-2 text-[#FFFFF0]">{existingProducts.length}</span>
                  </div>
                  <div>
                    <span className="text-[#FFFFF0]/60">With Images:</span>
                    <span className="ml-2 text-[#FFFFF0]">{existingProducts.filter(p => p.imageUrl).length}</span>
                  </div>
                  <div>
                    <span className="text-[#FFFFF0]/60">Images Loading:</span>
                    <span className="ml-2 text-green-400">{Object.values(imageLoadStatus).filter(s => s === 'success').length}</span>
                  </div>
                  <div>
                    <span className="text-[#FFFFF0]/60">Images Failing:</span>
                    <span className="ml-2 text-red-400">{Object.values(imageLoadStatus).filter(s => s === 'failed').length}</span>
                  </div>
                </div>
                
                {existingProducts.filter(p => !p.imageUrl).length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400">
                      ⚠️ {existingProducts.filter(p => !p.imageUrl).length} product(s) missing image URLs. 
                      Make sure you've added images in Sanity Studio and published the documents.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Import Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-[#FFFFF0]">Import & Preview</h3>
                <button
                  onClick={() => setJsonInput(JSON.stringify([sampleProduct], null, 2))}
                  className="text-sm text-[#F5F5DC] hover:text-[#FFFFF0] underline"
                >
                  Load Sample
                </button>
              </div>

              {/* Sanity CMS Import Button */}
              <button
                onClick={fetchSanityProducts}
                disabled={fetchingSanity}
                className="w-full py-3 px-6 bg-[#556B2F] hover:bg-[#556B2F]/90 disabled:bg-[#556B2F]/50 disabled:cursor-not-allowed text-[#FFFFF0] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {fetchingSanity ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Fetching from Sanity...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Import from Sanity CMS
                  </>
                )}
              </button>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Click "Import from Sanity CMS" to load your products...\n\nOr paste your product JSON here:\n[\n  {\n    "id": "product-1",\n    "name": "Product Name",\n    "imageUrl": "...",\n    "price": "KSh 2,500",\n    "category": "Bodysuits",\n    "colors": ["Black", "Red"],\n    "sizes": ["S", "M", "L"],\n    "shortDescription": "...",\n    "longDescription": "..."\n  }\n]'
                className="w-full h-80 p-4 bg-[#0A0A0A] border border-[#FFFFF0]/20 rounded-lg text-[#FFFFF0] text-sm font-mono focus:outline-none focus:border-[#F5F5DC] resize-none"
              />

              <div className="p-4 bg-[#FFFFF0]/5 rounded-lg border border-[#FFFFF0]/10">
                <h4 className="text-sm text-[#FFFFF0] mb-2">💡 How to Add Products:</h4>
                <ul className="text-xs text-[#FFFFF0]/60 space-y-1">
                  <li>1. Visit <a href="https://ximq2iuj.sanity.studio" target="_blank" rel="noopener noreferrer" className="text-[#F5F5DC] underline">Sanity Studio</a></li>
                  <li>2. Create new products with images, descriptions, and pricing</li>
                  <li>3. Products will automatically appear on your website</li>
                  <li>4. Use this panel to preview and verify your products</li>
                </ul>
              </div>

              <div className="p-4 bg-[#FFFFF0]/5 rounded-lg border border-[#FFFFF0]/10">
                <h4 className="text-sm text-[#FFFFF0] mb-2">📋 Required Fields:</h4>
                <ul className="text-xs text-[#FFFFF0]/60 space-y-1">
                  <li>• name (string)</li>
                  <li>• category (reference)</li>
                  <li>• price (number)</li>
                  <li>• colors (array of strings)</li>
                  <li>• sizes (array of strings)</li>
                  <li>• mainImage (image)</li>
                  <li>• shortDescription (text)</li>
                  <li>• longDescription (text)</li>
                </ul>
              </div>
            </div>

            {/* Existing Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-[#FFFFF0]">Current Products ({existingProducts.length})</h3>
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-[#FFFFF0]/10 transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 text-[#F5F5DC] ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-8 text-[#FFFFF0]/60">Loading products from Sanity...</div>
                ) : existingProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-[#FFFFF0]/20 mx-auto mb-3" />
                    <p className="text-[#FFFFF0]/60">No products found</p>
                    <p className="text-sm text-[#FFFFF0]/40 mt-1">
                      Add products in <a href="https://ximq2iuj.sanity.studio" target="_blank" rel="noopener noreferrer" className="text-[#F5F5DC] underline">Sanity Studio</a>
                    </p>
                  </div>
                ) : (
                  existingProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-[#0A0A0A] border border-[#FFFFF0]/10 rounded-lg hover:border-[#F5F5DC]/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          {/* Product Image */}
                          {product.imageUrl ? (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg bg-[#FFFFF0]/5"
                                onError={(e) => {
                                  console.error(`❌ Failed to load image for ${product.name}:`, product.imageUrl);
                                  // Hide broken image
                                  e.currentTarget.style.display = 'none';
                                  setImageLoadStatus(prev => ({ ...prev, [product.id]: 'failed' }));
                                }}
                                onLoad={() => {
                                  console.log(`✅ Image loaded for ${product.name}`);
                                  setImageLoadStatus(prev => ({ ...prev, [product.id]: 'success' }));
                                }}
                              />
                              {/* Fallback indicator if image fails */}
                              <div className="absolute inset-0 flex items-center justify-center bg-[#FFFFF0]/5 rounded-lg text-[#FFFFF0]/40 text-xs">
                                {!product.imageUrl && '📷'}
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-[#FFFFF0]/5 rounded-lg text-[#FFFFF0]/40">
                              📷
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="px-2 py-1 bg-[#556B2F]/20 text-[#F5F5DC] text-xs rounded">
                                {product.category}
                              </span>
                              {product.inStock && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                                  In Stock
                                </span>
                              )}
                              {product.featured && (
                                <span className="px-2 py-1 bg-[#800020]/20 text-[#F5F5DC] text-xs rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <h4 className="text-[#FFFFF0] font-medium">{product.name}</h4>
                            <p className="text-sm text-[#F5F5DC] mt-1">
                              {product.priceFormatted || product.price}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {product.colors?.slice(0, 3).map((color, i) => (
                                <span key={i} className="text-xs text-[#FFFFF0]/60 px-2 py-0.5 bg-[#FFFFF0]/5 rounded">
                                  {color}
                                </span>
                              ))}
                              {product.colors && product.colors.length > 3 && (
                                <span className="text-xs text-[#FFFFF0]/40">
                                  +{product.colors.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                          title="Delete product (requires Sanity Studio)"
                        >
                          <Trash2 className="w-4 h-4 text-[#FFFFF0]/40 group-hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}