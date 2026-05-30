/**
 * Test script for Pesapal IPN Registration
 *
 * This script demonstrates how to call the Pesapal IPN registration endpoint
 *
 * Usage:
 * 1. Set your environment variables (PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET)
 * 2. Run: deno run --allow-net --allow-env test_pesapal.ts
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "http://localhost:54321";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

async function testIPNRegistration() {
  console.log("🧪 Testing Pesapal IPN Registration\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const endpoint = `${SUPABASE_URL}/functions/v1/make-server-5cb00c7d/api/pesapal/register-ipn`;

  console.log("📡 Calling endpoint:", endpoint);
  console.log("🔑 Using Supabase Anon Key:", SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      // Optional: provide custom IPN URL
      // body: JSON.stringify({
      //   ipn_url: "https://your-custom-domain.com/api/pesapal/ipn"
      // })
    });

    console.log("\n📥 Response Status:", response.status, response.statusText);

    const data = await response.json();

    console.log("\n📦 Response Data:");
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✅ SUCCESS!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("IPN ID:", data.ipn_id);
      console.log("IPN URL:", data.ipn_url);
      console.log("\n💡 Save this IPN ID for future payment requests!");
    } else {
      console.log("\n❌ FAILED!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Error:", data.error);
      console.log("Details:", data.details);
    }
  } catch (error) {
    console.error("\n❌ Request failed:", error);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Run the test
if (import.meta.main) {
  await testIPNRegistration();
}

export { testIPNRegistration };
