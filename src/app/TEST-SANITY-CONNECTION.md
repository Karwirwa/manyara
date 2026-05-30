# 🧪 QUICK TEST GUIDE - Sanity Integration

## ✅ 3-Minute Verification

Follow these steps to verify your Sanity CMS integration is working:

---

## Test 1: Check Edge Function (30 seconds)

### Option A: Browser Test
1. Open a new browser tab
2. Paste this URL:
   ```
   https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
   ```
3. **Expected Result:**
   ```json
   {
     "status": "ok",
     "message": "MANYARA Backend API",
     "timestamp": "2026-01-16T..."
   }
   ```

### Option B: Command Line Test
```bash
curl https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/health
```

**✅ Pass:** You see `"status": "ok"`  
**❌ Fail:** Error or no response → Edge Function not deployed

---

## Test 2: Check Product Endpoint (30 seconds)

### Browser Test
1. Open a new browser tab
2. Paste this URL:
   ```
   https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products
   ```
3. **Expected Result:**
   ```json
   {
     "success": true,
     "products": [...array of products...],
     "count": 23,
     "source": "sanity"
   }
   ```

**✅ Pass:** You see `"success": true` and product array  
**❌ Fail:** Error or `"success": false` → Check Sanity has products

---

## Test 3: Open Your Site (1 minute)

### Step 1: Open Browser Console
1. Open your MANYARA site
2. Press `F12` (Windows) or `Cmd+Option+I` (Mac)
3. Click "Console" tab

### Step 2: Check Startup Messages
Look for this in console:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎀 MANYARA Luxury Lingerie E-Commerce 🎀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Application Status: FULLY OPERATIONAL
📦 Data Source: Sanity CMS via Edge Function
🔗 Edge Function: make-server-5cb00c7d
```

**✅ Pass:** You see "Sanity CMS via Edge Function"  
**❌ Fail:** You see "Mock Products" → `USE_SANITY` might be `false`

### Step 3: Check Product Loading
Look for these messages:
```
📦 Fetching products from Sanity CMS via Edge Function...
🔗 Fetching from Edge Function: https://trtqbruuzdvlmzrzwrot...
✅ Fetched 23 products from Sanity via Edge Function
✅ Loaded 23 products from Sanity via Edge Function
```

**✅ Pass:** You see "Fetched X products from Sanity"  
**❌ Fail:** You see error messages → Check troubleshooting below

---

## Test 4: Visual Verification (1 minute)

### Check Bottom-Left Indicator
1. When site loads, bottom-left should show:
   ```
   🟢 Sanity CMS Connected • via Edge Function
   ```
   (Green dot, not yellow/orange)

### Check Products Display
1. Scroll to "Explore Categories" section
2. Categories should display (if you have products in Sanity)
3. Click a category
4. Scroll to "Our Collection"
5. Products should display

### Check Product Details
1. Click "View Product" on any product
2. Modal should open with product details
3. Image, name, price, description should all display

---

## 🎯 What Success Looks Like

### Console (No Errors)
```
✅ Application Status: FULLY OPERATIONAL
📦 Data Source: Sanity CMS via Edge Function
✅ Fetched 23 products from Sanity via Edge Function
✅ Loaded 5 active categories
```

### UI (Products Visible)
- Categories section shows your Sanity categories
- Products section shows your Sanity products
- No "No products available" message
- All images load correctly

### Network Tab (Successful Requests)
1. Open F12 → Network tab
2. Refresh page
3. Look for request to: `make-server-5cb00c7d/sanity-products`
4. Status should be: `200 OK`
5. Response should contain your products

---

## ❌ Troubleshooting

### Issue: "Mock Data Active" showing

**Cause:** `USE_SANITY = false` in productService.ts  
**Fix:**
1. Open `/utils/sanity/productService.ts`
2. Change line 12 to: `const USE_SANITY = true;`
3. Save file
4. Hard refresh browser (Ctrl+Shift+R)

### Issue: "Edge Function error: 404"

**Cause:** Edge Function not deployed or wrong name  
**Fix:**
1. Verify Edge Function is deployed in Supabase Dashboard
2. Check function name is exactly: `make-server-5cb00c7d`
3. Verify URL is correct

### Issue: "No products found in Sanity CMS"

**Cause:** Sanity has no published products  
**Fix:**
1. Go to https://ximq2iuj.sanity.studio
2. Add products in Sanity Studio
3. Make sure to click "Publish"
4. Refresh your site

### Issue: Products loading but images broken

**Cause:** Products in Sanity have no images uploaded  
**Fix:**
- Edge Function automatically provides fallback images
- This is normal and expected
- Upload images in Sanity Studio to see real images

### Issue: Categories not showing

**Cause:** No products in Sanity OR products have no category  
**Fix:**
1. Add products in Sanity Studio
2. Make sure each product has a category assigned
3. Categories are automatically extracted from products

---

## 📊 Expected Behavior

### On First Load
1. Site loads
2. Console shows: "Fetching products from Sanity CMS via Edge Function"
3. Bottom-left shows: "Sanity CMS Connected"
4. Products appear after 1-2 seconds

### After Products Load
1. Categories section populated
2. Products section shows all products
3. Search works
4. Category filtering works
5. Product modals work

### If Sanity Fails
1. Console shows: "Error fetching from Sanity"
2. Console shows: "Falling back to mock data"
3. 6 mock products display
4. Site remains functional

---

## ✅ Success Checklist

Run through this checklist:

- [ ] Edge Function `/health` returns `"status": "ok"`
- [ ] Edge Function `/sanity-products` returns products array
- [ ] Console shows "Sanity CMS via Edge Function"
- [ ] Console shows "Fetched X products from Sanity"
- [ ] Bottom-left shows "Sanity CMS Connected" with green dot
- [ ] Categories section displays your categories
- [ ] Products section displays your products
- [ ] Product images load (real or fallback)
- [ ] Click product → Modal opens with details
- [ ] Add to cart works
- [ ] No console errors (red messages)

**All checked?** ✅ Your integration is working perfectly!

---

## 🚀 Next Steps After Successful Test

### 1. Add Real Products
- Go to https://ximq2iuj.sanity.studio
- Add your actual lingerie products
- Upload product images
- Assign categories
- Click "Publish"

### 2. Test Product Updates
- Edit a product in Sanity
- Click "Publish"
- Refresh your site
- Changes should appear immediately

### 3. Customize Categories
- Products automatically create categories
- Use consistent category names
- Edge Function normalizes variations
- See SANITY-EDGE-FUNCTION-CONNECTED.md for category list

### 4. Monitor Performance
- Check browser console for any errors
- Verify all images loading
- Test on mobile devices
- Test with slow internet

---

## 📞 Need Help?

### Check Documentation
- `/SANITY-EDGE-FUNCTION-CONNECTED.md` - Full integration guide
- `/STATUS-JANUARY-2026.md` - Overall site status

### Common Solutions
1. **Hard refresh:** Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. **Clear cache:** Browser settings → Clear browsing data
3. **Check Sanity Studio:** Make sure products are published
4. **Check console:** F12 → Console tab for error messages

---

## 🎉 You're Done!

If all tests passed, your MANYARA site is successfully connected to Sanity CMS!

**What You Have:**
- ✅ Live connection to Sanity CMS
- ✅ Products loading dynamically
- ✅ Automatic category management
- ✅ Image fallback system
- ✅ Error handling and fallbacks
- ✅ Fully functional e-commerce site

**Time to celebrate!** 🎀🎊

---

**Test Guide Version:** 1.0  
**Date:** January 16, 2026  
**Status:** Ready to test!
