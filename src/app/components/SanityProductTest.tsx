/**
 * Sanity Product Data Test Component
 * Tests accessing images, sizes, colors, and descriptions from Sanity CMS
 */

import { useEffect, useState } from 'react';
import { fetchProducts } from '../utils/sanity/productService';
import type { Product } from '../utils/sanity/types';
import { X, Check, AlertCircle, Image as ImageIcon, Palette, Ruler, FileText } from 'lucide-react';

interface ProductTestResult {
  product: Product;
  tests: {
    hasImage: boolean;
    hasAdditionalImages: boolean;
    hasColors: boolean;
    hasSizes: boolean;
    hasShortDescription: boolean;
    hasLongDescription: boolean;
  };
}

export function SanityProductTest() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<ProductTestResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      console.log('🧪 Starting Sanity product test...');
      
      const fetchedProducts = await fetchProducts();
      
      console.log('📦 Products fetched:', fetchedProducts);
      
      setProducts(fetchedProducts);
      
      // Test each product's data
      const results = fetchedProducts.map(product => ({
        product,
        tests: {
          hasImage: Boolean(product.imageUrl && product.imageUrl.length > 0),
          hasAdditionalImages: Boolean(product.additionalImages && product.additionalImages.length > 0),
          hasColors: Boolean(product.colors && product.colors.length > 0 && product.colors[0] !== 'Standard'),
          hasSizes: Boolean(product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size'),
          hasShortDescription: Boolean(product.shortDescription && product.shortDescription.length > 0),
          hasLongDescription: Boolean(product.longDescription && product.longDescription.length > 0),
        }
      }));
      
      setTestResults(results);
      
      console.log('✅ Test results:', results);
      
      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error loading products:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  const overallStats = {
    total: testResults.length,
    withImages: testResults.filter(r => r.tests.hasImage).length,
    withAdditionalImages: testResults.filter(r => r.tests.hasAdditionalImages).length,
    withColors: testResults.filter(r => r.tests.hasColors).length,
    withSizes: testResults.filter(r => r.tests.hasSizes).length,
    withShortDesc: testResults.filter(r => r.tests.hasShortDescription).length,
    withLongDesc: testResults.filter(r => r.tests.hasLongDescription).length,
  };

  const TestIcon = ({ passed }: { passed: boolean }) => (
    passed ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-400" />
  );

  const StatCard = ({ icon: Icon, label, value, total, color }: any) => (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <div>
          <div className="text-sm text-ivory-pearl/60">{label}</div>
          <div className="text-2xl font-bold text-ivory-pearl">
            {value} <span className="text-sm text-ivory-pearl/60">/ {total}</span>
          </div>
          <div className="text-xs text-ivory-pearl/50">
            {total > 0 ? `${Math.round((value / total) * 100)}%` : '0%'}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-wine to-olive-sage p-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-gold"></div>
              <p className="text-ivory-pearl text-lg">Loading products from Sanity...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-wine to-olive-sage p-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Products</h2>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
            <button
              onClick={loadProducts}
              className="mt-4 px-6 py-2 bg-red-500/30 hover:bg-red-500/50 border border-red-400/50 rounded-lg text-red-100 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-wine to-olive-sage p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-ivory-pearl mb-2">
            Sanity Product Data Test
          </h1>
          <p className="text-ivory-pearl/70">
            Testing access to images, sizes, colors, and descriptions from Sanity CMS
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-champagne-gold">
            <Check className="w-4 h-4" />
            <span>Connected to Sanity Project: ximq2iuj</span>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={ImageIcon}
            label="Main Images"
            value={overallStats.withImages}
            total={overallStats.total}
            color="blue"
          />
          <StatCard
            icon={ImageIcon}
            label="Gallery Images"
            value={overallStats.withAdditionalImages}
            total={overallStats.total}
            color="purple"
          />
          <StatCard
            icon={Palette}
            label="Colors"
            value={overallStats.withColors}
            total={overallStats.total}
            color="pink"
          />
          <StatCard
            icon={Ruler}
            label="Sizes"
            value={overallStats.withSizes}
            total={overallStats.total}
            color="yellow"
          />
          <StatCard
            icon={FileText}
            label="Short Desc"
            value={overallStats.withShortDesc}
            total={overallStats.total}
            color="green"
          />
          <StatCard
            icon={FileText}
            label="Long Desc"
            value={overallStats.withLongDesc}
            total={overallStats.total}
            color="teal"
          />
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testResults.map(({ product, tests }) => (
            <div
              key={product.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-champagne-gold/50 transition-all cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Product Image */}
              <div className="aspect-square bg-black/20 relative">
                {tests.hasImage ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', product.imageUrl);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1575272775908-7332223be38a?w=400&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/20" />
                  </div>
                )}
                
                {/* Additional Images Badge */}
                {tests.hasAdditionalImages && (
                  <div className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    +{product.additionalImages?.length || 0} images
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-ivory-pearl mb-1">{product.name}</h3>
                <p className="text-champagne-gold text-sm mb-3">{product.priceFormatted}</p>

                {/* Test Results */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasImage} />
                    <span className="text-ivory-pearl/70">Main Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasAdditionalImages} />
                    <span className="text-ivory-pearl/70">Gallery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasColors} />
                    <span className="text-ivory-pearl/70">Colors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasSizes} />
                    <span className="text-ivory-pearl/70">Sizes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasShortDescription} />
                    <span className="text-ivory-pearl/70">Short Desc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TestIcon passed={tests.hasLongDescription} />
                    <span className="text-ivory-pearl/70">Long Desc</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {testResults.length === 0 && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-ivory-pearl/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-ivory-pearl mb-2">No Products Found</h3>
            <p className="text-ivory-pearl/70">
              Make sure you have products created in your Sanity CMS (Project: ximq2iuj)
            </p>
          </div>
        )}

        {/* Selected Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-ivory-pearl mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-champagne-gold text-xl">{selectedProduct.priceFormatted}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-ivory-pearl/70 hover:text-ivory-pearl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Images */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-ivory-pearl mb-3 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Images
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.imageUrl && (
                      <div>
                        <p className="text-sm text-ivory-pearl/60 mb-2">Main Image</p>
                        <img
                          src={selectedProduct.imageUrl}
                          alt="Main"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <p className="text-xs text-ivory-pearl/40 mt-1 break-all">
                          {selectedProduct.imageUrl}
                        </p>
                      </div>
                    )}
                    {selectedProduct.additionalImages?.map((img, idx) => (
                      <div key={idx}>
                        <p className="text-sm text-ivory-pearl/60 mb-2">Additional Image {idx + 1}</p>
                        <img
                          src={img}
                          alt={`Additional ${idx + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <p className="text-xs text-ivory-pearl/40 mt-1 break-all">{img}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-ivory-pearl mb-3 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Colors ({selectedProduct.colors?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors?.map((color, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-ivory-pearl"
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-ivory-pearl mb-3 flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    Sizes ({selectedProduct.sizes?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes?.map((size, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-ivory-pearl"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-ivory-pearl mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Descriptions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-ivory-pearl/60 mb-2">Short Description</p>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-ivory-pearl/80">
                        {selectedProduct.shortDescription || '(No short description)'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-ivory-pearl/60 mb-2">Long Description</p>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-ivory-pearl/80">
                        {selectedProduct.longDescription || '(No long description)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Raw Data */}
                <div>
                  <h3 className="text-lg font-bold text-ivory-pearl mb-3">Raw Product Data</h3>
                  <div className="p-4 bg-black/30 border border-white/10 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-green-300">
                      {JSON.stringify(selectedProduct, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
