/* 
 * MANYARA Backend API - Single File Version for Dashboard Deployment
 * 
 * This is a combined version of index.tsx and kv_store.tsx
 * Use this file to deploy via Supabase Dashboard
 * 
 * Instructions:
 * 1. Go to https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot
 * 2. Click "Edge Functions" in left sidebar
 * 3. Click "Create Function"
 * 4. Name: make-server-5cb00c7d
 * 5. Copy and paste this entire file
 * 6. Click "Deploy"
 */

import { Hono } from "jsr:@hono/hono@4";
import { cors } from "jsr:@hono/hono@4/cors";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================
// KV STORE MODULE (inline version of kv_store.tsx)
// ============================================

const supabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

// Set stores a key-value pair in the database.
const kvSet = async (key: string, value: any): Promise<void> => {
  const supabase = supabaseClient();
  const { error } = await supabase.from("kv_store_5cb00c7d").upsert({
    key,
    value
  });
  if (error) {
    throw new Error(error.message);
  }
};

// Get retrieves a key-value pair from the database.
const kvGet = async (key: string): Promise<any> => {
  const supabase = supabaseClient();
  const { data, error } = await supabase.from("kv_store_5cb00c7d").select("value").eq("key", key).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data?.value;
};

// Delete deletes a key-value pair from the database.
const kvDel = async (key: string): Promise<void> => {
  const supabase = supabaseClient();
  const { error } = await supabase.from("kv_store_5cb00c7d").delete().eq("key", key);
  if (error) {
    throw new Error(error.message);
  }
};

// Search for key-value pairs by prefix.
const kvGetByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = supabaseClient();
  const { data, error } = await supabase.from("kv_store_5cb00c7d").select("key, value").like("key", prefix + "%");
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((d) => d.value) ?? [];
};

// ============================================
// MAIN APPLICATION
// ============================================

const app = new Hono();

// Enable CORS for all routes with proper configuration
app.use("/*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Sanity CMS configuration
const SANITY_PROJECT_ID = Deno.env.get("SANITY_PROJECT_ID") || "ximq2iuj";
const SANITY_DATASET = Deno.env.get("SANITY_DATASET") || "production";
const SANITY_API_VERSION = "2024-01-01";

// Business configuration
const BUSINESS_EMAIL = "rispahkarwirwa@gmail.com";
const BUSINESS_PHONE = "+254797040512";
const MPESA_TILL_NUMBER = "7121042";

// Category normalization utility (server-side version)
const CANONICAL_CATEGORIES: Record<string, string> = {
  "Bodyshapers": "Bodyshapers",
  "Body Shapers": "Bodyshapers",
  "Bodyshaper": "Bodyshapers",
  "Body Shaper": "Bodyshapers",
  "Bodystockings": "Bodystockings",
  "Bodystocking": "Bodystockings",
  "Body Stockings": "Bodystockings",
  "Body Stocking": "Bodystockings",
  "Bras": "Bras",
  "Bra": "Bras",
  "Bridal Lingerie": "Bridal Lingerie",
  "Bridal": "Bridal Lingerie",
  "Bridal lingerie": "Bridal Lingerie",
  "Corsets": "Corsets",
  "Corset": "Corsets",
  "Leather Lingerie": "Leather Lingerie",
  "Leather lingerie": "Leather Lingerie",
  "Leather": "Leather Lingerie",
  "Lingerie 2-piece sets": "Lingerie 2-piece sets",
  "Lingerie 2 piece sets": "Lingerie 2-piece sets",
  "Lingerie 2-Piece Sets": "Lingerie 2-piece sets",
  "Lingerie 2 Piece Set": "Lingerie 2-piece sets",
  "Lingerie Sets": "Lingerie 2-piece sets",
  "2-piece sets": "Lingerie 2-piece sets",
  "2 piece sets": "Lingerie 2-piece sets",
  "Nightgowns": "Nightgowns",
  "Nightgown": "Nightgowns",
  "Night Gowns": "Nightgowns",
  "Night Gown": "Nightgowns",
  "Panties": "Panties",
  "Panty": "Panties",
  "Shapewear": "Shapewear",
  "Shape Wear": "Shapewear",
  "Shape wear": "Shapewear",
  "Sissy Lingerie": "Sissy Lingerie",
  "Sissy lingerie": "Sissy Lingerie",
  "Sissy": "Sissy Lingerie",
  "Sleepwear": "Sleepwear",
  "Sleepwear Set": "Sleepwear",
  "Sleepwear set": "Sleepwear",
  "Thongs": "Thongs",
  "Thong": "Thongs",
  "Uncategorized": "Uncategorized",
};

function normalizeCategory(category: string | null | undefined): string {
  if (!category || category.trim() === '') return "Uncategorized";
  const trimmed = category.trim();
  
  // Try exact match
  if (CANONICAL_CATEGORIES[trimmed]) return CANONICAL_CATEGORIES[trimmed];
  
  // Try case-insensitive match
  const lowerCategory = trimmed.toLowerCase();
  for (const [alias, canonical] of Object.entries(CANONICAL_CATEGORIES)) {
    if (alias.toLowerCase() === lowerCategory) return canonical;
  }
  
  // Return original if no match
  return trimmed;
}

// GROQ query to fetch products with category title
const PRODUCTS_QUERY = `*[_type == "product"]{
  _id,
  name,
  price,
  sizes,
  color,
  "category": category->title,
  "imageUrl": image.asset->url,
  shortDescription,
  longDescription,
  "additionalImages": additionalImages[].asset->url
}`;

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ 
    status: "ok",
    message: "MANYARA Backend API",
    timestamp: new Date().toISOString()
  });
});

