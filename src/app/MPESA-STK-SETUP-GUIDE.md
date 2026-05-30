# M-Pesa STK Push Setup Guide for MANYARA

## Current Status ⚠️

**Your current implementation is a MOCK/PLACEHOLDER.** It creates orders but doesn't actually trigger M-Pesa STK push prompts on customer phones.

To make **REAL M-Pesa STK Push** work, you need to integrate with Safaricom's **Daraja API**.

---

## 🔑 What You Need from Safaricom

### 1. **Daraja API Account**
Register at: https://developer.safaricom.co.ke/

### 2. **Required Credentials** (from Daraja Portal)

```javascript
// You will get these after registering:
{
  consumerKey: "YOUR_CONSUMER_KEY",           // From Daraja Portal
  consumerSecret: "YOUR_CONSUMER_SECRET",     // From Daraja Portal
  businessShortCode: "174379",                // Paybill/Till Short Code
  passkey: "YOUR_LIPA_NA_MPESA_PASSKEY",      // From Daraja Portal
  environment: "sandbox" or "production"      // Start with sandbox for testing
}
```

### 3. **Important Notes:**

#### ⚠️ Till Number vs Business Short Code
- **Till Number (7121042)** - Your current till for manual payments
- **Business Short Code** - Different number needed for STK Push API (you'll get this from Daraja)
- **They are NOT the same!**

#### ⚠️ API Type
You need **"Lipa Na M-Pesa Online"** (STK Push) API access

---

## 🏗️ Architecture Requirements

### **You CANNOT make STK Push directly from frontend because:**
1. ❌ Would expose your API credentials (Consumer Key/Secret)
2. ❌ Browser CORS policies block direct Daraja API calls
3. ❌ Security risk - anyone could see your credentials

### **You NEED a Backend/Server:**

#### **Option 1: Supabase Edge Functions** (Recommended)
- Deploy serverless functions on Supabase
- Store credentials as environment variables
- Make secure API calls to Daraja

#### **Option 2: Separate Backend Server**
- Node.js/Express, Python/Flask, etc.
- Host on Vercel, Railway, Render, etc.
- Exposes API endpoints for frontend

#### **Option 3: Cloudflare Workers**
- Serverless edge functions
- Fast and secure

---

## 📋 Step-by-Step Setup

### **Step 1: Register with Daraja**

1. Go to https://developer.safaricom.co.ke/
2. Create account
3. Create a new app
4. Subscribe to "Lipa Na M-Pesa Online" API
5. Get your credentials:
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Passkey

### **Step 2: Choose Environment**

#### **Sandbox (Testing)**
- Use test credentials
- Test phone number: 254708374149
- Use for development

#### **Production (Live)**
- Apply for Go Live approval
- Use real credentials
- Requires business verification
- Takes 1-2 weeks approval

### **Step 3: Setup Backend (Supabase Edge Function)**

Create a file: `supabase/functions/mpesa-stk-push/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CONSUMER_KEY = Deno.env.get('MPESA_CONSUMER_KEY');
const CONSUMER_SECRET = Deno.env.get('MPESA_CONSUMER_SECRET');
const BUSINESS_SHORT_CODE = Deno.env.get('MPESA_SHORT_CODE');
const PASSKEY = Deno.env.get('MPESA_PASSKEY');
const CALLBACK_URL = Deno.env.get('MPESA_CALLBACK_URL');

// Step 1: Get OAuth Token
async function getAccessToken() {
  const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  const data = await response.json();
  return data.access_token;
}

// Step 2: Initiate STK Push
async function initiateSTKPush(phoneNumber: string, amount: number, accountReference: string) {
  const accessToken = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = btoa(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`);

  const response = await fetch(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        BusinessShortCode: BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: BUSINESS_SHORT_CODE,
        PhoneNumber: phoneNumber,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: 'MANYARA Order Payment',
      }),
    }
  );

  return await response.json();
}

// Main handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount, accountReference } = await req.json();

    const result = await initiateSTKPush(phoneNumber, amount, accountReference);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### **Step 4: Create Callback Handler**

