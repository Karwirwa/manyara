/**
 * Pesapal Payment Gateway Service
 * Handles authentication and IPN registration for Pesapal payments
 */

const PESAPAL_BASE_URL = "https://cybqa.pesapal.com/pesapalv3/api";

interface PesapalTokenResponse {
  token: string;
  expiryDate: string;
  error: string | null;
  status: string;
  message: string;
}

interface PesapalIPNResponse {
  url: string;
  created_date: string;
  ipn_id: string;
  error: string | null;
  status: string;
}

interface PesapalCredentials {
  consumerKey: string;
  consumerSecret: string;
}

/**
 * Get Pesapal access token
 */
export async function getPesapalAccessToken(
  credentials: PesapalCredentials
): Promise<string> {
  const tokenUrl = `${PESAPAL_BASE_URL}/Auth/RequestToken`;

  console.log("🔐 Requesting Pesapal access token...");

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        consumer_key: credentials.consumerKey,
        consumer_secret: credentials.consumerSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pesapal token request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to get Pesapal token: ${response.status} ${response.statusText}`
      );
    }

    const data: PesapalTokenResponse = await response.json();

    console.log("✅ Pesapal token response:", {
      status: data.status,
      message: data.message,
      expiryDate: data.expiryDate,
      hasToken: !!data.token,
    });

    if (data.error) {
      console.error("❌ Pesapal token error:", data.error);
      throw new Error(`Pesapal token error: ${data.error}`);
    }

    if (!data.token) {
      console.error("❌ No token in Pesapal response:", data);
      throw new Error("No token received from Pesapal");
    }

    console.log("✅ Successfully obtained Pesapal access token");
    return data.token;
  } catch (error) {
    console.error("❌ Error getting Pesapal access token:", error);
    throw error;
  }
}

/**
 * Register IPN URL with Pesapal
 */
export async function registerPesapalIPN(
  accessToken: string,
  ipnUrl: string
): Promise<string> {
  const ipnRegisterUrl = `${PESAPAL_BASE_URL}/URLSetup/RegisterIPN`;

  console.log("📡 Registering Pesapal IPN...", {
    url: ipnUrl,
    notificationType: "GET",
  });

  try {
    const response = await fetch(ipnRegisterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "GET",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pesapal IPN registration failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to register IPN: ${response.status} ${response.statusText}`
      );
    }

    const data: PesapalIPNResponse = await response.json();

    console.log("✅ Pesapal IPN registration response:", {
      ipn_id: data.ipn_id,
      url: data.url,
      created_date: data.created_date,
      status: data.status,
    });

    if (data.error) {
      console.error("❌ Pesapal IPN registration error:", data.error);
      throw new Error(`Pesapal IPN error: ${data.error}`);
    }

    if (!data.ipn_id) {
      console.error("❌ No IPN ID in Pesapal response:", data);
      throw new Error("No IPN ID received from Pesapal");
    }

    console.log("✅ Successfully registered IPN with ID:", data.ipn_id);
    return data.ipn_id;
  } catch (error) {
    console.error("❌ Error registering Pesapal IPN:", error);
    throw error;
  }
}

/**
 * Complete IPN registration flow
 * 1. Get access token
 * 2. Register IPN URL
 */
export async function completePesapalIPNRegistration(
  credentials: PesapalCredentials,
  ipnUrl: string
): Promise<{ ipn_id: string; success: boolean }> {
  console.log("🚀 Starting Pesapal IPN registration flow...");

  try {
    // Step 1: Get access token
    const accessToken = await getPesapalAccessToken(credentials);

    // Step 2: Register IPN
    const ipn_id = await registerPesapalIPN(accessToken, ipnUrl);

    console.log("✅ Pesapal IPN registration completed successfully:", {
      ipn_id,
    });

    return {
      ipn_id,
      success: true,
    };
  } catch (error) {
    console.error("❌ Pesapal IPN registration failed:", error);
    throw error;
  }
}

interface PesapalOrderRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number: string;
    country_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
  };
}

interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: string | null;
  status: string;
  message: string;
}

/**
 * Submit order to Pesapal for payment
 */
export async function submitPesapalOrder(
  accessToken: string,
  orderRequest: PesapalOrderRequest
): Promise<PesapalOrderResponse> {
  const submitOrderUrl = `${PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`;

  console.log("💳 Submitting order to Pesapal...", {
    orderId: orderRequest.id,
    amount: orderRequest.amount,
    currency: orderRequest.currency,
    email: orderRequest.billing_address.email_address,
  });

  try {
    const response = await fetch(submitOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pesapal order submission failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to submit order to Pesapal: ${response.status} ${response.statusText}`
      );
    }

    const data: PesapalOrderResponse = await response.json();

    console.log("✅ Pesapal order submission response:", {
      order_tracking_id: data.order_tracking_id,
      merchant_reference: data.merchant_reference,
      redirect_url: data.redirect_url,
      status: data.status,
      message: data.message,
    });

    if (data.error) {
      console.error("❌ Pesapal order error:", data.error);
      throw new Error(`Pesapal order error: ${data.error}`);
    }

    if (!data.redirect_url) {
      console.error("❌ No redirect URL in Pesapal response:", data);
      throw new Error("No redirect URL received from Pesapal");
    }

    console.log("✅ Successfully submitted order to Pesapal");
    console.log("🔗 Redirect URL:", data.redirect_url);

    return data;
  } catch (error) {
    console.error("❌ Error submitting order to Pesapal:", error);
    throw error;
  }
}

/**
 * Complete payment creation flow
 * 1. Get access token
 * 2. Submit order to Pesapal
 */
export async function createPesapalPayment(
  credentials: PesapalCredentials,
  orderRequest: PesapalOrderRequest
): Promise<PesapalOrderResponse> {
  console.log("🚀 Starting Pesapal payment creation flow...");

  try {
    // Step 1: Get access token
    console.log("🔐 Requesting Pesapal access token...");
    const accessToken = await getPesapalAccessToken(credentials);

    // Step 2: Submit order
    console.log("📤 Submitting order to Pesapal...");
    const response = await submitPesapalOrder(accessToken, orderRequest);

    console.log("✅ Pesapal payment creation completed successfully");

    return response;
  } catch (error) {
    console.error("❌ Pesapal payment creation failed:", error);
    throw error;
  }
}