// Fetch products from Sanity CMS
app.get("/sanity-products", async (c) => {
  try {
    // Try with perspective=published to get latest published content (bypass CDN cache)
    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(PRODUCTS_QUERY)}&perspective=published`;
    
    console.log('🔍 Fetching from Sanity:', sanityUrl.substring(0, 100) + '...');
    
    const response = await fetch(sanityUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Sanity API error:', response.status, errorText);
      throw new Error(`Sanity API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    console.log('📦 Sanity raw response:', JSON.stringify(data).substring(0, 200) + '...');
    console.log('📊 Total products returned:', data.result?.length || 0);
    
    if (data.result && data.result.length > 0) {
      console.log('📷 First product image check:', {
        name: data.result[0].name,
        imageUrl: data.result[0].imageUrl,
        imageField: data.result[0].image,
        hasImageUrl: !!data.result[0].imageUrl
      });
    }
    
    // Category fallback images for products missing images in Sanity
    const categoryFallbackImages: Record<string, string> = {
      "Bodyshapers": "https://images.unsplash.com/photo-1646932520067-81bdc09af07a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Bodystockings": "https://images.unsplash.com/photo-1738789646880-4588ebf14dd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Bras": "https://images.unsplash.com/photo-1588626891775-90dbb59a83fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Bridal Lingerie": "https://images.unsplash.com/photo-1588626891775-90dbb59a83fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Corsets": "https://images.unsplash.com/photo-1750032651184-dcf6808da7c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Leather Lingerie": "https://images.unsplash.com/photo-1630858202171-c8cc4544fe16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Lingerie 2-piece sets": "https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Nightgowns": "https://images.unsplash.com/photo-1694875464363-5ef8ffd6a9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Panties": "https://images.unsplash.com/photo-1677070041822-eb487df50859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Shapewear": "https://images.unsplash.com/photo-1646932520067-81bdc09af07a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Sissy Lingerie": "https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Sleepwear": "https://images.unsplash.com/photo-1766056278986-af4b8a4fdae7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "Thongs": "https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    };
    
    let productsWithoutImages = 0;
    
    // Transform Sanity products to app format
    const products = data.result.map((product: any, index: number) => {
      const hasImage = product.imageUrl && product.imageUrl.trim() !== '';
      
      if (!hasImage) {
        productsWithoutImages++;
        console.log(`📷 Missing image for product: "${product.name}" (category: ${product.category})`);
      } else {
        // Check if it's a real Sanity CDN URL or something else
        const isSanityCDN = product.imageUrl.includes('cdn.sanity.io');
        if (isSanityCDN) {
          console.log(`✅ Real Sanity image for: "${product.name}" - ${product.imageUrl.substring(0, 60)}...`);
        } else {
          console.log(`⚠️ Non-Sanity URL for: "${product.name}" - ${product.imageUrl.substring(0, 60)}...`);
        }
      }
      
      // Use category fallback if product has no image
      const fallbackImage = categoryFallbackImages[product.category] || 
                           "https://images.unsplash.com/photo-1575272775908-7332223be38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
      
      // Normalize category with logging
      const rawCategory = product.category;
      const normalizedCategory = normalizeCategory(rawCategory);
      
      // Log normalization for debugging
      if (rawCategory !== normalizedCategory) {
        console.log(`🔄 Category normalized: "${rawCategory}" → "${normalizedCategory}"`);
      }
      
      return {
        id: index + 1,
        name: product.name || "Untitled Product",
        imageUrl: hasImage ? product.imageUrl : fallbackImage,
        price: product.price ? `KSh ${product.price.toLocaleString()}` : "Price N/A",
        category: normalizedCategory || "Uncategorized",
        colors: product.color ? [product.color] : [],
        sizes: product.sizes || [],
        shortDescription: product.shortDescription || "",
        longDescription: product.longDescription || "",
        additionalImages: product.additionalImages || []
      };
    });
    
    if (productsWithoutImages > 0) {
      console.log(`⚠️ ${productsWithoutImages} products are missing images in Sanity CMS. Using category fallback images.`);
      console.log("💡 To fix: Upload images to these products in Sanity Studio (https://ximq2iuj.sanity.studio)");
    } else {
      console.log(`✅ All ${products.length} products have images!`);
    }
    
    // Log category distribution
    const categoryCount = new Map<string, number>();
    products.forEach((p: any) => {
      categoryCount.set(p.category, (categoryCount.get(p.category) || 0) + 1);
    });
    console.log(`📊 Category distribution:`, Object.fromEntries(categoryCount));
    
    return c.json({
      success: true,
      products,
      count: products.length,
      source: "sanity",
      productsWithoutImages
    });
    
  } catch (error) {
    console.error("Error fetching from Sanity:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Unknown error",
      products: []
    }, 500);
  }
});

