# Fix Supabase 403 Deployment Error

## Problem
Error: `XHR for "/api/integrations/supabase/.../edge_functions/make-server/deploy" failed with status 403`

## Root Cause
The 403 error indicates a **permissions issue** with your Supabase project. This can happen due to:

1. **Authentication problem** - Not properly logged in or session expired
2. **Project ownership** - The account (rastamousequeen@gmail.com) might not have deployment permissions
3. **Organization permissions** - Edge function deployment requires admin/owner access

---

## ✅ Solution 1: Re-authenticate with Supabase

### Step 1: Log out and log back in
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click your profile icon (top-right)
3. Click **"Sign out"**
4. Sign back in with: **rastamousequeen@gmail.com**

### Step 2: Verify Project Access
1. Go to your project: `trtqbruuzdvlmzrzwrot`
2. Click **"Settings"** (gear icon in left sidebar)
3. Click **"General"** 
4. Confirm you see "Owner" or "Admin" role

### Step 3: Try Deploying Again
1. Click **"Edge Functions"** in left sidebar
2. Select the **"make-server"** function
3. Click **"Deploy"** button
4. Wait for deployment to complete

---

## ✅ Solution 2: Use Supabase CLI (Recommended)

If the dashboard deployment fails, use the CLI which has better permissions handling:

### Step 1: Install Supabase CLI
```bash
# On macOS/Linux
brew install supabase/tap/supabase

# On Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```
- This will open a browser window
- Login with: **rastamousequeen@gmail.com**
- Authorize the CLI

### Step 3: Link Your Project
```bash
supabase link --project-ref trtqbruuzdvlmzrzwrot
```

### Step 4: Deploy the Edge Function
```bash
cd supabase/functions
supabase functions deploy make-server
```

### Step 5: Verify Deployment
```bash
# Test the health endpoint
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

You should see:
```json
{
  "status": "ok",
  "message": "MANYARA Backend API",
  "timestamp": "2026-01-06T..."
}
```

---

## ✅ Solution 3: Check Organization Settings

### Step 1: Go to Organization Settings
1. Dashboard → Click your profile icon
2. Select your organization (should show "rastamousequeen@gmail.com's Org")
3. Click **"Settings"**

### Step 2: Verify Members & Roles
1. Click **"Members"** tab
2. Confirm **rastamousequeen@gmail.com** has "Owner" role
3. If not, you may need to contact Supabase support

---

## ✅ Solution 4: Create New Access Token

Sometimes the deployment token is expired:

### Step 1: Generate New Token
1. Dashboard → Your profile icon → **"Access Tokens"**
2. Click **"Generate new token"**
3. Name it: "Edge Function Deployment"
4. Copy the token (save it somewhere safe!)

### Step 2: Use Token in CLI
```bash
# Set the token as environment variable
export SUPABASE_ACCESS_TOKEN="your-token-here"

# Deploy with the token
supabase functions deploy make-server
```

---

## ✅ Solution 5: Alternative - Manual API Call

If all else fails, deploy via REST API:

```bash
# Get your project's anon key
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDg0NDgsImV4cCI6MjA1MDcyNDQ0OH0.l6a42V3jGwMIoNLO3Q3Qb7iIq_-OVKS-Wg9r9KGbLFc"

# Deploy function
curl -X POST \
  "https://trtqbruuzdvlmzrzwrot.supabase.co/rest/v1/rpc/deploy_edge_function" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## 📋 Checklist Before Deploying

✅ Logged into Supabase dashboard with **rastamousequeen@gmail.com**  
✅ Confirmed "Owner" or "Admin" role on project  
✅ Edge function code has no syntax errors  
✅ `deno.json` file exists in `/supabase/functions/`  
✅ Internet connection is stable  
✅ Browser cache cleared (if using dashboard)

---

## 🔍 Still Getting 403 Error?

### Contact Supabase Support

If none of the above solutions work, this might be a Supabase platform issue:

1. **Email**: support@supabase.com
2. **Subject**: "403 Error Deploying Edge Function - Project trtqbruuzdvlmzrzwrot"
3. **Include**:
   - Your account email: rastamousequeen@gmail.com
   - Project reference: trtqbruuzdvlmzrzwrot
   - Function name: make-server
   - Error message: "XHR failed with status 403"

### Discord Community
Join Supabase Discord for faster help:
- https://discord.supabase.com
- Go to #help channel
- Share your error details

---

## 🚀 What Happens After Successful Deployment?

Once deployed successfully:

1. **Sanity Products Load**: Your 30 fallback products will be replaced with real products from Sanity CMS
2. **M-Pesa Payments Work**: Payment initiation and status checking endpoints go live
3. **Order Creation**: Orders are saved and confirmation emails sent
4. **Full Backend**: All 7 API endpoints become operational

---

## 💡 Quick Workaround (Temporary)

While fixing the deployment issue, your site **still works** because:

✅ 30 fallback products are displayed  
✅ Cart and checkout are fully functional  
✅ Payment methods are shown (M-Pesa, Bank Transfer, COD)  
✅ Frontend validation works  
✅ WhatsApp, social media links work  

The only thing not working yet is the actual backend processing (payment verification, order saving, emails).

---

## 🎯 Recommended Solution

**Use Supabase CLI (Solution 2)** - It's more reliable and gives better error messages than the dashboard deployment.

```bash
# Quick commands:
supabase login
supabase link --project-ref trtqbruuzdvlmzrzwrot
supabase functions deploy make-server

# Test it:
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

Good luck! 🚀
