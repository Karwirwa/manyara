# 🚀 QUICK ACCESS - Sanity Diagnostic Tools

## 🎯 ONE-CLICK ACCESS

Simply paste these URLs in your browser or console:

### 🔧 Diagnostic Dashboard (ALL TOOLS IN ONE PLACE)
```
http://localhost:3000/?tools=true
```
**Browser Console:**
```javascript
window.location.href = '/?tools=true';
```

---

## 📋 Individual Tools

### 1️⃣ Sanity Diagnostic (START HERE) ⭐
**URL:** `http://localhost:3000/?diagnostic=true`

**Console:**
```javascript
window.location.href = '/?diagnostic=true';
```

**Tests:**
- Connection status
- Image dereferencing
- Colors & sizes validation
- Category references
- Descriptions
- GROQ queries

---

### 2️⃣ Product Data Test
**URL:** `http://localhost:3000/?test-products=true`

**Console:**
```javascript
window.location.href = '/?test-products=true';
```

**Shows:**
- Visual product grid
- Data completeness stats
- Image loading verification
- Click for detailed view

---

### 3️⃣ Flow Diagram
**URL:** `http://localhost:3000/?flow-diagram=true`

**Console:**
```javascript
window.location.href = '/?flow-diagram=true';
```

**Includes:**
- Architecture overview
- Troubleshooting guides
- Schema documentation
- Data flow maps

---

### 4️⃣ Edge Function Tester
**URL:** `http://localhost:3000/?test-edge=true`

**Console:**
```javascript
window.location.href = '/?test-edge=true';
```

**Tests:**
- Supabase connection
- Backend API health
- Edge function responses

---

## 🎬 Quick Start

**Step 1:** Open diagnostic dashboard
```
?tools=true
```

**Step 2:** Click "Sanity Diagnostic" (blue card marked "START HERE")

**Step 3:** Review all test results

**Step 4:** Fix any issues in Sanity Studio

**Step 5:** Re-run diagnostic to verify fixes

---

## 💾 Save These Bookmarks

Create browser bookmarks for instant access:

| Name | URL |
|------|-----|
| 🔧 Tools Dashboard | `http://localhost:3000/?tools=true` |
| 🩺 Diagnostic | `http://localhost:3000/?diagnostic=true` |
| 📊 Product Test | `http://localhost:3000/?test-products=true` |
| 🌊 Flow Diagram | `http://localhost:3000/?flow-diagram=true` |
| 🏠 Home | `http://localhost:3000/` |
| 🎨 Sanity Studio | `https://ximq2iuj.sanity.studio/` |

---

## 🆘 Emergency Troubleshooting

### Products Not Showing?
```
1. Go to: ?diagnostic=true
2. Look for "Product Count" test
3. If failed: Create products in Sanity Studio
```

### Images Not Loading?
```
1. Go to: ?diagnostic=true
2. Look for "Main Image Field" test
3. If "not dereferenced": Check GROQ query
4. If "missing": Upload image in Sanity Studio
```

### Colors/Sizes Missing?
```
1. Go to: ?diagnostic=true
2. Look for "Colors Array" and "Sizes Array" tests
3. If failed: Edit product in Sanity Studio
4. Add array items (e.g., ["Black", "Red"])
```

---

## 📱 Mobile Quick Access

Add these as home screen shortcuts on mobile:

**iOS Safari:**
1. Open URL
2. Tap share button
3. "Add to Home Screen"

**Android Chrome:**
1. Open URL
2. Tap menu (⋮)
3. "Add to Home screen"

---

## 🎯 Recommended URLs to Bookmark

**MUST HAVE:**
- Tools Dashboard: `?tools=true`
- Sanity Diagnostic: `?diagnostic=true`
- Sanity Studio: `https://ximq2iuj.sanity.studio/`

**NICE TO HAVE:**
- Product Test: `?test-products=true`
- Flow Diagram: `?flow-diagram=true`

---

## ⌨️ Keyboard Shortcuts (Console)

Save these as snippets in DevTools:

```javascript
// Quick nav functions
function goTools() { window.location.href = '/?tools=true'; }
function goDiag() { window.location.href = '/?diagnostic=true'; }
function goTest() { window.location.href = '/?test-products=true'; }
function goFlow() { window.location.href = '/?flow-diagram=true'; }
function goHome() { window.location.href = '/'; }
function goStudio() { window.open('https://ximq2iuj.sanity.studio/', '_blank'); }
```

Then just type: `goTools()` or `goDiag()` in console!

---

## 🔗 External Links

**Sanity Studio:**
https://ximq2iuj.sanity.studio/

**Project Settings:**
- Project ID: `ximq2iuj`
- Dataset: `production`
- API Version: `2023-05-03`

---

**Last Updated:** February 6, 2026  
**Status:** All tools operational ✅