Create: `supabase/functions/mpesa-callback/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const callback = await req.json();
    
    // Safaricom sends payment result here
    console.log('M-Pesa Callback received:', callback);

    // Extract payment details
    const resultCode = callback.Body.stkCallback.ResultCode;
    const checkoutRequestID = callback.Body.stkCallback.CheckoutRequestID;
    
    if (resultCode === 0) {
      // Payment successful
      const items = callback.Body.stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      
      // Update order in Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL'),
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      );
      
      await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          mpesa_transaction_id: mpesaReceiptNumber,
          updated_at: new Date().toISOString(),
        })
        .eq('mpesa_transaction_id', checkoutRequestID);
      
      console.log('✅ Order confirmed:', mpesaReceiptNumber);
    } else {
      // Payment failed
      console.log('❌ Payment failed:', resultCode);
    }

    return new Response(JSON.stringify({ message: 'Callback processed' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### **Step 5: Update Frontend (CheckoutPage.tsx)**

Replace the M-Pesa section in `handlePayment`:

```typescript
if (formData.paymentMethod === 'mpesa') {
  console.log('💳 Processing M-Pesa payment...');
  
  // Create order first
  const order = await createOrder({
    customerName: formData.fullName,
    customerEmail: formData.email,
    customerPhone: formData.phoneNumber,
    deliveryAddress,
    paymentMethod: 'mpesa',
    totalAmount: total,
    items: orderItems,
    mpesaTransactionId: `PENDING-${Date.now()}`
  });

  console.log('✅ Order created:', order.id);

  // Call your Supabase Edge Function
  const response = await fetch(
    'https://YOUR_PROJECT_ID.supabase.co/functions/v1/mpesa-stk-push',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_ANON_KEY}`,
      },
      body: JSON.stringify({
        phoneNumber: formatPhoneNumber(formData.phoneNumber),
        amount: total,
        accountReference: order.id,
      }),
    }
  );

  const result = await response.json();

  if (result.ResponseCode === '0') {
    // STK Push sent successfully
    console.log('📱 STK Push sent to customer phone');
    setPaymentStatus('processing');
    setOrderId(order.id);
    
    // Show message: "Check your phone to complete payment"
    
  } else {
    throw new Error(result.ResponseDescription || 'STK Push failed');
  }
}
```

---

## 🔐 Environment Variables

In **Supabase Dashboard** → Settings → Edge Functions → Secrets:

```bash
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-project.supabase.co/functions/v1/mpesa-callback
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📱 How It Works (User Flow)

1. **Customer clicks "Pay with M-Pesa"**
2. **Frontend calls Edge Function** with phone number and amount
3. **Edge Function:**
   - Gets OAuth token from Daraja
   - Sends STK Push request to Safaricom
4. **Safaricom:**
   - Sends prompt to customer's phone
   - Customer enters M-Pesa PIN
5. **Customer completes payment**
6. **Safaricom calls your callback URL** with payment result
7. **Callback function:**
   - Updates order status to "confirmed"
   - Stores M-Pesa receipt number
8. **Customer sees success message**

---

## 🧪 Testing (Sandbox)

### **Test Credentials:**
- Consumer Key: Get from Daraja Sandbox
- Consumer Secret: Get from Daraja Sandbox
- Short Code: Usually `174379` (sandbox)
- Test Phone: `254708374149`

### **Test Flow:**
1. Use sandbox credentials
2. Enter test phone number
3. You won't receive real SMS in sandbox
4. Check Daraja portal for test results

---

## 🚀 Going Live (Production)

### **Requirements:**
1. ✅ Registered business in Kenya
2. ✅ M-Pesa Business Account (Paybill or Till)
3. ✅ Complete KYC verification
4. ✅ Submit Go Live request on Daraja Portal
5. ✅ Wait for Safaricom approval (1-2 weeks)

### **Documents Needed:**
- Business Registration Certificate
- KRA PIN Certificate
- ID/Passport copies
- M-Pesa Statement/Proof

---

## 💰 Costs

### **Daraja API:**
- ✅ **FREE** to register and use
- ✅ No API call charges

### **M-Pesa Transaction Fees:**
- Charged by Safaricom on each transaction
- Varies based on your business type
- Usually 1-3% of transaction value
- Contact Safaricom for exact rates

---

## 🔍 Alternative: Manual M-Pesa (Current Setup)

If you can't setup Daraja API immediately, your **current approach works**:

### **How it works now:**
1. Customer selects M-Pesa
2. Order is created with "pending" status
3. You send customer an email/SMS with:
   - Till Number: 7121042
   - Amount to pay
   - Order reference
4. Customer manually pays via M-Pesa
5. Customer sends you confirmation
6. You manually confirm order

### **Pros:**
- ✅ No technical setup needed
- ✅ Works immediately
- ✅ Simple

### **Cons:**
- ❌ Not automated
- ❌ Customer has to manually pay
- ❌ You have to manually verify payments
- ❌ Slower process

---

## 📞 Getting Help

### **Safaricom Daraja Support:**
- Email: apisupport@safaricom.co.ke
- Portal: https://developer.safaricom.co.ke/support

### **Useful Resources:**
- Documentation: https://developer.safaricom.co.ke/Documentation
- GitHub Examples: https://github.com/safaricom
- YouTube Tutorials: Search "Daraja API Integration"

---

## 🎯 Recommendation

### **For Now (Immediate):**
Use your current manual Till Number (7121042) approach:
- ✅ Works right now
- ✅ No setup needed
- ✅ You can start selling immediately

### **For Future (3-6 months):**
Implement Daraja STK Push:
- ✅ Professional automated experience
- ✅ Instant payment confirmation
- ✅ Better customer experience
- ✅ Scalable for growth

---

## ✅ Summary

**What you need for REAL STK Push:**
1. ☑️ Daraja API account
2. ☑️ Consumer Key & Secret
3. ☑️ Business Short Code
4. ☑️ Passkey
5. ☑️ Backend/Edge Functions
6. ☑️ Callback URL handler
7. ☑️ Supabase setup
8. ☑️ Go Live approval (for production)

**Your current setup:**
- ✅ Creates orders successfully
- ✅ Works with manual payments to Till 7121042
- ❌ Doesn't send automatic phone prompts
- ❌ Requires manual payment verification

---

**Need help setting this up? Let me know and I can:**
1. Create the Supabase Edge Functions for you
2. Help with Daraja API integration
3. Setup the callback handlers
4. Test the flow
