/**
 * MANYARA Category Diagnostic Tool
 * 
 * Run this in your browser console to diagnose category issues
 * 
 * Usage:
 * 1. Open browser console (F12 > Console tab)
 * 2. Copy and paste this entire file
 * 3. Press Enter to run
 * 4. Review the output to see category mismatches
 */

(async function diagnoseCategoriesAsync() {
  console.log("🔍 MANYARA Category Diagnostic Tool");
  console.log("=" .repeat(60));
  
  try {
    // Get Supabase project info (you may need to adjust these)
    const projectId = "ylwjxqfnxpzbcakctbfd";
    const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsd2p4cWZueHB6YmNha2N0YmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDA5NjMsImV4cCI6MjA1MDg3Njk2M30.Brt8ow0yR4RQ5A86OP92eFYH9u0U3wSVBD3WHVlEwVs";
    
    console.log("\n📡 Fetching products from Sanity CMS...");
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error("❌ Failed to fetch products:", response.status);
      return;
    }
    
    const data = await response.json();
    
    if (!data.success || !data.products) {
      console.error("❌ No products returned from API");
      return;
    }
    
    console.log(`\n✅ Loaded ${data.products.length} products`);
    console.log(`⚠️  Products without images: ${data.productsWithoutImages || 0}`);
    
    // Analyze categories
    const categoryStats = new Map();
    const sampleProducts = new Map();
    
    data.products.forEach(product => {
      const cat = product.category || "Uncategorized";
      
      if (!categoryStats.has(cat)) {
        categoryStats.set(cat, {
          count: 0,
          withImages: 0,
          withoutImages: 0
        });
        sampleProducts.set(cat, product);
      }
      
      const stats = categoryStats.get(cat);
      stats.count++;
      
      if (product.imageUrl && product.imageUrl.trim() !== '') {
        stats.withImages++;
      } else {
        stats.withoutImages++;
      }
    });
    
    console.log("\n📊 CATEGORY BREAKDOWN");
    console.log("=" .repeat(60));
    
    // Canonical categories for comparison
    const canonicalCategories = [
      "Bodyshapers",
      "Bodystockings",
      "Bridal Lingerie",
      "Corsets",
      "Leather Lingerie",
      "Lingerie 2-piece sets",
      "Nightgowns",
      "Shapewear",
      "Sissy Lingerie",
      "Thongs"
    ];
    
    let totalMismatches = 0;
    
    categoryStats.forEach((stats, categoryName) => {
      const isCanonical = canonicalCategories.includes(categoryName);
      const statusIcon = isCanonical ? "✅" : "⚠️ ";
      
      console.log(`\n${statusIcon} "${categoryName}"`);
      console.log(`   Products: ${stats.count}`);
      console.log(`   With Images: ${stats.withImages}`);
      console.log(`   Without Images: ${stats.withoutImages}`);
      
      const sample = sampleProducts.get(categoryName);
      if (sample) {
        console.log(`   Sample Product: ${sample.name.substring(0, 50)}...`);
      }
      
      if (!isCanonical) {
        totalMismatches++;
        console.log(`   ⚠️  NOT A CANONICAL CATEGORY NAME!`);
        
        // Suggest canonical name
        const lowerCat = categoryName.toLowerCase();
        let suggestion = null;
        
        if (lowerCat.includes("bodyshaper")) suggestion = "Bodyshapers";
        else if (lowerCat.includes("bodystocking")) suggestion = "Bodystockings";
        else if (lowerCat.includes("bridal")) suggestion = "Bridal Lingerie";
        else if (lowerCat.includes("corset")) suggestion = "Corsets";
        else if (lowerCat.includes("leather")) suggestion = "Leather Lingerie";
        else if (lowerCat.includes("lingerie") && lowerCat.includes("2")) suggestion = "Lingerie 2-piece sets";
        else if (lowerCat.includes("nightgown")) suggestion = "Nightgowns";
        else if (lowerCat.includes("shape")) suggestion = "Shapewear";
        else if (lowerCat.includes("sissy")) suggestion = "Sissy Lingerie";
        else if (lowerCat.includes("thong")) suggestion = "Thongs";
        
        if (suggestion) {
          console.log(`   💡 Suggested fix: Rename to "${suggestion}" in Sanity`);
        }
      }
    });
    
    console.log("\n" + "=".repeat(60));
    console.log("📝 SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Products: ${data.products.length}`);
    console.log(`Total Categories: ${categoryStats.size}`);
    console.log(`Canonical Categories: ${categoryStats.size - totalMismatches}`);
    console.log(`Non-Canonical Categories: ${totalMismatches}`);
    console.log(`Products Without Images: ${data.productsWithoutImages || 0}`);
    
    if (totalMismatches > 0) {
      console.log("\n⚠️  ACTION REQUIRED:");
      console.log("   1. Go to https://ximq2iuj.sanity.studio");
      console.log("   2. Navigate to Categories section");
      console.log("   3. Rename categories to match canonical names (see above)");
      console.log("   4. Publish changes");
      console.log("   5. Refresh your website");
      console.log("\n   OR: The backend will automatically normalize them!");
    } else {
      console.log("\n✅ All categories match canonical names!");
      console.log("   Category filtering should work perfectly.");
    }
    
    console.log("\n🔍 CANONICAL CATEGORY NAMES:");
    canonicalCategories.forEach(cat => {
      const exists = categoryStats.has(cat);
      console.log(`   ${exists ? '✅' : '❌'} ${cat}`);
    });
    
    console.log("\n" + "=".repeat(60));
    console.log("Diagnostic complete!");
    
  } catch (error) {
    console.error("❌ Error running diagnostic:", error);
  }
})();
