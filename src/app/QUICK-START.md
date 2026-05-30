# MANYARA Quick Start Guide

**Ready to use your new Sanity-powered e-commerce site!**

---

## ✅ What's Working Right Now

Your MANYARA website is **fully functional** with:

- ✅ Sanity CMS integration (Project: ximq2iuj)
- ✅ Supabase backend (Project: trtqbruuzdvlmzrzwrot)
- ✅ Complete e-commerce functionality
- ✅ M-Pesa, bank transfer, and cash on delivery
- ✅ Shopping cart with persistence
- ✅ Order management system
- ✅ Responsive luxury design

---

## 🚀 Getting Started (3 Steps)

### Step 1: Add Products to Sanity

1. **Go to your Sanity Studio**
   - URL: https://[your-sanity-studio].sanity.studio
   - Or use Sanity CLI: `sanity start`

2. **Create your first product:**
   - Click "Products" → "Create new Product"
   - Fill in:
     - **Name**: e.g., "Luxury Lace Bra"
     - **Slug**: auto-generated from name
     - **Price**: e.g., 2500 (just the number)
     - **Category**: Select or create (e.g., "Bras")
     - **Sizes**: Add items: S, M, L, XL
     - **Colors**: Add items: Black, Nude, Red
     - **Short Description**: 1-2 sentences
     - **Long Description**: 2-3 paragraphs
     - **Main Image**: Upload product photo
     - **Additional Images**: Add 2-3 more photos
     - **In Stock**: ✓ Check this box
     - **Featured**: ✓ Check for homepage

3. **Click "Publish"**
   - Product appears on your website instantly!

### Step 2: Test Your Site

1. **Open your website**
   - Products from Sanity load automatically
   - Categories populate from Sanity

2. **Try the shopping flow:**
   - Browse products → View details → Select size/color
   - Add to cart → View cart → Proceed to checkout
   - Fill form → Select payment method → Complete order

3. **Check order in Supabase:**
   - Go to https://supabase.com/dashboard
   - Open your project (trtqbruuzdvlmzrzwrot)
   - Click "Table Editor" → "orders"
   - See your test order!

### Step 3: Configure M-Pesa (Optional)

Your M-Pesa Till Number (7121042) is already configured in the checkout.

For live M-Pesa STK Push:
1. Contact Safaricom for API credentials
2. Update Edge Function with credentials
3. Deploy to production

---

## 📁 Important Files

### Where Products Come From
- **Source**: Sanity CMS (ximq2iuj)
- **Code**: `/utils/sanity/productService.ts`
- **Component**: `/components/CollectionPage.tsx`

### Where Orders Go
- **Destination**: Supabase orders table
- **Code**: `/utils/supabase/orderService.ts`
- **Component**: `/components/CheckoutPage.tsx`

### Shopping Cart
- **Storage**: Browser localStorage
- **Code**: `/contexts/CartContext.tsx`
- **Component**: `/components/CartPage.tsx`

---

## 🎨 Customizing Your Site

### Change Colors
Edit `/styles/globals.css`:
```css
:root {
  --burgundy-wine: #800020;
  --olive-sage: #556B2F;
  --ivory-pearl: #FFFFF0;
  --champagne-gold: #F5F5DC;
}
```

### Update Business Info
Edit `/components/ContactSection.tsx`:
- Email: rispahkarwirwa@gmail.com
- Phone: 0797040512
- M-Pesa Till: 7121042

### Modify Payment Options
Edit `/components/CheckoutPage.tsx`:
- M-Pesa settings around line 350+
- Bank details around line 380+

---

## 🛍️ Product Management Workflow

### Daily Workflow
1. **Morning**: Check Supabase for new orders
2. **Add Products**: Create in Sanity Studio
3. **Update Stock**: Edit products, uncheck "In Stock" if needed
4. **Feature Products**: Check "Featured" for homepage
5. **Manage Categories**: Create new categories as needed

### Product Best Practices
- Use high-quality images (800x1000px minimum)
- Write descriptive titles and descriptions
- Include multiple color/size options
- Set realistic prices in KSh
- Mark featured products for homepage
- Keep stock status updated

---

## 📊 How It All Works

```
Customer visits website
    ↓
Products load from Sanity CMS
    ↓
Customer adds to cart (localStorage)
    ↓
Proceeds to checkout
    ↓
Order saved to Supabase
    ↓
Payment processed (M-Pesa/Bank/COD)
    ↓
Order confirmation email sent
    ↓
You fulfill order
    ↓
Update status in Supabase
```

---

## 🔧 Troubleshooting

### "No products showing"
**Solution:**
1. Check if products are published in Sanity
2. Ensure "In Stock" is checked
3. Open browser console (F12) for errors
4. Try hard refresh (Ctrl+Shift+R)

### "Images not loading"
**Solution:**
1. Verify images uploaded to Sanity (not external links)
2. Check browser console for 404 errors
3. Wait 30 seconds for CDN caching
4. Re-upload image if needed

### "Order not saving"
**Solution:**
1. Check Supabase dashboard → Table Editor → orders
2. Verify table exists with correct schema
3. Check browser console for API errors
4. Test with simpler data first

---

## 📞 Support Resources

### Documentation
- **Full Guide**: `SANITY-INTEGRATION-GUIDE.md`
- **Product Reference**: `PRODUCT-DATA-REFERENCE.md`
- **System Overview**: `SYSTEM-OVERVIEW.md`

### Contact
- **Email**: rispahkarwirwa@gmail.com
- **Phone**: 0797040512
- **Business Hours**: Mon-Sat, 9 AM - 6 PM EAT

### Technical
- **Sanity Project**: ximq2iuj
- **Supabase Project**: trtqbruuzdvlmzrzwrot
- **Frontend**: Figma Make (auto-deployment)

---

## 🎯 Next Actions

### Immediate (Today)
1. ✅ Add 5-10 products to Sanity
2. ✅ Upload product images
3. ✅ Test checkout flow
4. ✅ Verify orders in Supabase

### This Week
1. ✅ Add all product categories
2. ✅ Upload full product catalog
3. ✅ Test on mobile devices
4. ✅ Share with friends for feedback

### This Month
1. ✅ Go live with real payments
2. ✅ Market on social media
3. ✅ Fulfill first orders
4. ✅ Gather customer reviews

---

## 💡 Pro Tips

1. **Batch Upload**: Create products in bulk in Sanity
2. **Image Quality**: Use consistent lighting for all photos
3. **SEO**: Write keyword-rich descriptions
4. **Stock**: Update availability daily
5. **Featured**: Rotate featured products weekly
6. **Backup**: Export Sanity data regularly

---

## 🎉 You're All Set!

Your MANYARA e-commerce site is ready to go. Just add your products to Sanity and start selling!

**Happy selling! 🛍️**

---

*Last updated: January 12, 2026*
