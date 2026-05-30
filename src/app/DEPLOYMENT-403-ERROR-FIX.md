# 🔧 Fix: 403 Forbidden Error When Deploying Edge Function

## Error Analysis

### The Error You're Getting:
```
❌ Error while deploying: XHR for "/api/integrations/supabase/10WBrElbGlciFKK7bWCPFq/edge_functions/make-server/deploy" failed with status 403
```

### What This Means:
**403 Forbidden** = You don't have permission to deploy through this method.

### Root Cause:
You're trying to deploy through the **Figma Make interface**, which doesn't have the necessary permissions to deploy Supabase Edge Functions on your behalf. Supabase Edge Functions can only be deployed through:
1. **Supabase CLI** (recommended)
2. **Supabase Dashboard** (manual copy-paste)
3. **Supabase API** (with proper auth tokens)

The Figma Make platform cannot deploy Edge Functions directly to your Supabase project for security reasons.

---

## ✅ Solution: Deploy Manually

You have **3 options** to deploy. Choose the one that works best for you.

---

## Option 1: Supabase CLI (Fastest & Recommended)

### Prerequisites:
- Node.js installed
- Terminal/Command Prompt access
- Supabase account credentials

### Step-by-Step Instructions:

#### 1. Install Supabase CLI

**On macOS/Linux:**
```bash
npm install -g supabase
```

**On Windows:**
```bash
npm install -g supabase
```

**Or use Homebrew (macOS):**
```bash
brew install supabase/tap/supabase
```

**Or use Scoop (Windows):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

#### 2. Login to Supabase

```bash
supabase login
```

This will:
- Open your browser
- Ask you to authorize the CLI
- Save your credentials

---

#### 3. Prepare the Edge Function

The Edge Function code is already in your project at:
- `/supabase/functions/server/index.tsx`
- `/supabase/functions/server/kv_store.tsx`

But you need to rename the folder from `server` to `make-server-5cb00c7d` to match the expected function name.

**Important:** The function name in the code is `make-server-5cb00c7d`, but the folder is named `server`. We need to fix this.

---

#### 4. Rename the Function Folder

**Option A: Using File System (Easier)**

Since you're in a web-based environment, I'll create the correct folder structure for you.

**Option B: Using Terminal**
```bash
cd supabase/functions
mv server make-server-5cb00c7d
```

---

#### 5. Deploy the Edge Function

```bash
supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
```

**Expected Output:**
```
Deploying Function make-server-5cb00c7d (project: trtqbruuzdvlmzrzwrot)
  Bundling function...
  Uploading function...
  ✓ Function deployed successfully
  
Function URL: https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d
```

---

#### 6. Test the Deployment

```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "MANYARA Backend API",
  "timestamp": "2026-01-16T..."
}
```

---

## Option 2: Supabase Dashboard (No CLI Required)

### Step-by-Step Instructions:

#### 1. Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot

#### 2. Navigate to Edge Functions

- Click **"Edge Functions"** in the left sidebar
- Click **"Create a new function"**

#### 3. Create the Function

**Function Name:** `make-server-5cb00c7d`

**Important:** Use exactly this name - it matches what the frontend expects.

#### 4. Copy the Code

You need to copy the code from `/supabase/functions/server/index.tsx` into the dashboard editor.

I'll prepare a single-file version for you that combines both files.

#### 5. Configure Environment Variables (if needed)

The function uses these environment variables (already configured in Supabase):
- `SANITY_PROJECT_ID` = `ximq2iuj`
- `SANITY_DATASET` = `production`
- `SANITY_API_VERSION` = `2024-01-01`

You can check these in: **Project Settings → Edge Functions → Environment Variables**

#### 6. Deploy

Click the **"Deploy"** button in the dashboard.

#### 7. Test

Visit: `https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health`

---

## Option 3: Alternative - Keep Using Mock Data

If you don't need the admin features right now, you can continue using the mock data approach:

### What Works Without Backend:
✅ Customer site (100% functional)
✅ Product browsing
✅ Shopping cart
✅ Checkout UI
✅ All pages and navigation

### What Requires Backend:
❌ Admin product upload
❌ Admin product deletion
❌ Sanity CMS import
❌ Real order storage
❌ M-Pesa payment processing

---

## Troubleshooting

### Problem: "supabase: command not found"

**Solution:** The CLI isn't installed or not in your PATH.

**Fix:**
```bash
# Try with npx
npx supabase login

# Or reinstall globally
npm install -g supabase
```

---

### Problem: "Project not found"

**Solution:** Wrong project reference.

**Fix:**
Make sure you use the correct project ref: `trtqbruuzdvlmzrzwrot`

```bash
supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
```

---

### Problem: "Function name mismatch"

**Solution:** The folder name doesn't match the function name.

**Fix:**
Rename `/supabase/functions/server/` to `/supabase/functions/make-server-5cb00c7d/`

---

