# Pesapal Payment Integration

This document explains how to set up and use Pesapal payment gateway integration for the MANYARA e-commerce platform.

## Overview

Pesapal is a payment gateway that supports multiple payment methods including:
- Credit/Debit Cards (Visa, Mastercard)
- Mobile Money (M-Pesa, Airtel Money)
- Bank transfers

## Environment Setup

### Required Environment Variables

Add these environment variables to your Supabase project:

```bash
PESAPAL_CONSUMER_KEY=your_consumer_key_here
PESAPAL_CONSUMER_SECRET=your_consumer_secret_here
PESAPAL_IPN_ID=your_ipn_id_from_registration
PESAPAL_IPN_URL=https://your-domain.com/make-server-5cb00c7d/api/pesapal/ipn
PESAPAL_CALLBACK_URL=https://your-domain.com/payment-callback
```

**Important:** After registering your IPN (step 1), save the returned `ipn_id` to the `PESAPAL_IPN_ID` environment variable.

### Getting Pesapal Credentials

1. Sign up for a Pesapal account at [https://www.pesapal.com](https://www.pesapal.com)
2. Navigate to your dashboard
3. Get your Consumer Key and Consumer Secret from the API settings
4. Note: The URLs in this integration use the **sandbox/testing environment** (`cybqa.pesapal.com`)
5. For production, change the base URL to `https://pay.pesapal.com/v3/api`

## API Endpoints

### 1. Register IPN (Instant Payment Notification)

**Endpoint:** `POST /make-server-5cb00c7d/api/pesapal/register-ipn`

**Description:** Registers your IPN callback URL with Pesapal. This URL will receive payment notifications.

**Request Body (Optional):**
```json
{
  "ipn_url": "https://custom-domain.com/api/pesapal/ipn"
}
```

If no body is provided, it will use the `PESAPAL_IPN_URL` environment variable or auto-generate one.

**Response (Success):**
```json
{
  "success": true,
  "ipn_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "ipn_url": "https://your-domain.com/api/pesapal/ipn",
  "message": "IPN registered successfully with Pesapal"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-5cb00c7d/api/pesapal/register-ipn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

### 2. Create Payment

**Endpoint:** `POST /make-server-5cb00c7d/api/pesapal/create-payment`

**Description:** Creates a payment request with Pesapal and returns the redirect URL for customer payment.

**Request Body:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 5000,
  "description": "Manyara lingerie purchase",
  "customerEmail": "customer@example.com",
  "customerPhone": "254712345678",
  "customerName": "Jane Doe",
  "callbackUrl": "https://your-domain.com/payment-callback",
  "orderData": {
    "customerName": "Jane Doe",
    "deliveryAddress": "Nairobi, Kenya",
    "items": [
      {
        "product_id": "prod123",
        "product_name": "Silk Nightgown",
        "quantity": 1,
        "size": "M",
        "color": "Black",
        "price": 5000
      }
    ]
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "redirect_url": "https://pay.pesapal.com/iframe/v3/...",
  "order_tracking_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "merchant_reference": "550e8400-e29b-41d4-a716-446655440000",
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Payment created successfully. Redirect customer to payment page."
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

**Example cURL:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/make-server-5cb00c7d/api/pesapal/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 5000,
    "customerEmail": "customer@example.com",
    "customerPhone": "254712345678",
    "customerName": "Jane Doe"
  }'
```

**What happens:**
1. Order is saved to database with status "PENDING"
2. Payment request is sent to Pesapal
3. Order is updated with Pesapal tracking ID
4. Returns redirect URL for customer to complete payment

### 3. IPN Callback Handler

**Endpoint:** `GET /make-server-5cb00c7d/api/pesapal/ipn`

**Description:** Receives payment notifications from Pesapal. This is called automatically by Pesapal when payment status changes.

**Query Parameters (from Pesapal):**
- `OrderTrackingId` - Unique tracking ID from Pesapal
- `OrderMerchantReference` - Your order reference
- `OrderNotificationType` - Type of notification

**How it works:**
1. Pesapal sends a GET request to this endpoint with payment details
2. The endpoint logs the notification details
3. Stores the notification in KV store for later processing
4. Returns a 200 OK response to acknowledge receipt

## Integration Flow

### Complete Payment Flow

1. **Register IPN URL** (One-time setup)
   ```bash
   POST /api/pesapal/register-ipn
   ```
   Save the returned `ipn_id` and add it to `PESAPAL_IPN_ID` environment variable.

2. **Customer Selects Pesapal**
   - Customer fills checkout form
   - Selects Pesapal as payment method
   - Clicks "Pay with Pesapal"

3. **Create Payment Request**
   ```bash
   POST /api/pesapal/create-payment
   ```
   - Order is saved to database with status "PENDING"
   - Payment request sent to Pesapal
   - Receives redirect URL

4. **Redirect to Pesapal**
   - Customer is redirected to `redirect_url`
   - Customer completes payment on Pesapal

5. **Payment Completion**
   - Pesapal processes payment
   - Redirects customer to your callback URL
   - Sends IPN notification to your server

6. **Receive IPN Notification**
   - Pesapal calls your IPN endpoint
   - Update order status based on payment result

## Frontend Integration

The checkout page now includes Pesapal as a payment option:

```typescript
interface CheckoutFormData {
  // ... other fields
  paymentMethod: 'mpesa' | 'bank_transfer' | 'paypal' | 'pesapal';
}
```

When customer selects Pesapal:
1. Order is created with `paymentMethod: 'pesapal'`
2. Payment flow is initiated (to be implemented)
3. Customer is redirected to Pesapal
4. After payment, customer returns to success page

## Testing

### Test Mode (Sandbox)

The current configuration uses Pesapal's test environment:
- Base URL: `https://cybqa.pesapal.com/pesapalv3/api`
- Use test credentials from your Pesapal sandbox account

### Test Cards

Pesapal provides test cards for sandbox testing:
- **Success:** Card number `5221234567890123`
- **Decline:** Card number `4000000000000002`

Check Pesapal documentation for complete list of test scenarios.

## Production Checklist

Before going live:

- [ ] Get production credentials from Pesapal
- [ ] Update `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` with production values
- [ ] Change base URL in `pesapal_service.tsx` from `cybqa.pesapal.com` to `pay.pesapal.com`
- [ ] Register IPN URL in production environment
- [ ] Test with real payment methods
- [ ] Set up webhook monitoring
- [ ] Configure proper error notifications

## Security Notes

1. **Never expose credentials** - Consumer key and secret should only exist in environment variables
2. **Validate IPN notifications** - Always verify notifications are from Pesapal
3. **Use HTTPS** - All IPN URLs must use HTTPS in production
4. **Log everything** - Keep detailed logs of all payment transactions

## Troubleshooting

### Common Issues

**Error: "Pesapal credentials not configured"**
- Solution: Set `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` environment variables

**Error: "Failed to get Pesapal token"**
- Check credentials are correct
- Verify you're using the right environment (sandbox vs production)
- Check Pesapal API status

**IPN not receiving notifications**
- Verify IPN URL is publicly accessible
- Check IPN URL is registered with correct `ipn_id`
- Ensure IPN endpoint returns 200 OK
- Check Pesapal dashboard for IPN logs

## Support

- Pesapal Documentation: https://developer.pesapal.com
- Pesapal Support: support@pesapal.com
- Sandbox Dashboard: https://demo.pesapal.com

## Code Structure

```
supabase/functions/server/
├── index.tsx                 # Main server with endpoints
├── pesapal_service.tsx      # Pesapal API integration
├── kv_store.tsx             # Key-value storage
└── PESAPAL_INTEGRATION.md   # This file
```

## Next Steps

To complete the Pesapal integration:

1. ✅ Set up IPN registration endpoint
2. ✅ Add IPN callback handler
3. ✅ Add Pesapal to checkout UI
4. ✅ Implement payment submission endpoint
5. ⏳ Integrate frontend to call create-payment endpoint
6. ⏳ Handle payment confirmation flow
7. ⏳ Add order status updates based on IPN
8. ⏳ Add payment verification endpoint

---

**Last Updated:** 2026-04-22
**Version:** 1.0.0
