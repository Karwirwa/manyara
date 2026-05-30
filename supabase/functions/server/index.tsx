import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";
import { completePesapalIPNRegistration, createPesapalPayment } from "./pesapal_service.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5cb00c7d/health", (c) => {
  return c.json({ status: "ok" });
});

// Pesapal IPN Registration Endpoint
app.post("/make-server-5cb00c7d/api/pesapal/register-ipn", async (c) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📡 Pesapal IPN Registration Request");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // Get Pesapal credentials from environment variables
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

    if (!consumerKey || !consumerSecret) {
      console.error("❌ Missing Pesapal credentials in environment variables");
      return c.json(
        {
          success: false,
          error: "Pesapal credentials not configured",
          message: "Please set PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET environment variables",
        },
        500
      );
    }

    // Get request body (optional: can override IPN URL)
    const body = await c.req.json().catch(() => ({}));
    const customIpnUrl = body.ipn_url;

    // Default IPN URL (use custom URL if provided, otherwise use environment variable or default)
    const defaultIpnUrl = Deno.env.get("PESAPAL_IPN_URL") ||
      `${c.req.url.split('/make-server-5cb00c7d')[0]}/make-server-5cb00c7d/api/pesapal/ipn`;
    const ipnUrl = customIpnUrl || defaultIpnUrl;

    console.log("🔧 Configuration:", {
      consumerKeyPresent: !!consumerKey,
      consumerSecretPresent: !!consumerSecret,
      ipnUrl,
    });

    // Register IPN with Pesapal
    const result = await completePesapalIPNRegistration(
      {
        consumerKey,
        consumerSecret,
      },
      ipnUrl
    );

    console.log("✅ Pesapal IPN Registration Successful");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return c.json({
      success: true,
      ipn_id: result.ipn_id,
      ipn_url: ipnUrl,
      message: "IPN registered successfully with Pesapal",
    });
  } catch (error: any) {
    console.error("❌ Pesapal IPN Registration Failed");
    console.error("Error:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return c.json(
      {
        success: false,
        error: error.message || "Failed to register IPN with Pesapal",
        details: error.toString(),
      },
      500
    );
  }
});

// Pesapal IPN Callback Endpoint (to receive notifications)
app.get("/make-server-5cb00c7d/api/pesapal/ipn", async (c) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📨 Pesapal IPN Notification Received");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // Get query parameters
    const queryParams = c.req.query();

    console.log("📋 IPN Parameters:", queryParams);

    // Extract common Pesapal IPN parameters
    const {
      OrderTrackingId,
      OrderMerchantReference,
      OrderNotificationType,
    } = queryParams;

    console.log("📦 Parsed IPN Data:", {
      trackingId: OrderTrackingId,
      merchantReference: OrderMerchantReference,
      notificationType: OrderNotificationType,
    });

    // Store IPN notification for processing
    if (OrderTrackingId) {
      const ipnKey = `pesapal:ipn:${OrderTrackingId}`;
      await kv.set(ipnKey, {
        ...queryParams,
        received_at: new Date().toISOString(),
      });
      console.log(`✅ Stored IPN notification: ${ipnKey}`);
    }

    console.log("✅ IPN Notification Processed");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Pesapal expects a 200 OK response
    return c.json({ status: "received" });
  } catch (error: any) {
    console.error("❌ Error processing Pesapal IPN:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Still return 200 to Pesapal to acknowledge receipt
    return c.json({ status: "error", message: error.message });
  }
});

