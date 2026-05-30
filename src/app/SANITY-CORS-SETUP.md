# Sanity CORS Setup Required

## Current Issue

Your MANYARA site is trying to connect to Sanity CMS (project ID: ximq2iuj), but **CORS (Cross-Origin Resource Sharing) is blocking the connection**.

### Error in Console:
```
❌ Error fetching from Sanity: TypeError: Failed to fetch
🚫 CORS Error: Cannot access Sanity API directly from browser
```

---

## What is CORS?

CORS is a security feature in web browsers that prevents websites from making requests to different domains unless explicitly allowed.

**Your situation:**
- Your website domain: `figma.com` (or your custom domain)
- Sanity API domain: `ximq2iuj.api.sanity.io`
- Browser blocks requests between different domains by default

---

## Solution: Enable CORS in Sanity

You need to add your website's domain to Sanity's CORS allowed origins list.

### Step 1: Go to Sanity Dashboard

1. Open: https://www.sanity.io/manage
2. Log in with your Sanity account
3. Click on project: **ximq2iuj**

### Step 2: Navigate to CORS Settings

1. In the left sidebar, click **"API"**
2. Click on **"CORS Origins"** tab
3. You'll see a list of allowed origins (might be empty)

### Step 3: Add Your Website Domain

Click **"Add CORS Origin"** button and add:

#### For Development/Testing:
```
*
```
- This allows **all domains** (wildcard)
- Good for testing, but not recommended for production
- Use this if you want to test quickly

#### For Production (Recommended):
Add your specific domains:
```
https://www.figma.com
https://figma.com
http://localhost:3000
```
- Replace with your actual website domain
- You can add multiple domains
- More secure than wildcard

### Step 4: Save Settings

1. Click **"Add Origin"** or **"Save"**
2. Wait a few seconds for changes to propagate
3. Refresh your website

---

## Quick Test After Setup

### Option 1: Test in Browser Console

1. Open your website
2. Press **F12** to open browser console
3. Paste this code and press Enter:
   ```javascript
   fetch('https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="product"]')
     .then(r => r.json())
     .then(d => console.log('✅ CORS Working!', d.result))
     .catch(e => console.error('❌ CORS Error:', e))
   ```

4. **If CORS is working:** You'll see `✅ CORS Working!` with product data
5. **If CORS is still blocked:** You'll see `❌ CORS Error: Failed to fetch`

### Option 2: Refresh Your Site

1. Simply refresh your MANYARA website
2. Open browser console (F12)
3. Look for:
   ```
   ✅ Loaded X products from Sanity CMS
   ```

---

## What If You Can't Access Sanity Dashboard?

### Problem: No Sanity Account Access

If you don't have access to the Sanity project `ximq2iuj`:

#### Option 1: Contact Project Owner
- Ask the person who created the Sanity project to:
  1. Add you as a team member
  2. Or configure CORS for you

#### Option 2: Use Your Own Sanity Project

1. **Create new Sanity project:**
   ```bash
   npm install -g @sanity/cli
   sanity init
   ```

2. **Copy the new Project ID** (e.g., `abc123xyz`)

3. **Update your site:**
   - Open: `/utils/sanity/client.ts`
   - Change line 13:
     ```typescript
     const SANITY_PROJECT_ID = 'your-new-project-id';
     ```

4. **Deploy schemas and add products** (see `/SANITY-SCHEMA-SETUP.md`)

#### Option 3: Keep Using Mock Data (Temporary)

If you can't set up Sanity right now, disable it:

**File:** `/utils/sanity/productService.ts`
```typescript
const USE_SANITY = false; // Use mock data instead
```

**File:** `/utils/sanity/categoryService.ts`
```typescript
const USE_SANITY = false; // Use mock data instead
```

Your site will work perfectly with 6 demo products.

---

## Alternative: Deploy Edge Function (Advanced)

Instead of fixing CORS, you can deploy a Supabase Edge Function that acts as a proxy.

### Why Edge Function?
- Bypasses CORS (server-to-server communication)
- No CORS configuration needed
- More secure

### How to Deploy:

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref trtqbruuzdvlmzrzwrot
   ```

4. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy server
   ```

5. **Test the Edge Function:**
   ```
   https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/server/sanity-products
   ```

6. **Update your site** to use Edge Function instead:
   - Open: `/utils/sanity/productService.ts`
   - Change `fetchProducts()` to call `fetchProductsFromEdgeFunction()`

---

## Recommended Solution Path

