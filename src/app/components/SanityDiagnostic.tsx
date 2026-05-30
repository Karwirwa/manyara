/**
 * Sanity Diagnostic Tool
 * Deep inspection of product data to identify specific issues
 */

import { useEffect, useState } from 'react';
import { sanityClient, fetchFromSanity } from '../utils/sanity/client';
import { X, CheckCircle2, AlertCircle, XCircle, Info, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export function SanityDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  async function runDiagnostics() {
    setLoading(true);
    const diagnostics: DiagnosticResult[] = [];

    try {
      // Test 1: Sanity Client Connection
      diagnostics.push({
        test: 'Sanity Client Connection',
        status: 'pass',
        message: 'Successfully connected to Sanity CMS',
        details: {
          projectId: 'ximq2iuj',
          dataset: 'production',
          apiVersion: '2023-05-03'
        }
      });

      // Test 2: Fetch Raw Products
      const rawProductsQuery = `*[_type == "product"][0...3]`;
      const rawProducts = await fetchFromSanity(rawProductsQuery);
      
      setRawData(rawProducts);

      if (!rawProducts || rawProducts.length === 0) {
        diagnostics.push({
          test: 'Product Count',
          status: 'fail',
          message: 'No products found in Sanity CMS',
          details: 'Go to Sanity Studio and create products'
        });
      } else {
        diagnostics.push({
          test: 'Product Count',
          status: 'pass',
          message: `Found ${rawProducts.length} products (showing first 3)`,
          details: rawProducts.length
        });
      }

      // Test 3: Check Image Structure
      if (rawProducts && rawProducts.length > 0) {
        const firstProduct = rawProducts[0];
        
        // Check mainImage
        if (!firstProduct.mainImage) {
          diagnostics.push({
            test: 'Main Image Field',
            status: 'fail',
            message: 'mainImage field is missing or null',
            details: 'Add an image to the mainImage field in Sanity Studio'
          });
        } else if (typeof firstProduct.mainImage === 'object' && firstProduct.mainImage.asset) {
          diagnostics.push({
            test: 'Main Image Field',
            status: 'warning',
            message: 'mainImage is object (needs dereferencing)',
            details: firstProduct.mainImage
          });
        } else if (typeof firstProduct.mainImage === 'string') {
          diagnostics.push({
            test: 'Main Image Field',
            status: 'pass',
            message: 'mainImage is properly dereferenced to URL',
            details: firstProduct.mainImage
          });
        }

        // Check additionalImages
        if (!firstProduct.additionalImages || firstProduct.additionalImages.length === 0) {
          diagnostics.push({
            test: 'Additional Images',
            status: 'warning',
            message: 'No additional images found',
            details: 'Add images to additionalImages array in Sanity'
          });
        } else if (Array.isArray(firstProduct.additionalImages) && typeof firstProduct.additionalImages[0] === 'string') {
          diagnostics.push({
            test: 'Additional Images',
            status: 'pass',
            message: `Found ${firstProduct.additionalImages.length} additional images (dereferenced)`,
            details: firstProduct.additionalImages
          });
        } else {
          diagnostics.push({
            test: 'Additional Images',
            status: 'warning',
            message: 'Additional images not properly dereferenced',
            details: firstProduct.additionalImages
          });
        }

        // Check colors
        if (!firstProduct.colors || firstProduct.colors.length === 0) {
          diagnostics.push({
            test: 'Colors Array',
            status: 'warning',
            message: 'No colors defined',
            details: 'Add color options in Sanity Studio'
          });
        } else {
          diagnostics.push({
            test: 'Colors Array',
            status: 'pass',
            message: `Found ${firstProduct.colors.length} color(s): ${firstProduct.colors.join(', ')}`,
            details: firstProduct.colors
          });
        }

        // Check sizes
        if (!firstProduct.sizes || firstProduct.sizes.length === 0) {
          diagnostics.push({
            test: 'Sizes Array',
            status: 'warning',
            message: 'No sizes defined',
            details: 'Add size options in Sanity Studio'
          });
        } else {
          diagnostics.push({
            test: 'Sizes Array',
            status: 'pass',
            message: `Found ${firstProduct.sizes.length} size(s): ${firstProduct.sizes.join(', ')}`,
            details: firstProduct.sizes
          });
        }

        // Check category
        if (!firstProduct.category) {
          diagnostics.push({
            test: 'Category Reference',
            status: 'fail',
            message: 'Category is missing',
            details: 'Assign a category to the product in Sanity Studio'
          });
        } else if (typeof firstProduct.category === 'object' && firstProduct.category._ref) {
          diagnostics.push({
            test: 'Category Reference',
            status: 'warning',
            message: 'Category not dereferenced (still a reference)',
            details: firstProduct.category
          });
        } else if (typeof firstProduct.category === 'object' && firstProduct.category.title) {
          diagnostics.push({
            test: 'Category Reference',
            status: 'pass',
            message: `Category dereferenced: ${firstProduct.category.title}`,
            details: firstProduct.category
          });
        }

        // Check descriptions
        if (!firstProduct.shortDescription || firstProduct.shortDescription.trim() === '') {
          diagnostics.push({
            test: 'Short Description',
            status: 'warning',
            message: 'Short description is empty',
            details: 'Add a short description in Sanity Studio'
          });
        } else {
          diagnostics.push({
            test: 'Short Description',
            status: 'pass',
            message: `Short description: ${firstProduct.shortDescription.substring(0, 50)}...`,
            details: firstProduct.shortDescription
          });
        }

        if (!firstProduct.longDescription || firstProduct.longDescription.trim() === '') {
          diagnostics.push({
            test: 'Long Description',
            status: 'warning',
            message: 'Long description is empty',
            details: 'Add a long description in Sanity Studio'
          });
        } else {
          diagnostics.push({
            test: 'Long Description',
            status: 'pass',
            message: `Long description: ${firstProduct.longDescription.substring(0, 50)}...`,
            details: firstProduct.longDescription
          });
        }
      }

      // Test 4: Check GROQ Query with Dereferencing
      const properQuery = `
        *[_type == "product"][0] {
          _id,
          name,
          "mainImage": mainImage.asset->url,
          "additionalImages": additionalImages[].asset->url,
          "category": category->{_id, title, slug},
          colors,
          sizes,
          shortDescription,
          longDescription
        }
      `;

      const properProduct = await fetchFromSanity(properQuery);

      if (properProduct) {
        diagnostics.push({
          test: 'GROQ Query with Dereferencing',
          status: 'pass',
          message: 'Successfully fetched product with dereferenced fields',
          details: properProduct
        });

        // Verify mainImage is a URL string
        if (typeof properProduct.mainImage === 'string' && properProduct.mainImage.includes('cdn.sanity.io')) {
          diagnostics.push({
            test: 'Image URL Format',
            status: 'pass',
            message: 'Main image is a valid CDN URL',
            details: properProduct.mainImage
          });
        } else if (typeof properProduct.mainImage === 'string' && properProduct.mainImage.length > 0) {
          diagnostics.push({
            test: 'Image URL Format',
            status: 'warning',
            message: 'Main image URL may not be from Sanity CDN',
            details: properProduct.mainImage
          });
        } else {
          diagnostics.push({
            test: 'Image URL Format',
            status: 'fail',
            message: 'Main image is not a valid URL string',
            details: properProduct.mainImage
          });
        }
      }

    } catch (error: any) {
      diagnostics.push({
        test: 'Sanity API Error',
        status: 'fail',
        message: error.message,
        details: error
      });
    }

    setResults(diagnostics);
    setLoading(false);
  }

  const StatusIcon = ({ status }: { status: 'pass' | 'fail' | 'warning' }) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    warnings: results.filter(r => r.status === 'warning').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-wine to-olive-sage p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-ivory-pearl mb-2">
                Sanity Diagnostic Tool
              </h1>
              <p className="text-ivory-pearl/70">
                Deep inspection of product data structure and GROQ queries
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-champagne-gold/20 hover:bg-champagne-gold/30 border border-champagne-gold/50 rounded-lg text-champagne-gold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Re-run Diagnostics
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-ivory-pearl">{stats.total}</div>
              <div className="text-sm text-ivory-pearl/60">Total Tests</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">{stats.passed}</div>
              <div className="text-sm text-green-300/80">Passed</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
              <div className="text-sm text-red-300/80">Failed</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">{stats.warnings}</div>
              <div className="text-sm text-yellow-300/80">Warnings</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 mb-8">
          {results.map((result, index) => (
            <div
              key={index}
              className={`backdrop-blur-xl border rounded-xl p-6 ${
                result.status === 'pass'
                  ? 'bg-green-500/10 border-green-500/30'
                  : result.status === 'fail'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <StatusIcon status={result.status} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ivory-pearl mb-2">
                    {result.test}
                  </h3>
                  <p className={`mb-3 ${
                    result.status === 'pass' ? 'text-green-300' :
                    result.status === 'fail' ? 'text-red-300' :
                    'text-yellow-300'
                  }`}>
                    {result.message}
                  </p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-ivory-pearl/60 hover:text-ivory-pearl/80 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Show Details
                      </summary>
                      <div className="mt-2 p-4 bg-black/20 border border-white/10 rounded-lg overflow-x-auto">
                        <pre className="text-xs text-ivory-pearl/80">
                          {typeof result.details === 'string' 
                            ? result.details 
                            : JSON.stringify(result.details, null, 2)
                          }
                        </pre>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Raw Data */}
        {rawData && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-ivory-pearl mb-4">
              Raw Product Data (First Product)
            </h2>
            <div className="p-4 bg-black/30 border border-white/10 rounded-lg overflow-x-auto">
              <pre className="text-xs text-green-300">
                {JSON.stringify(rawData[0], null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-gold"></div>
                <p className="text-ivory-pearl text-lg">Running diagnostics...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
