# 🚀 Quick Setup - Google Maps Integration

## Step-by-Step Setup (5 minutes)

### 1️⃣ Get Google Maps API Key

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Click "APIs & Services" → "Library"
4. Search and enable: **"Places API"**
5. Go to "Credentials" → "Create Credentials" → "API Key"
6. Copy the API key

### 2️⃣ Configure Backend

Edit `server/.env`:
```env
GOOGLE_MAPS_API_KEY=AIzaSyC...your_key_here
```

### 3️⃣ Restart Server

```bash
cd server
npm run dev
```

### 4️⃣ Test the Feature

1. Open: http://localhost:5173/dashboard
2. Click **"Find Turfs"** button in search bar
3. Allow location access when prompted
4. View nearby turfs in modal! 🎉

---

## 🎯 Expected Behavior

### Search Button States

**Before Click:**
```
[Find Turfs]
```

**Loading:**
```
[⏳ Searching...]
```

**Success:**
```
Modal opens with turfs list
```

### Location Permission

**First Time:**
```
┌──────────────────────────────────┐
│ Allow "Sportsy" to access your   │
│ location?                         │
│                                   │
│  [Block]  [Allow]                │
└──────────────────────────────────┘
```

**User Allows:** ✅ Turfs displayed  
**User Blocks:** ❌ Error message shown

---

## 🗺️ Example Results

```
┌─────────────────────────────────────────┐
│ Nearby Turfs                            │
│ Found 5 turfs near you                  │
├─────────────────────────────────────────┤
│                                         │
│ ⚽ Champions Arena Sports Complex       │
│ 📍 123 Main Street, Mumbai              │
│ ⭐ 4.5  🕒 Open Now  ₹₹                │
│ [View Map] [Book Now]                   │
│                                         │
│ ⚽ Victory Turf Ground                  │
│ 📍 456 Park Avenue, Mumbai              │
│ ⭐ 4.2  🕒 Closed  ₹₹₹                 │
│ [View Map] [Book Now]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚠️ Common Issues

### Issue 1: "Maps API not configured"
**Fix:**
```bash
# 1. Check .env file has API key
cat server/.env | grep GOOGLE_MAPS_API_KEY

# 2. Restart server
cd server
npm run dev
```

### Issue 2: "Unable to get your location"
**Fix:**
- Click lock icon 🔒 in address bar
- Set Location permission to "Allow"
- Refresh page and try again

### Issue 3: No turfs found
**Reasons:**
- No turfs in your area (normal)
- Try searching from a different location
- Change search keyword in backend

---

## 🔧 Quick Tests

### Test 1: Verify API Key
```bash
curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.0760,72.8777&radius=5000&keyword=turf&key=YOUR_API_KEY"
```

Should return JSON with turfs or ZERO_RESULTS.

### Test 2: Check Backend Route
```bash
curl "http://localhost:5000/api/turfs/search?lat=19.0760&lng=72.8777"
```

Should return success response with turfs array.

### Test 3: Browser Console
```javascript
// Check geolocation support
navigator.geolocation.getCurrentPosition(
  pos => console.log('Location:', pos.coords),
  err => console.error('Error:', err)
);
```

---

## 📊 API Key Security

### ✅ DO:
- Store in `.env` file on backend
- Add `.env` to `.gitignore`
- Restrict key to specific domains
- Set up billing alerts

### ❌ DON'T:
- Commit API key to Git
- Expose key in frontend code
- Share key publicly
- Use same key for dev/prod

---

## 🎨 Customization

### Change Search Distance
```javascript
// Dashboard.jsx, line ~85
const radius = 10000; // 10km instead of 5km
```

### Change Search Term
```javascript
// server/src/routes/turfs.js, line 23
keyword=football+ground  // Instead of "turf"
```

### Change Result Count
Google returns max 20 results by default.
Use pagination for more results.

---

## 📱 Mobile Testing

1. Deploy to hosting service (Vercel, Netlify)
2. Open on mobile browser
3. Allow location when prompted
4. See turfs based on phone's GPS

**Note:** Geolocation works on:
- ✅ HTTPS (production)
- ✅ localhost (development)
- ❌ HTTP (production - blocked by browsers)

---

## 💰 Cost Estimate

**Free Tier:**
- $200/month credit
- ~6,250 searches/month free
- Enough for most small apps

**After Free Tier:**
- $32 per 1,000 searches
- Monitor usage in Google Cloud Console

---

## ✅ Verification Checklist

Test these before launch:

- [ ] API key configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] "Find Turfs" button visible
- [ ] Loading state works
- [ ] Location permission prompt appears
- [ ] Turfs modal opens with results
- [ ] Photos load correctly
- [ ] "View Map" opens Google Maps
- [ ] Works on mobile
- [ ] Error handling works
- [ ] No API key exposed in frontend

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
cd server
npm run dev
# Look for: "✅ MongoDB Connected"
# Look for: "Server listening on..."

# Check API call
# Browser DevTools → Network → Filter: turfs
```

### Debug Mode
```javascript
// Dashboard.jsx - Add console logs
console.log('Searching turfs at:', latitude, longitude);
console.log('API response:', data);
console.log('Turfs found:', turfs.length);
```

---

**Setup Time**: 5 minutes  
**Difficulty**: ⭐⭐ Easy  
**Status**: ✅ Ready to use!