// Pesapal Create Payment Endpoint
app.post("/make-server-5cb00c7d/api/pesapal/create-payment", async (c) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💳 Pesapal Create Payment Request");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // Get Pesapal credentials from environment
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
    const ipnId = Deno.env.get("PESAPAL_IPN_ID");

    if (!consumerKey || !consumerSecret) {
      console.error("❌ Missing Pesapal credentials");
      return c.json(
        {
          success: false,
          error: "Pesapal credentials not configured",
        },
        500
      );
    }

    if (!ipnId) {
      console.error("❌ Missing Pesapal IPN ID");
      return c.json(
        {
          success: false,
          error: "Pesapal IPN ID not configured. Please register IPN first.",
          hint: "Call POST /api/pesapal/register-ipn to get an IPN ID",
        },
        500
      );
    }

    // Parse request body
    const body = await c.req.json();
    const {
      orderId,
      amount,
      description,
      customerEmail,
      customerPhone,
      customerName,
      callbackUrl,
      orderData,
    } = body;

    console.log("📦 Payment Request Data:", {
      orderId,
      amount,
      customerEmail,
      customerPhone,
    });

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerPhone) {
      console.error("❌ Missing required fields");
      return c.json(
        {
          success: false,
          error: "Missing required fields: orderId, amount, customerEmail, customerPhone",
        },
        400
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Step 1: Store order in database FIRST
    console.log("💾 Storing order in database...");

    const orderRecord = {
      id: orderId,
      customer_name: orderData?.customerName || customerName || "Unknown",
      customer_email: customerEmail,
      customer_phone: customerPhone,
      delivery_address: orderData?.deliveryAddress || "",
      payment_method: "pesapal",
      total_amount: amount,
      items: orderData?.items || [],
      status: "PENDING",
      pesapal_transaction_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: savedOrder, error: dbError } = await supabase
      .from("orders")
      .insert(orderRecord)
      .select()
      .single();

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return c.json(
        {
          success: false,
          error: "Failed to save order to database",
          details: dbError.message,
        },
        500
      );
    }

    console.log("✅ Order saved to database:", savedOrder.id);

    // Step 2: Create payment request with Pesapal
    console.log("💳 Creating Pesapal payment...");

    const defaultCallbackUrl = Deno.env.get("PESAPAL_CALLBACK_URL") ||
      `${c.req.url.split('/make-server-5cb00c7d')[0]}/payment-callback`;

    const pesapalRequest = {
      id: orderId,
      currency: "KES",
      amount: amount,
      description: description || "Manyara lingerie purchase",
      callback_url: callbackUrl || defaultCallbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: customerEmail,
        phone_number: customerPhone,
        country_code: "KE",
        first_name: customerName?.split(" ")[0] || "",
        last_name: customerName?.split(" ").slice(1).join(" ") || "",
      },
    };

    console.log("📤 Pesapal request payload:", {
      id: pesapalRequest.id,
      amount: pesapalRequest.amount,
      currency: pesapalRequest.currency,
      notification_id: pesapalRequest.notification_id,
    });

    const pesapalResponse = await createPesapalPayment(
      {
        consumerKey,
        consumerSecret,
      },
      pesapalRequest
    );

    console.log("✅ Pesapal payment created successfully");
    console.log("📋 Full Pesapal Response:", pesapalResponse);

    // Step 3: Update order with Pesapal tracking ID
    if (pesapalResponse.order_tracking_id) {
      console.log("💾 Updating order with Pesapal tracking ID...");

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          pesapal_transaction_id: pesapalResponse.order_tracking_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("⚠️ Failed to update order with tracking ID:", updateError);
      } else {
        console.log("✅ Order updated with tracking ID:", pesapalResponse.order_tracking_id);
      }
    }

    console.log("✅ Payment Creation Complete");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return c.json({
      success: true,
      redirect_url: pesapalResponse.redirect_url,
      order_tracking_id: pesapalResponse.order_tracking_id,
      merchant_reference: pesapalResponse.merchant_reference,
      order_id: orderId,
      message: "Payment created successfully. Redirect customer to payment page.",
    });
  } catch (error: any) {
    console.error("❌ Payment Creation Failed");
    console.error("Error:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return c.json(
      {
        success: false,
        error: error.message || "Failed to create payment",
        details: error.toString(),
      },
      500
    );
  }
});

Deno.serve(app.fetch);