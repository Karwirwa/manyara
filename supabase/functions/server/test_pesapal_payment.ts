/**
 * Test script for Pesapal Payment Creation
 *
 * This script demonstrates how to call the Pesapal create-payment endpoint
 *
 * Usage:
 * 1. Set your environment variables
 * 2. Run: deno run --allow-net --allow-env test_pesapal_payment.ts
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "http://localhost:54321";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

async function testPaymentCreation() {
  console.log("🧪 Testing Pesapal Payment Creation\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const endpoint = `${SUPABASE_URL}/functions/v1/make-server-5cb00c7d/api/pesapal/create-payment`;

  // Generate a test order ID
  const testOrderId = crypto.randomUUID();

  const testPayload = {
    orderId: testOrderId,
    amount: 5000,
    description: "Test payment for Manyara lingerie",
    customerEmail: "test@example.com",
    customerPhone: "254712345678",
    customerName: "Test Customer",
    callbackUrl: `${SUPABASE_URL}/payment-callback`,
    orderData: {
      customerName: "Test Customer",
      deliveryAddress: "Nairobi, Kenya",
      items: [
        {
          product_id: "test-product-123",
          product_name: "Test Silk Nightgown",
          quantity: 1,
          size: "M",
          color: "Black",
          price: 5000,
        },
      ],
    },
  };

  console.log("📡 Calling endpoint:", endpoint);
  console.log("🔑 Using Supabase Anon Key:", SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set");
  console.log("\n📦 Test Payload:");
  console.log(JSON.stringify(testPayload, null, 2));

  try {
    console.log("\n⏳ Sending request...\n");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testPayload),
    });

    console.log("📥 Response Status:", response.status, response.statusText);

    const data = await response.json();

    console.log("\n📦 Response Data:");
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✅ SUCCESS!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Order ID:", data.order_id);
      console.log("Tracking ID:", data.order_tracking_id);
      console.log("Merchant Ref:", data.merchant_reference);
      console.log("\n🔗 Redirect URL:");
      console.log(data.redirect_url);
      console.log("\n💡 Next step: Redirect customer to the URL above to complete payment");
    } else {
      console.log("\n❌ FAILED!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Error:", data.error);
      if (data.details) {
        console.log("Details:", data.details);
      }
      if (data.hint) {
        console.log("Hint:", data.hint);
      }
    }
  } catch (error) {
    console.error("\n❌ Request failed:", error);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Run the test
if (import.meta.main) {
  await testPaymentCreation();
}

export { testPaymentCreation };
