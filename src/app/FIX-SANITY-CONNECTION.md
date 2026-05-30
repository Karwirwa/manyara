# 🔧 Fix Sanity Connection - Simple Steps

## Current Status

✅ **Your site is enabled to connect to Sanity**  
❌ **But CORS is blocking the connection**

---

## The Problem (In Simple Terms)

Your website is trying to get products from Sanity CMS, but Sanity's security (CORS) is saying "No, I don't allow requests from your website."

**Think of it like this:**
- Your website is at a door (your domain)
- Sanity CMS is inside a building (Sanity's API)
- CORS is the security guard blocking you
- You need to add your name to the "allowed visitors" list

---

## The Solution (5 Minutes)

### Step 1: Open Sanity Dashboard
Go to: **https://www.sanity.io/manage**

### Step 2: Open Your Project
Click on: **ximq2iuj** (your project)

### Step 3: Go to API Settings
On the left sidebar, click: **API**

### Step 4: Open CORS Settings
At the top, click the tab: **CORS Origins**

### Step 5: Add Origin
Click the button: **"+ Add CORS Origin"**

### Step 6: Enter the Wildcard
In the text box, type: `*`

(This means "allow ALL domains" - good for testing)

### Step 7: Save
Click: **"Add Origin"** or **"Save"**

### Step 8: Wait & Test
Wait 30 seconds, then refresh your website.

---

## After CORS is Fixed

Your site will show:

✅ **Green indicator** in bottom-left corner  
✅ **"Connected to Sanity CMS • Project: ximq2iuj"**  
✅ **Products load from Sanity**

---

## What If You Can't Access Sanity?

### Option A: Ask Someone Who Has Access
If someone else created the Sanity project, ask them to:
1. Add you as a team member, OR
2. Add `*` to CORS origins for you

### Option B: Use Mock Data Instead
Don't want to deal with Sanity right now? No problem!

**Just disable Sanity:**

1. Open: `/utils/sanity/productService.ts`
2. Change line 12 from:
   ```typescript
   const USE_SANITY = true;
   ```
   to:
   ```typescript
   const USE_SANITY = false;
   ```

3. Open: `/utils/sanity/categoryService.ts`
4. Change line 10 from:
   ```typescript
   const USE_SANITY = true;
   ```
   to:
   ```typescript
   const USE_SANITY = false;
   ```

5. Your site will use 6 demo products and work perfectly!

---

## Visual Guide

```
1. Go to Sanity Dashboard
   https://www.sanity.io/manage
   
2. Click your project
   ximq2iuj
   
3. Sidebar: API
   
4. Tab: CORS Origins
   
5. Button: + Add CORS Origin
   
6. Input: *
   
7. Button: Add Origin
   
8. Wait 30 seconds
   
9. Refresh your website
   
10. ✅ Done!
```

---

## Quick Test

After adding CORS origin, test if it works:

### Browser Console Test
1. Open your website
2. Press **F12** (opens console)
3. Paste this and press Enter:
```javascript
fetch('https://ximq2iuj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="product"]')
  .then(r => r.json())
  .then(d => console.log('✅ WORKS!', d))
  .catch(e => console.error('❌ STILL BLOCKED:', e))
```

4. **If you see `✅ WORKS!`**: CORS is fixed!
5. **If you see `❌ STILL BLOCKED`**: Wait a bit longer or clear cache

---

## Common Questions

### Q: Why `*` (wildcard)?
**A:** It allows all domains. Good for testing. For production, use your specific domain instead.

### Q: Is using `*` safe?
**A:** For a read-only API like Sanity products, yes. Anyone can see your products anyway (that's the point of e-commerce). But for production, use specific domains.

### Q: What if I want to be more secure?
**A:** Instead of `*`, add your specific domain:
- `https://www.your-domain.com`
- `https://your-domain.com`
- Add both www and non-www versions

### Q: How long does it take to work?
**A:** Usually 10-30 seconds after saving. Clear browser cache if needed.

### Q: What if I still get errors?
**A:** See the detailed guide: `/SANITY-CORS-SETUP.md`

---

## Summary

**Problem:** CORS blocking Sanity API  
**Solution:** Add `*` to CORS origins in Sanity dashboard  
**Time:** 5 minutes  
**Difficulty:** Easy  

**OR**

**Alternative:** Set `USE_SANITY = false` to use mock data

---

## Links

- **Sanity Dashboard:** https://www.sanity.io/manage
- **Your Project:** https://www.sanity.io/manage/project/ximq2iuj
- **Detailed CORS Guide:** `/SANITY-CORS-SETUP.md`
- **Full Setup Guide:** `/SANITY-RECONNECTION-GUIDE.md`

---

## Support

**Business:**
- Email: rastamousequeen@gmail.com
- Phone: 0797040512

**Need help?** See `/SANITY-CORS-SETUP.md` for more details!