### Problem: "Invalid credentials"

**Solution:** Not logged in or session expired.

**Fix:**
```bash
supabase logout
supabase login
```

---

### Problem: "Deployment takes too long"

**Solution:** Large bundle size or network issues.

**Fix:**
- Check your internet connection
- Try deploying with verbose logging:
```bash
supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot --debug
```

---

## After Successful Deployment

### 1. Re-enable Admin Panel Features

Edit `/components/AdminPage.tsx` and remove the early returns:

**Remove lines 50-54** (fetchProducts early return)
**Remove lines 93-95** (fetchDebugInfo early return)  
**Remove lines 124-130** (handleUpload early return)
**Remove lines 193-199** (handleDelete early return)
**Remove lines 231-236** (fetchSanityProducts early return)

**Then uncomment the original code** below each removed section.

### 2. Test All Features

Open your admin panel and test:
- ✅ Products load from KV store
- ✅ Import from Sanity CMS works
- ✅ Upload products works
- ✅ Delete products works
- ✅ Orders can be viewed

### 3. Verify Endpoints

Test each endpoint:

```bash
# Health check
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health

# Sanity products
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products

# KV products
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/kv-products

# Debug
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/debug/keys
```

---

## Why 403 Errors Happen

### Security Model:

```
┌─────────────────────────────────┐
│   Figma Make Environment        │
│   (No Supabase Credentials)     │
│                                 │
│   ❌ Cannot deploy to Supabase  │
│   ❌ No write access             │
│   ❌ 403 Forbidden               │
└─────────────────────────────────┘
              ↓
         Blocked by
         Supabase
              ↓
┌─────────────────────────────────┐
│   Supabase Project              │
│   (Requires Authentication)     │
│                                 │
│   ✅ CLI with login = allowed   │
│   ✅ Dashboard = allowed         │
│   ✅ Valid API key = allowed     │
└─────────────────────────────────┘
```

**Why:** Supabase protects your project from unauthorized deployments. Only authenticated users with the right credentials can deploy Edge Functions.

**The Fix:** Use an authenticated method (CLI or Dashboard) instead of the Figma Make interface.

---

## Config Files Already Protected

Good news! Your config files already prevent auto-deployment attempts:

### `/supabase/config.toml`:
```toml
[functions]
enabled = false

[functions.server]
enabled = false
deploy = false
```

### `/supabase/functions/deno.json`:
```json
{
  "deploy": false,
  "disabled": true,
  "ignore": ["server/"]
}
```

These settings prevent automatic deployment attempts that would cause 403 errors.

---

## Recommended Deployment Path

### For Production (Best):

1. **Install Supabase CLI** (one-time setup)
   ```bash
   npm install -g supabase
   ```

2. **Login** (one-time setup)
   ```bash
   supabase login
   ```

3. **Deploy** (whenever you update the function)
   ```bash
   supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
   ```

### For Quick Testing (Easiest):

1. **Go to Supabase Dashboard**
   https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot

2. **Create Edge Function**
   - Click "Edge Functions" → "Create Function"
   - Name: `make-server-5cb00c7d`

3. **Copy Code**
   - I'll provide a single-file version below

4. **Deploy**
   - Click "Deploy" button

---

## Single-File Version for Dashboard Deployment

If you choose Option 2 (Dashboard deployment), I'll need to create a combined version of the Edge Function code that merges `index.tsx` and `kv_store.tsx` into a single file.

Let me know if you want me to create that, or if you prefer to use the CLI method.

---

## Summary

### The Problem:
- ❌ 403 Forbidden error
- ❌ Figma Make can't deploy Edge Functions
- ❌ Security restriction

### The Solution:
- ✅ Use Supabase CLI (recommended)
- ✅ Or use Supabase Dashboard (manual)
- ✅ Both methods have proper authentication

### Next Steps:

**Choose One:**

**A. CLI Method (Recommended):**
```bash
npm install -g supabase
supabase login
supabase functions deploy make-server-5cb00c7d --project-ref trtqbruuzdvlmzrzwrot
```

**B. Dashboard Method:**
1. Go to https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot
2. Click "Edge Functions" → "Create Function"
3. Name it `make-server-5cb00c7d`
4. Copy the code I'll provide
5. Click "Deploy"

**C. Skip Deployment (Keep Using Mock Data):**
- Customer site works perfectly
- Admin features show clear messages
- No deployment needed

---

## Contact & Support

**Supabase Dashboard:** https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot  
**Supabase CLI Docs:** https://supabase.com/docs/guides/cli  
**Edge Functions Docs:** https://supabase.com/docs/guides/functions

**Your Project ID:** `trtqbruuzdvlmzrzwrot`  
**Function Name:** `make-server-5cb00c7d`  
**Backend Code:** `/supabase/functions/server/index.tsx`

---

**The 403 error is not a bug in your code - it's a security feature. Use the CLI or Dashboard to deploy manually.**