// Fallback products endpoint (returns empty to force Sanity usage)
app.get("/products", (c) => {
  return c.json({
    success: false,
    message: "Please use /sanity-products endpoint",
    products: []
  });
});

// DEBUG: Raw Sanity response (unprocessed)
app.get("/sanity-raw", async (c) => {
  try {
    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(PRODUCTS_QUERY)}&perspective=published`;
    
    console.log('🔍 [DEBUG] Fetching raw Sanity data...');
    console.log('🔗 [DEBUG] URL:', sanityUrl);
    
    const response = await fetch(sanityUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return c.json({
        success: false,
        error: `Sanity API returned ${response.status}`,
        errorText,
        url: sanityUrl
      }, response.status);
    }
    
    const data = await response.json();
    
    console.log('✅ [DEBUG] Sanity responded with', data.result?.length || 0, 'products');
    
    return c.json({
      success: true,
      rawData: data,
      productCount: data.result?.length || 0,
      firstProduct: data.result?.[0] || null,
      url: sanityUrl,
      message: "This is the raw, unprocessed response from Sanity CMS"
    });
  } catch (error) {
    console.error('❌ [DEBUG] Error:', error);
    return c.json({
      success: false,
      error: (error as Error).message
    }, 500);
  }
});

// M-Pesa Payment Initiation
app.post("/mpesa/initiate", async (c) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = await c.req.json();
    
    // TODO: Integrate with actual M-Pesa API
    // For now, return a mock response
    const checkoutRequestID = `MOCK-${Date.now()}`;
    
    return c.json({
      success: true,
      message: "Payment initiated successfully",
      checkoutRequestID,
      phoneNumber,
      amount
    });
  } catch (error) {
    console.error("M-Pesa initiation error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Payment initiation failed"
    }, 500);
  }
});

// M-Pesa Payment Status Check
app.get("/mpesa/status/:checkoutRequestID", async (c) => {
  try {
    const { checkoutRequestID } = c.req.param();
    
    // TODO: Check actual M-Pesa payment status
    // For now, return a mock completed status after 5 seconds
    const transactionId = `MPesa-${Date.now()}`;
    
    return c.json({
      success: true,
      status: "completed",
      transactionId,
      message: "Payment completed successfully"
    });
  } catch (error) {
    console.error("M-Pesa status check error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Status check failed"
    }, 500);
  }
});

// Create Order
app.post("/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    
    // Generate order ID
    const orderId = `ORD-${Date.now()}`;
    
    // TODO: Save to database (Supabase)
    console.log("Order created:", orderId, orderData);
    
    return c.json({
      success: true,
      orderId,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Order creation failed"
    }, 500);
  }
});

// Upload products to KV store (for Admin Panel)
app.post("/products", async (c) => {
  try {
    const body = await c.req.json();
    const products = body.products;

    if (!Array.isArray(products)) {
      return c.json({
        success: false,
        error: "Invalid request: products must be an array"
      }, 400);
    }

    console.log(`Uploading ${products.length} products to KV store...`);

    // Store each product in KV store
    for (const product of products) {
      const key = `product:${product.id}`;
      await kvSet(key, product);
      console.log(`Stored product: ${key}`);
    }

    // Store product count metadata
    await kvSet("products:count", products.length);

    return c.json({
      success: true,
      message: `Successfully uploaded ${products.length} products`,
      count: products.length
    });
  } catch (error) {
    console.error("Product upload error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Upload failed"
    }, 500);
  }
});

// Delete a product from KV store
app.delete("/products/:id", async (c) => {
  try {
    const productId = c.req.param("id");
    const key = `product:${productId}`;

    console.log(`Deleting product: ${key}`);
    await kvDel(key);

    return c.json({
      success: true,
      message: `Product ${productId} deleted successfully`
    });
  } catch (error) {
    console.error("Product deletion error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Deletion failed"
    }, 500);
  }
});

// Get all products from KV store (for Admin Panel)
app.get("/kv-products", async (c) => {
  try {
    console.log("Fetching all products from KV store...");
    
    // Get all products with prefix "product:"
    const productEntries = await kvGetByPrefix("product:");
    
    if (!productEntries || productEntries.length === 0) {
      return c.json({
        success: true,
        products: [],
        count: 0,
        source: "kv_store"
      });
    }

    return c.json({
      success: true,
      products: productEntries,
      count: productEntries.length,
      source: "kv_store"
    });
  } catch (error) {
    console.error("Error fetching KV products:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Failed to fetch products",
      products: []
    }, 500);
  }
});

// Send Order Confirmation Emails
app.post("/emails/order-confirmation", async (c) => {
  try {
    const { orderId, customerEmail, customerName, orderData, transactionId } = await c.req.json();
    
    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    console.log("Sending order confirmation emails to:", customerEmail, BUSINESS_EMAIL);
    
    // Mock email sending
    const customerEmailContent = `
      Dear ${customerName},
      
      Thank you for your order at MANYARA!
      
      Order ID: ${orderId}
      Payment Reference: ${transactionId}
      Total: KSh ${orderData.cartTotal}
      
      We'll send you a confirmation once your order ships.
      
      Best regards,
      MANYARA Team
      ${BUSINESS_EMAIL}
      ${BUSINESS_PHONE}
    `;
    
    const businessEmailContent = `
      New Order Received!
      
      Order ID: ${orderId}
      Customer: ${customerName}
      Email: ${customerEmail}
      Phone: ${orderData.phoneNumber}
      Payment: ${orderData.paymentMethod}
      Reference: ${transactionId}
      Total: KSh ${orderData.cartTotal}
      
      Delivery to: ${orderData.nearestMajorTown || orderData.cityTown}, ${orderData.county}
    `;
    
    console.log("Customer email:", customerEmailContent);
    console.log("Business email:", businessEmailContent);
    
    return c.json({
      success: true,
      message: "Emails sent successfully"
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return c.json({
      success: false,
      error: (error as Error).message || "Email sending failed"
    }, 500);
  }
});

// Handle all other routes
app.all("*", (c) => {
  return c.json({
    error: "Not found",
    availableEndpoints: [
      "/health",
      "/sanity-products",
      "/products (GET/POST)",
      "/products/:id (DELETE)",
      "/kv-products",
      "/mpesa/initiate",
      "/mpesa/status/:checkoutRequestID",
      "/orders",
      "/emails/order-confirmation"
    ]
  }, 404);
});

Deno.serve(app.fetch);