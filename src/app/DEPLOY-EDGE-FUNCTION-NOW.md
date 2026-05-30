# 🚀 DEPLOY EDGE FUNCTION - Step by Step

## ⚡ Quick Fix (5 Minutes)

Your 401 error is fixed in the code. Just need to deploy it!

---

## 📋 Step-by-Step Deployment

### Step 1: Open Supabase Dashboard
```
URL: https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot
```

Click the link or paste in your browser.

---

### Step 2: Navigate to Edge Functions
1. Look at the left sidebar
2. Find "Edge Functions" (icon: ⚡)
3. Click it

---

### Step 3: Find Your Function
1. Look for: `make-server-5cb00c7d`
2. Click on it to open

---

### Step 4: Edit/Deploy
1. You'll see the function code editor
2. Click **"Edit"** or **"Deploy new version"** button
3. Delete all existing code in the editor

---

### Step 5: Copy Updated Code
1. Open this file in your project:
   ```
   /supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx
   ```

2. Select ALL (Ctrl+A / Cmd+A)

3. Copy (Ctrl+C / Cmd+C)

---

### Step 6: Paste and Deploy
1. Go back to Supabase Dashboard
2. Paste the code (Ctrl+V / Cmd+V)
3. Look for a **"Deploy"** or **"Save"** button
4. Click it

---

### Step 7: Wait for Deployment
- Status will show "Deploying..."
- Wait 10-30 seconds
- Should show "Deployed successfully" or similar

---

### Step 8: Test It Works
Open this URL in your browser:
```
https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

**Should see:**
```json
{
  "status": "ok",
  "message": "MANYARA Backend API",
  "timestamp": "2026-01-16T..."
}
```

---

### Step 9: Test Your MANYARA Site
1. Go to your MANYARA site
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. Open browser console (F12)

**Should see:**
```
✅ Fetched X products from Sanity via Edge Function
```

**NO MORE:**
```
❌ Edge Function fetch error: Error: Edge Function error: 401 ❌
```

---

## ✅ Success Indicators

### Console (Clean & Green):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎀 MANYARA Luxury Lingerie E-Commerce 🎀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Application Status: FULLY OPERATIONAL
📦 Data Source: Sanity CMS via Edge Function
🔗 Edge Function: make-server-5cb00c7d
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Fetching products from Sanity CMS via Edge Function...
✅ Fetched 23 products from Sanity via Edge Function
✅ Loaded 23 products from Sanity via Edge Function
```

### UI:
- ✅ Bottom-left shows: "🟢 Sanity CMS Connected"
- ✅ Products load (from Sanity if you have them, or mock data)
- ✅ No error messages
- ✅ Categories work
- ✅ Search works
- ✅ Everything operational!

---

## 🎯 What You're Deploying

The updated Edge Function includes:

### Enhanced CORS Configuration
Allows your frontend to call the Edge Function with Authorization headers:
```typescript
cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'], // ← This fixes it!
  credentials: true,
})
```

### All Existing Features
- ✅ Fetch products from Sanity
- ✅ Category normalization
- ✅ Image fallbacks
- ✅ M-Pesa integration endpoints
- ✅ Order management
- ✅ KV store for admin panel
- ✅ Email notifications

Nothing is removed, just enhanced!

---

## ❓ Troubleshooting

### "I don't see an Edit/Deploy button"
- Try clicking the 3-dot menu (⋮) next to the function
- Look for "Deploy new version" or "Edit"
- Or create a new function with same name (it will replace)

### "Deployment failed"
- Check for syntax errors in the code
- Make sure you copied the ENTIRE file
- Try again - sometimes Supabase has temporary issues

### "Still getting 401 after deployment"
1. Verify deployment time is recent (just now)
2. Hard refresh your site: Ctrl+Shift+R
3. Clear browser cache
4. Check browser console for actual error message

### "Function not found in dashboard"
- The function might not be deployed yet
- You may need to create it fresh
- Name it exactly: `make-server-5cb00c7d`

---

## 🎊 After Successful Deployment

Your MANYARA site will:
1. ✅ Connect to Sanity CMS via Edge Function
2. ✅ Fetch products dynamically
3. ✅ No more 401 errors
4. ✅ Clean console output
5. ✅ Fully operational e-commerce

You can then:
- Add products in Sanity Studio
- Manage your inventory
- Process orders
- Everything works! 🎉

---

## 📞 Need Help?

### Check These Files:
- `/401-ERROR-FIXED.md` - Quick summary of what was fixed
- `/EDGE-FUNCTION-DEPLOYMENT-REQUIRED.md` - Detailed deployment guide
- `/SANITY-EDGE-FUNCTION-CONNECTED.md` - Full integration documentation

### Test Commands:
```bash
# Test health endpoint
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health

# Test products endpoint
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
```

---

## ⏰ Time Estimate

- **Reading this guide:** 2 minutes
- **Deploying:** 2 minutes
- **Testing:** 1 minute
- **Total:** 5 minutes

Then your site is fully operational with Sanity CMS! 🚀

---

## 🎯 One-Sentence Summary

**Copy the updated Edge Function code from `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx` and deploy it via the Supabase Dashboard to fix the 401 error.**

---

**Ready? Let's deploy!** 🚀

1. Open: https://supabase.com/dashboard/project/trtqbruuzdvlmzrzwrot/functions
2. Find: `make-server-5cb00c7d`
3. Copy: `/supabase/functions/make-server-5cb00c7d-DASHBOARD-VERSION.tsx`
4. Paste & Deploy
5. Done! ✅

---

**Created:** January 16, 2026  
**Status:** Ready to deploy  
**Expected result:** No more 401 errors! 🎉
