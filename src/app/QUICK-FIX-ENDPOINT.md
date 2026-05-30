# ⚡ Quick Fix - Use Correct Endpoint

## ❌ Your Code (Wrong)
```javascript
fetch("https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/products", {
  //                                                                                    ^^^^^^^^
  //                                                                                    WRONG!
  headers: {
    Authorization: `Bearer ${TOKEN}`  // Also needs quotes around token
  }
})
```

## ✅ Correct Code
```javascript
fetch("https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products", {
  //                                                                                    ^^^^^^^^^^^^^^
  //                                                                                    CORRECT!
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ"
  }
})
  .then(res => res.json())
  .then(data => console.log('Products:', data))
```

## 🔍 The Difference

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `/products` ❌ | Deprecated | Error message |
| `/sanity-products` ✅ | Active | Products from Sanity |

## 🧪 Copy-Paste Test (Browser Console)

```javascript
fetch("https://trtqbruuzdvlmzrzwrot.supabase.co/functions/v1/make-server-5cb00c7d/sanity-products", {
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydHFicnV1emR2bG16cnp3cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTEwMTQsImV4cCI6MjA3NDkyNzAxNH0.b9Acm1wfXbbcDOfqa6ygoQznj_QGJV9bB9bve5kPYYQ"
  }
})
  .then(res => res.json())
  .then(data => console.log('✅ Products:', data))
  .catch(err => console.error('❌ Error:', err));
```

## ✅ Expected Result

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Lace Bralette",
      "price": "KSh 1,200",
      "category": "Bras",
      "imageUrl": "https://...",
      "sizes": ["S", "M", "L"],
      "colors": ["Black", "Nude"]
    }
  ],
  "count": 23,
  "source": "sanity"
}
```

## 📝 Note

Your frontend code already uses the correct endpoint! This test is just to verify the Edge Function works.

---

**See Also:** `/TEST-EDGE-FUNCTION.md` for comprehensive testing guide