### Path 1: Quick Fix (5 minutes)
1. Add `*` to Sanity CORS origins (wildcard)
2. Refresh your site
3. ✅ Works immediately

**Pros:** Fast, easy  
**Cons:** Less secure (allows all domains)

### Path 2: Proper Setup (10 minutes)
1. Add your specific domain to Sanity CORS
2. Test thoroughly
3. ✅ Works securely

**Pros:** Secure, production-ready  
**Cons:** Requires knowing your domain

### Path 3: Edge Function (30 minutes)
1. Deploy Supabase Edge Function
2. Update site to use Edge Function
3. ✅ No CORS issues, most secure

**Pros:** Most secure, bypasses CORS entirely  
**Cons:** Requires Supabase CLI setup

### Path 4: Keep Mock Data (1 minute)
1. Set `USE_SANITY = false`
2. ✅ Site works with demo products

**Pros:** Zero setup, works immediately  
**Cons:** Not using real products from Sanity

---

## Visual Guide to Sanity CORS Setup

### 1. Sanity Dashboard
```
┌─────────────────────────────────────┐
│  Sanity Dashboard                   │
├─────────────────────────────────────┤
│  ☰ Settings                         │
│  📊 Content                         │
│  🔌 API         ← Click here        │
│  👥 Team                            │
└─────────────────────────────────────┘
```

### 2. CORS Origins Tab
```
┌─────────────────────────────────────┐
│  API Settings                       │
├─────────────────────────────────────┤
│  [Tokens] [CORS Origins] [Webhooks]│
│            ↑ Click this tab         │
└─────────────────────────────────────┘
```

### 3. Add Origin
```
┌─────────────────────────────────────┐
│  CORS Origins                       │
├─────────────────────────────────────┤
│  Allowed origins:                   │
│  (empty)                            │
│                                     │
│  [ + Add CORS Origin ]  ← Click     │
└─────────────────────────────────────┘
```

### 4. Enter Domain
```
┌─────────────────────────────────────┐
│  Add CORS Origin                    │
├─────────────────────────────────────┤
│  Origin:                            │
│  [*                              ]  │
│     ↑ Type * for all domains        │
│                                     │
│  [ Cancel ]  [ Add Origin ]         │
└─────────────────────────────────────┘
```

---

## After CORS is Fixed

Once CORS is configured, your site will:

1. ✅ Connect to Sanity CMS directly
2. ✅ Load products from your Sanity project
3. ✅ Show green indicator: "Connected to Sanity CMS"
4. ✅ Display real product data instead of mock data

### Console Messages (Success):
```
🔗 Fetching from Sanity API directly...
📝 Query: *[_type == "product"] | order(_createdAt desc) { ...
✅ Sanity response received: X items
✅ Loaded X products from Sanity CMS
```

---

## Troubleshooting

### Still Getting CORS Error After Adding Origin?

**Check 1: Wait a moment**
- CORS changes take 10-30 seconds to propagate
- Clear browser cache (Ctrl+Shift+R)
- Try in incognito/private window

**Check 2: Check the domain**
- Make sure you added the correct domain
- Include `https://` or `http://`
- Match exactly (with or without www)

**Check 3: Try wildcard temporarily**
- Add `*` as origin to test
- If this works, your domain was wrong
- Then add the correct specific domain

### Products Still Not Loading?

**Possible causes:**
1. No products in Sanity → Add products in Sanity Studio
2. Products not published → Publish them in Studio
3. Wrong project ID → Verify `ximq2iuj` is correct
4. Dataset wrong → Should be `production`

**Test Sanity has products:**
```
Open: https://www.sanity.io/manage
Project: ximq2iuj
Vision tool → Query: *[_type == "product"]
Should return array of products
```

---

## Summary

**Problem:** CORS blocking Sanity API requests  
**Solution:** Add your domain to Sanity CORS origins  
**Location:** https://www.sanity.io/manage → Project ximq2iuj → API → CORS Origins  
**Quick Fix:** Add `*` (wildcard) for testing  
**Proper Fix:** Add specific domain for production  

**After fixing CORS, your site will connect to Sanity and display real products!**

---

## Support Links

- **Sanity Dashboard:** https://www.sanity.io/manage
- **Sanity CORS Docs:** https://www.sanity.io/docs/front-ends/cors
- **Your Project:** https://www.sanity.io/manage/project/ximq2iuj

**Your Business:**
- Email: rastamousequeen@gmail.com
- Phone: 0797040512
