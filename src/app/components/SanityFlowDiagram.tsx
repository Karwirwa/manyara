import { useState } from 'react';
import { 
  Database, 
  Code, 
  Image as ImageIcon, 
  Layers, 
  ArrowRight, 
  Package, 
  FileCode, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileJson,
  Globe,
  Server,
  Monitor,
  Palette,
  Tag,
  ShoppingCart,
  Grid3x3
} from 'lucide-react';

export function SanityFlowDiagram() {
  const [expandedSections, setExpandedSections] = useState({
    sanitySchema: true,
    sanityContent: true,
    dataFlow: true,
    frontend: true,
    issues: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-7xl my-8">
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-[#F5F5DC]/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-4 text-[#FFFFF0]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              MANYARA Data Flow Architecture
            </h1>
            <p className="text-[#FFFFF0]/70 text-lg">
              Sanity CMS → Product Management → Frontend Components
            </p>
            <div className="mt-4 inline-block px-4 py-2 bg-[#800020]/20 rounded-full border border-[#800020]/30">
              <span className="text-[#F5F5DC] text-sm">Project ID: ximq2iuj | API Version: 2023-05-03</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-6 right-6 text-[#FFFFF0]/60 hover:text-[#FFFFF0] transition-colors"
          >
            ✕
          </button>

          {/* Main Flow Diagram */}
          <div className="space-y-6">
            
            {/* ============================================ */}
            {/* SECTION 1: SANITY CMS SCHEMA */}
            {/* ============================================ */}
            <CollapsibleSection
              title="1. SANITY CMS SCHEMA STRUCTURE"
              icon={<Database className="w-6 h-6" />}
              expanded={expandedSections.sanitySchema}
              onToggle={() => toggleSection('sanitySchema')}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Schema */}
                <SchemaCard
                  title="Category Schema"
                  icon={<Grid3x3 className="w-5 h-5 text-[#556B2F]" />}
                  fields={[
                    { name: '_id', type: 'string', required: true, description: 'Unique identifier' },
                    { name: '_type', type: 'category', required: true, description: 'Document type' },
                    { name: 'title', type: 'string', required: true, description: 'Display name (e.g., "Bras & Bralettes")' },
                    { name: 'slug.current', type: 'string', required: true, description: 'URL-friendly name (e.g., "bras-bralettes")' },
                    { name: 'description', type: 'text', required: false, description: 'Category description' },
                  ]}
                />

                {/* Product Schema */}
                <SchemaCard
                  title="Product Schema"
                  icon={<Package className="w-5 h-5 text-[#800020]" />}
                  fields={[
                    { name: '_id', type: 'string', required: true, description: 'Unique product ID' },
                    { name: '_type', type: 'product', required: true, description: 'Document type' },
                    { name: 'name', type: 'string', required: true, description: 'Product name' },
                    { name: 'slug.current', type: 'string', required: true, description: 'URL slug' },
                    { name: 'mainImage', type: 'image', required: true, description: 'Primary product image' },
                    { name: 'additionalImages[]', type: 'image[]', required: false, description: 'Gallery images' },
                    { name: 'category', type: 'reference', required: true, description: 'Reference to Category' },
                    { name: 'price', type: 'number', required: true, description: 'Price in KSh' },
                    { name: 'colors[]', type: 'string[]', required: false, description: 'Available colors array' },
                    { name: 'sizes[]', type: 'string[]', required: false, description: 'Available sizes array' },
                    { name: 'shortDescription', type: 'text', required: false, description: 'Brief description' },
                    { name: 'longDescription', type: 'text', required: false, description: 'Detailed description' },
                    { name: 'inStock', type: 'boolean', required: false, description: 'Availability status' },
                    { name: 'featured', type: 'boolean', required: false, description: 'Featured on homepage' },
                  ]}
                />
              </div>

              {/* Image Structure Explanation */}
              <div className="mt-6 p-6 bg-[#800020]/10 rounded-xl border border-[#800020]/30">
                <div className="flex items-start gap-3">
                  <ImageIcon className="w-6 h-6 text-[#F5F5DC] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-[#F5F5DC] text-lg font-semibold mb-3">Image Storage Structure</h4>
                    <div className="space-y-2 text-[#FFFFF0]/80 text-sm">
                      <p><strong>In Sanity Studio:</strong></p>
                      <code className="block bg-black/30 p-2 rounded">
                        mainImage: &#123;<br />
                        &nbsp;&nbsp;_type: "image",<br />
                        &nbsp;&nbsp;asset: &#123;<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;_ref: "image-abc123-800x600-jpg",<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;_type: "reference"<br />
                        &nbsp;&nbsp;&#125;<br />
                        &#125;
                      </code>
                      <p className="mt-3"><strong>Stored as CDN URL:</strong></p>
                      <code className="block bg-black/30 p-2 rounded break-all">
                        https://cdn.sanity.io/images/ximq2iuj/production/image-abc123-800x600-jpg.jpg
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <FlowArrow />

            {/* ============================================ */}
            {/* SECTION 2: SANITY CONTENT (What's Actually Stored) */}
            {/* ============================================ */}
            <CollapsibleSection
              title="2. ACTUAL CONTENT IN SANITY CMS"
              icon={<FileJson className="w-6 h-6" />}
              expanded={expandedSections.sanityContent}
              onToggle={() => toggleSection('sanityContent')}
            >
              <div className="space-y-4">
                <div className="p-4 bg-[#556B2F]/10 rounded-xl border border-[#556B2F]/30">
                  <h4 className="text-[#F5F5DC] font-semibold mb-2">What to Check in Sanity Studio:</h4>
                  <ol className="space-y-2 text-[#FFFFF0]/80 text-sm list-decimal list-inside">
                    <li>Go to: <code className="bg-black/30 px-2 py-1 rounded">https://ximq2iuj.sanity.studio</code></li>
                    <li>Check <strong>Categories</strong> → Verify all have <code>title</code> and <code>slug.current</code></li>
                    <li>Check <strong>Products</strong> → Verify each has:
                      <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                        <li><strong>mainImage:</strong> Image uploaded and visible</li>
                        <li><strong>additionalImages:</strong> Array with images (optional)</li>
                        <li><strong>category:</strong> Reference link to a category (not empty)</li>
                        <li><strong>colors:</strong> Array with color names (e.g., ["Black", "Red", "White"])</li>
                        <li><strong>sizes:</strong> Array with size options (e.g., ["S", "M", "L", "XL"])</li>
                        <li><strong>price:</strong> Number value (e.g., 3500)</li>
                        <li><strong>shortDescription & longDescription:</strong> Text content</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* Example Product Data */}
                <div className="p-4 bg-black/20 rounded-xl border border-[#FFFFF0]/20">
                  <h4 className="text-[#F5F5DC] font-semibold mb-2">Example Product in Sanity:</h4>
                  <pre className="text-xs text-[#FFFFF0]/70 overflow-x-auto">
{`{
  "_id": "product-001",
  "_type": "product",
  "name": "Luxury Lace Bralette",
  "slug": { "current": "luxury-lace-bralette" },
  "mainImage": {
    "_type": "image",
    "asset": {
      "_ref": "image-a1b2c3d4e5f6-1024x768-jpg",
      "_type": "reference"
    }
  },
  "additionalImages": [
    { "asset": { "_ref": "image-xyz123-1024x768-jpg" } },
    { "asset": { "_ref": "image-abc456-1024x768-jpg" } }
  ],
  "category": {
    "_ref": "category-bras-bralettes",
    "_type": "reference"
  },
  "price": 3500,
  "colors": ["Black", "Burgundy Wine", "Ivory Pearl"],
  "sizes": ["S", "M", "L", "XL"],
  "shortDescription": "Delicate lace bralette with adjustable straps",
  "longDescription": "Experience ultimate comfort...",
  "inStock": true,
  "featured": true
}`}
                  </pre>
                </div>
              </div>
            </CollapsibleSection>

            <FlowArrow />

            {/* ============================================ */}
            {/* SECTION 3: DATA FLOW & TRANSFORMATION */}
            {/* ============================================ */}
            <CollapsibleSection
              title="3. DATA FLOW & TRANSFORMATION"
              icon={<ArrowRight className="w-6 h-6" />}
              expanded={expandedSections.dataFlow}
              onToggle={() => toggleSection('dataFlow')}
            >
              <div className="space-y-6">
                
                {/* Step 1: Sanity Client */}
                <FlowStep
                  number={1}
                  title="Sanity Client Connection"
                  file="/utils/sanity/client.ts"
                  icon={<Globe className="w-5 h-5" />}
                >
                  <div className="space-y-2 text-sm">
                    <p className="text-[#FFFFF0]/80">Establishes connection to Sanity CMS:</p>
                    <code className="block bg-black/30 p-3 rounded text-xs">
                      {`import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'ximq2iuj',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true, // Fast CDN delivery
  perspective: 'published' // Only published content
});`}
                    </code>
                    <div className="mt-3 p-2 bg-[#556B2F]/20 rounded">
                      <p className="text-[#F5F5DC] text-xs"><strong>Key Function:</strong> <code>fetchFromSanity(query)</code></p>
                      <p className="text-[#FFFFF0]/70 text-xs mt-1">Executes GROQ queries and returns typed results</p>
                    </div>
                  </div>
                </FlowStep>

                <div className="flex justify-center"><ArrowRight className="w-6 h-6 text-[#F5F5DC]" /></div>

                {/* Step 2: Product Service */}
                <FlowStep
                  number={2}
                  title="Product Service & GROQ Queries"
                  file="/utils/sanity/productService.ts"
                  icon={<Server className="w-5 h-5" />}
                >
                  <div className="space-y-3 text-sm">
                    <p className="text-[#FFFFF0]/80">GROQ query to fetch products with dereferenced data:</p>
                    <code className="block bg-black/30 p-3 rounded text-xs overflow-x-auto">
{`*[_type == "product"] {
  _id,
  name,
  slug,
  "mainImage": mainImage.asset->url,  // ← Dereferences to full URL
  "additionalImages": additionalImages[].asset->url,  // ← Array of URLs
  "category": category->{  // ← Expands category reference
    _id,
    title,
    slug,
    description
  },
  price,
  colors,  // ← Direct array access
  sizes,   // ← Direct array access
  shortDescription,
  longDescription,
  inStock,
  featured
}`}
                    </code>
                    
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-[#800020]/20 rounded border border-[#800020]/30">
                        <p className="text-[#F5F5DC] font-semibold text-xs mb-2">🔍 Critical Operator: <code>-&gt;</code></p>
                        <p className="text-[#FFFFF0]/70 text-xs">
                          <strong>mainImage.asset-&gt;url</strong><br />
                          Follows the reference and extracts the URL property
                        </p>
                      </div>
                      
                      <div className="p-3 bg-[#556B2F]/20 rounded border border-[#556B2F]/30">
                        <p className="text-[#F5F5DC] font-semibold text-xs mb-2">📦 Critical Operator: <code>[]</code></p>
                        <p className="text-[#FFFFF0]/70 text-xs">
                          <strong>additionalImages[].asset-&gt;url</strong><br />
                          Maps over array and dereferences each image
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-blue-500/10 rounded border border-blue-500/30">
                      <p className="text-[#F5F5DC] font-semibold text-xs mb-2">🔄 Normalization Function:</p>
                      <p className="text-[#FFFFF0]/70 text-xs">
                        <code>normalizeProduct(sanityProduct)</code> transforms Sanity format to app format:
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-[#FFFFF0]/60 list-disc list-inside">
                        <li>Adds optimization params to image URLs (w=800, q=85, auto=format)</li>
                        <li>Formats price: <code>3500 → "KSh 3,500"</code></li>
                        <li>Sets defaults: <code>sizes: ["One Size"], colors: ["Standard"]</code></li>
                        <li>Extracts category title and slug</li>
                      </ul>
                    </div>
                  </div>
                </FlowStep>

                <div className="flex justify-center"><ArrowRight className="w-6 h-6 text-[#F5F5DC]" /></div>

                {/* Step 3: Type Definitions */}
                <FlowStep
                  number={3}
                  title="TypeScript Type System"
                  file="/utils/sanity/types.ts"
                  icon={<FileCode className="w-5 h-5" />}
                >
                  <div className="space-y-3 text-sm">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 bg-black/30 rounded">
                        <p className="text-[#F5F5DC] font-semibold text-xs mb-2">Before GROQ (Raw):</p>
                        <code className="text-xs text-[#FFFFF0]/70">
{`SanityProductRaw {
  mainImage: {
    _type: "image",
    asset: {
      _ref: "image-abc...",
      _type: "reference"
    }
  },
  colors?: string[],
  sizes?: string[]
}`}
                        </code>
                      </div>

                      <div className="p-3 bg-black/30 rounded">
                        <p className="text-[#F5F5DC] font-semibold text-xs mb-2">After GROQ (Dereferenced):</p>
                        <code className="text-xs text-[#FFFFF0]/70">
{`SanityProductWithCategory {
  mainImage: string, // Full URL
  additionalImages?: string[], // Array of URLs
  colors?: string[], // ["Black", "Red"]
  sizes?: string[] // ["S", "M", "L"]
}`}
                        </code>
                      </div>
                    </div>

                    <div className="p-3 bg-[#800020]/10 rounded border border-[#800020]/30">
                      <p className="text-[#F5F5DC] font-semibold text-xs mb-2">Final App Type:</p>
                      <code className="text-xs text-[#FFFFF0]/70">
{`Product {
  id: string,
  name: string,
  imageUrl: string, // Optimized URL with params
  additionalImages: string[], // Optimized URLs
  colors: string[], // Default: ["Standard"]
  sizes: string[], // Default: ["One Size"]
  category: string, // Title from reference
  categorySlug?: string, // Slug for routing
  price: number,
  priceFormatted: string // "KSh 3,500"
}`}
                      </code>
                    </div>
                  </div>
                </FlowStep>
              </div>
            </CollapsibleSection>

            <FlowArrow />

            {/* ============================================ */}
            {/* SECTION 4: FRONTEND COMPONENTS */}
            {/* ============================================ */}
            <CollapsibleSection
              title="4. FRONTEND COMPONENTS (Data Consumers)"
              icon={<Monitor className="w-6 h-6" />}
              expanded={expandedSections.frontend}
              onToggle={() => toggleSection('frontend')}
            >
              <div className="space-y-4">
                
                {/* Component Flow */}
                <div className="grid md:grid-cols-3 gap-4">
                  <ComponentCard
                    title="App.tsx"
                    icon={<Layers className="w-5 h-5" />}
                    role="Router & State Manager"
                    consumes={['categories', 'products']}
                    functions={[
                      'Manages page navigation',
                      'Holds selected category state',
                      'Passes data to child components'
                    ]}
                  />

                  <ComponentCard
                    title="CollectionPage.tsx"
                    icon={<Grid3x3 className="w-5 h-5" />}
                    role="Product Listing"
                    consumes={['products', 'categories']}
                    functions={[
                      'Calls fetchProducts()',
                      'Filters by category',
                      'Maps to ProductCard'
                    ]}
                  />

                  <ComponentCard
                    title="ProductCard.tsx"
                    icon={<Package className="w-5 h-5" />}
                    role="Product Display"
                    consumes={['product.imageUrl', 'product.colors', 'product.sizes']}
                    functions={[
                      'Displays mainImage',
                      'Shows available colors',
                      'Renders size options'
                    ]}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <ComponentCard
                    title="ProductModal.tsx"
                    icon={<Eye className="w-5 h-5" />}
                    role="Product Details"
                    consumes={['product (full object)']}
                    functions={[
                      'Displays mainImage & gallery',
                      'Color/size selection UI',
                      'Add to cart functionality',
                      'Shows descriptions'
                    ]}
                  />

                  <ComponentCard
                    title="AdminPage.tsx"
                    icon={<Database className="w-5 h-5" />}
                    role="Product Management"
                    consumes={['all products']}
                    functions={[
                      'Calls fetchProducts()',
                      'Displays product list',
                      'Links to Sanity Studio',
                      'Shows debug info'
                    ]}
                  />

                  <ComponentCard
                    title="CategoriesShowcase.tsx"
                    icon={<Grid3x3 className="w-5 h-5" />}
                    role="Category Navigation"
                    consumes={['categories']}
                    functions={[
                      'Calls fetchCategories()',
                      'Displays category cards',
                      'Handles category clicks',
                      'Routes to collection page'
                    ]}
                  />
                </div>

                {/* Data Access Pattern */}
                <div className="p-4 bg-[#556B2F]/10 rounded-xl border border-[#556B2F]/30">
                  <h4 className="text-[#F5F5DC] font-semibold mb-3">Typical Component Data Access:</h4>
                  <code className="block bg-black/30 p-3 rounded text-xs overflow-x-auto">
{`import { fetchProducts } from '../utils/sanity/productService';

function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts(); // ← Calls Sanity
      setProducts(data); // ← Stores in state
    }
    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          imageUrl={product.imageUrl}  // ← Uses dereferenced URL
          price={product.priceFormatted}
          availableColors={product.colors}  // ← Uses array directly
        />
      ))}
    </div>
  );
}`}
                  </code>
                </div>
              </div>
            </CollapsibleSection>

            <FlowArrow />

            {/* ============================================ */}
            {/* SECTION 5: COMMON ISSUES & DIAGNOSTICS */}
            {/* ============================================ */}
            <CollapsibleSection
              title="5. COMMON ISSUES & DIAGNOSTIC CHECKLIST"
              icon={<AlertCircle className="w-6 h-6" />}
              expanded={expandedSections.issues}
              onToggle={() => toggleSection('issues')}
            >
              <div className="space-y-4">
                
                {/* Images Issues */}
                <IssueCard
                  title="🖼️ IMAGES NOT DISPLAYING"
                  severity="high"
                  checks={[
                    {
                      issue: 'Images show placeholder or 404',
                      causes: [
                        'mainImage field is empty in Sanity',
                        'GROQ query missing mainImage.asset->url',
                        'Image reference is broken',
                        'CDN URL is malformed'
                      ],
                      solutions: [
                        'Check Sanity Studio: Open product → Verify mainImage has uploaded image',
                        'Check GROQ query in productService.ts: Must have "mainImage": mainImage.asset->url',
                        'Check browser console: Look for 404 errors on cdn.sanity.io URLs',
                        'Test URL directly: Copy image URL from console, paste in browser',
                        'Verify image optimization params: Should have ?w=800&q=85&auto=format'
                      ]
                    },
                    {
                      issue: 'additionalImages not showing in gallery',
                      causes: [
                        'additionalImages array is empty',
                        'GROQ query missing []  operator',
                        'Images not uploaded to Sanity'
                      ],
                      solutions: [
                        'Check Sanity Studio: Product → additionalImages → Upload images',
                        'Verify GROQ: "additionalImages": additionalImages[].asset->url',
                        'Check console log: normalizeProduct should log additionalImages count',
                        'Ensure ProductModal maps over product.additionalImages array'
                      ]
                    }
                  ]}
                />

                {/* Colors & Sizes Issues */}
                <IssueCard
                  title="🎨 COLORS & SIZES ISSUES"
                  severity="medium"
                  checks={[
                    {
                      issue: 'Colors showing as ["Standard"] instead of actual colors',
                      causes: [
                        'colors array is empty/undefined in Sanity',
                        'colors field not included in GROQ query',
                        'Normalization defaulting to ["Standard"]'
                      ],
                      solutions: [
                        'Check Sanity Studio: Product → colors → Add array items (e.g., "Black", "Red")',
                        'Verify GROQ query includes: colors',
                        'Check console: normalizeProduct should log colors array',
                        'Ensure ProductModal and ProductCard read product.colors'
                      ]
                    },
                    {
                      issue: 'Sizes showing as ["One Size"]',
                      causes: [
                        'sizes array is empty/undefined',
                        'sizes not in GROQ query',
                        'Default fallback being applied'
                      ],
                      solutions: [
                        'Check Sanity Studio: Product → sizes → Add array items (e.g., "S", "M", "L")',
                        'Verify GROQ includes: sizes',
                        'Check normalization: Should only default if sizes is null/undefined'
                      ]
                    }
                  ]}
                />

                {/* Category Issues */}
                <IssueCard
                  title="📂 CATEGORY ISSUES"
                  severity="medium"
                  checks={[
                    {
                      issue: 'Category shows "Uncategorized"',
                      causes: [
                        'category reference is null/empty',
                        'Referenced category was deleted',
                        'GROQ not dereferencing category'
                      ],
                      solutions: [
                        'Check Sanity Studio: Product → category → Select a category',
                        'Verify category exists: Go to Categories → Check it\'s published',
                        'Verify GROQ: "category": category->{ _id, title, slug, description }',
                        'Check console: Should log category.title'
                      ]
                    },
                    {
                      issue: 'Category filtering not working',
                      causes: [
                        'categorySlug is undefined',
                        'slug.current not dereferenced',
                        'CollectionPage not filtering correctly'
                      ],
                      solutions: [
                        'Check GROQ: slug should be dereferenced as slug.current',
                        'Verify normalized product has categorySlug property',
                        'Check CollectionPage filter logic',
                        'Ensure CategoriesShowcase passes correct category slug'
                      ]
                    }
                  ]}
                />

                {/* Description Issues */}
                <IssueCard
                  title="📝 DESCRIPTIONS MISSING"
                  severity="low"
                  checks={[
                    {
                      issue: 'shortDescription or longDescription empty',
                      causes: [
                        'Fields not filled in Sanity',
                        'GROQ not fetching these fields',
                        'UI component not displaying them'
                      ],
                      solutions: [
                        'Check Sanity Studio: Product → Fill in shortDescription & longDescription',
                        'Verify GROQ includes: shortDescription, longDescription',
                        'Check ProductModal: Should render longDescription',
                        'Check ProductCard: Should render shortDescription (if designed to)'
                      ]
                    }
                  ]}
                />

                {/* Browser Console Checks */}
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <h4 className="text-[#F5F5DC] font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Browser Console Debugging
                  </h4>
                  <div className="space-y-2 text-xs text-[#FFFFF0]/80">
                    <p><strong>1. Check Sanity API calls:</strong></p>
                    <code className="block bg-black/30 p-2 rounded">
                      Look for: "📦 Fetching products from Sanity CMS..."<br />
                      Then: "✅ Loaded X products from Sanity CMS"
                    </code>

                    <p className="mt-3"><strong>2. Check normalized product data:</strong></p>
                    <code className="block bg-black/30 p-2 rounded">
                      Look for: "🔍 Normalizing product:"<br />
                      Should show: name, mainImage (URL), additionalImages (count), colors (array), sizes (array)
                    </code>

                    <p className="mt-3"><strong>3. Check for errors:</strong></p>
                    <code className="block bg-black/30 p-2 rounded">
                      Red errors like "Failed to fetch from Sanity"<br />
                      404 errors on cdn.sanity.io URLs<br />
                      "mainImage is undefined" warnings
                    </code>

                    <p className="mt-3"><strong>4. Network tab inspection:</strong></p>
                    <code className="block bg-black/30 p-2 rounded">
                      Check XHR/Fetch for: ximq2iuj.api.sanity.io<br />
                      Verify: Status 200, response contains products array<br />
                      Check image URLs: cdn.sanity.io/images/ximq2iuj/...
                    </code>
                  </div>
                </div>

                {/* Quick Fix Checklist */}
                <div className="p-4 bg-[#800020]/10 rounded-xl border border-[#800020]/30">
                  <h4 className="text-[#F5F5DC] font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Quick Fix Checklist (Do in Order)
                  </h4>
                  <ol className="space-y-2 text-sm text-[#FFFFF0]/80 list-decimal list-inside">
                    <li><strong>Sanity Studio Check:</strong> Open https://ximq2iuj.sanity.studio
                      <ul className="ml-6 mt-1 space-y-1 text-xs list-disc list-inside">
                        <li>Verify all products have images uploaded</li>
                        <li>Verify colors and sizes arrays are filled</li>
                        <li>Verify category is selected</li>
                        <li>Verify descriptions are written</li>
                      </ul>
                    </li>
                    <li><strong>GROQ Query Check:</strong> Open /utils/sanity/productService.ts
                      <ul className="ml-6 mt-1 space-y-1 text-xs list-disc list-inside">
                        <li>Ensure: "mainImage": mainImage.asset-&gt;url</li>
                        <li>Ensure: "additionalImages": additionalImages[].asset-&gt;url</li>
                        <li>Ensure: "category": category-&gt;&#123;...&#125;</li>
                        <li>Ensure: colors, sizes, descriptions are included</li>
                      </ul>
                    </li>
                    <li><strong>TypeScript Types:</strong> Check /utils/sanity/types.ts
                      <ul className="ml-6 mt-1 space-y-1 text-xs list-disc list-inside">
                        <li>SanityProductWithCategory.mainImage should be: string</li>
                        <li>SanityProductWithCategory.additionalImages should be: string[]</li>
                        <li>Product types should match component props</li>
                      </ul>
                    </li>
                    <li><strong>Console Logs:</strong> Open browser console (F12)
                      <ul className="ml-6 mt-1 space-y-1 text-xs list-disc list-inside">
                        <li>Check for successful Sanity fetch logs</li>
                        <li>Check normalized product sample</li>
                        <li>Look for any error messages</li>
                      </ul>
                    </li>
                    <li><strong>Component Props:</strong> Verify ProductCard and ProductModal
                      <ul className="ml-6 mt-1 space-y-1 text-xs list-disc list-inside">
                        <li>ProductCard receives: imageUrl, colors (as availableColors)</li>
                        <li>ProductModal receives: full product object with all fields</li>
                        <li>Check prop names match exactly</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Summary Footer */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#800020]/20 to-[#556B2F]/20 rounded-xl border border-[#F5F5DC]/20">
            <h3 className="text-[#F5F5DC] text-xl font-semibold mb-4 text-center">
              Data Flow Summary
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#FFFFF0]/80">
              <span className="px-4 py-2 bg-black/30 rounded-full">Sanity Studio</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">GROQ Query</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">Dereference (→)</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">Normalize</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">Type Conversion</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">Component Props</span>
              <ArrowRight className="w-5 h-5" />
              <span className="px-4 py-2 bg-black/30 rounded-full">UI Render</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, expanded, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-[#F5F5DC]/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-[#FFFFF0]/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#F5F5DC]">{icon}</div>
          <h2 className="text-xl text-[#FFFFF0] font-semibold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {title}
          </h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-6 h-6 text-[#F5F5DC]" />
        ) : (
          <ChevronDown className="w-6 h-6 text-[#F5F5DC]" />
        )}
      </button>
      {expanded && (
        <div className="p-6 pt-0 border-t border-[#FFFFF0]/10">
          {children}
        </div>
      )}
    </div>
  );
}

interface SchemaCardProps {
  title: string;
  icon: React.ReactNode;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

function SchemaCard({ title, icon, fields }: SchemaCardProps) {
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-[#FFFFF0]/20">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-[#F5F5DC] font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.name} className="text-xs">
            <div className="flex items-center justify-between">
              <code className="text-[#F5F5DC]">{field.name}</code>
              <span className="text-[#FFFFF0]/50 text-[10px]">{field.type}</span>
            </div>
            <p className="text-[#FFFFF0]/60 text-[10px] mt-1">{field.description}</p>
            {field.required && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#800020]/30 text-[#F5F5DC] text-[9px] rounded">Required</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface FlowStepProps {
  number: number;
  title: string;
  file: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FlowStep({ number, title, file, icon, children }: FlowStepProps) {
  return (
    <div className="relative p-6 bg-gradient-to-br from-[#800020]/10 to-[#556B2F]/10 rounded-xl border border-[#F5F5DC]/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#800020] rounded-full flex items-center justify-center text-[#FFFFF0] font-bold text-xl">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[#F5F5DC]">{icon}</div>
            <h3 className="text-[#F5F5DC] text-lg font-semibold">{title}</h3>
          </div>
          <code className="text-xs text-[#FFFFF0]/50 mb-4 block">{file}</code>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ComponentCardProps {
  title: string;
  icon: React.ReactNode;
  role: string;
  consumes: string[];
  functions: string[];
}

function ComponentCard({ title, icon, role, consumes, functions }: ComponentCardProps) {
  return (
    <div className="p-4 bg-black/20 rounded-xl border border-[#FFFFF0]/20">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div>
          <h4 className="text-[#F5F5DC] font-semibold text-sm">{title}</h4>
          <p className="text-[#FFFFF0]/50 text-xs">{role}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-[#F5F5DC] text-xs font-semibold mb-1">Consumes:</p>
          <ul className="space-y-1">
            {consumes.map((item, idx) => (
              <li key={idx} className="text-[#FFFFF0]/70 text-xs">• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[#F5F5DC] text-xs font-semibold mb-1">Functions:</p>
          <ul className="space-y-1">
            {functions.map((func, idx) => (
              <li key={idx} className="text-[#FFFFF0]/70 text-xs">• {func}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface IssueCardProps {
  title: string;
  severity: 'high' | 'medium' | 'low';
  checks: Array<{
    issue: string;
    causes: string[];
    solutions: string[];
  }>;
}

function IssueCard({ title, severity, checks }: IssueCardProps) {
  const severityColors = {
    high: 'border-red-500/50 bg-red-500/5',
    medium: 'border-yellow-500/50 bg-yellow-500/5',
    low: 'border-blue-500/50 bg-blue-500/5',
  };

  return (
    <div className={`p-4 rounded-xl border ${severityColors[severity]}`}>
      <h4 className="text-[#F5F5DC] font-semibold mb-3">{title}</h4>
      <div className="space-y-4">
        {checks.map((check, idx) => (
          <div key={idx} className="space-y-2">
            <p className="text-[#FFFFF0]/90 text-sm font-semibold">❌ {check.issue}</p>
            
            <div className="ml-4">
              <p className="text-[#FFFFF0]/70 text-xs font-semibold mb-1">Possible Causes:</p>
              <ul className="space-y-1">
                {check.causes.map((cause, cIdx) => (
                  <li key={cIdx} className="text-[#FFFFF0]/60 text-xs">• {cause}</li>
                ))}
              </ul>
            </div>

            <div className="ml-4">
              <p className="text-[#F5F5DC] text-xs font-semibold mb-1">✅ Solutions:</p>
              <ol className="space-y-1 list-decimal list-inside">
                {check.solutions.map((solution, sIdx) => (
                  <li key={sIdx} className="text-[#FFFFF0]/80 text-xs">{solution}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center">
        <ArrowRight className="w-8 h-8 text-[#F5F5DC] rotate-90" />
        <div className="w-px h-4 bg-[#F5F5DC]/30" />
      </div>
    </div>
  );
}
