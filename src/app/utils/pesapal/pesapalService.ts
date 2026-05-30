/**
 * Pesapal Payment Service - Frontend utilities for Pesapal integration
 */

interface PesapalPaymentRequest {
  orderId: string;
  amount: number;
  description?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  callbackUrl?: string;
  orderData?: {
    customerName: string;
    deliveryAddress: string;
    items: Array<{
      product_id: string;
      product_name: string;
      quantity: number;
      size: string;
      color: string;
      price: number;
    }>;
  };
}

interface PesapalPaymentResponse {
  success: boolean;
  redirect_url?: string;
  order_tracking_id?: string;
  merchant_reference?: string;
  order_id?: string;
  message?: string;
  error?: string;
  details?: string;
  hint?: string;
}

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-5cb00c7d`
  : 'http://localhost:54321/functions/v1/make-server-5cb00c7d';

/**
 * Create a Pesapal payment and get redirect URL
 */
export async function createPesapalPayment(
  paymentRequest: PesapalPaymentRequest
): Promise<PesapalPaymentResponse> {
  try {
    console.log('🚀 Creating Pesapal payment...', {
      orderId: paymentRequest.orderId,
      amount: paymentRequest.amount,
      email: paymentRequest.customerEmail,
    });

    const response = await fetch(
      `${EDGE_FUNCTION_URL}/api/pesapal/create-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: PesapalPaymentResponse = await response.json();

    if (!data.success) {
      console.error('❌ Pesapal payment creation failed:', data.error);
      throw new Error(data.error || 'Failed to create payment');
    }

    console.log('✅ Pesapal payment created successfully:', {
      orderId: data.order_id,
      trackingId: data.order_tracking_id,
    });

    return data;
  } catch (error: any) {
    console.error('❌ Error creating Pesapal payment:', error);
    throw error;
  }
}

/**
 * Redirect user to Pesapal payment page
 */
export function redirectToPesapalPayment(redirectUrl: string): void {
  console.log('🔗 Redirecting to Pesapal payment page...');
  console.log('URL:', redirectUrl);

  // Redirect to Pesapal payment page
  window.location.href = redirectUrl;
}

/**
 * Complete Pesapal payment flow
 * 1. Create payment
 * 2. Redirect to Pesapal
 */
export async function initiatePesapalPayment(
  paymentRequest: PesapalPaymentRequest
): Promise<void> {
  try {
    // Step 1: Create payment
    const response = await createPesapalPayment(paymentRequest);

    if (!response.redirect_url) {
      throw new Error('No redirect URL received from Pesapal');
    }

    // Step 2: Redirect to Pesapal
    redirectToPesapalPayment(response.redirect_url);
  } catch (error) {
    console.error('❌ Failed to initiate Pesapal payment:', error);
    throw error;
  }
}

/**
 * Generate a unique order ID
 */
export function generateOrderId(): string {
  // Generate UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
