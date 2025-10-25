# 🗺️ Google Maps API - Complete Setup Guide

## 🚨 Current Issue:
```
Error: You must enable Billing on the Google Cloud Project
```

Even after enabling billing, API key still not working. This means:
- ❌ API key might be from different project
- ❌ Places API not enabled on the project with billing

---

## ✅ COMPLETE FIX - Step by Step:

### Step 1: Go to Google Cloud Console
```
https://console.cloud.google.com/
```

### Step 2: Create NEW Project (or Select Existing)
1. Click dropdown at top (next to "Google Cloud")
2. Click "NEW PROJECT"
3. Name: `Sportsy-Development`
4. Click "CREATE"
5. **Wait 30 seconds for project to be created**

### Step 3: Enable Billing on THIS Project
1. Go to: https://console.cloud.google.com/billing
2. Click "Link a Billing Account"
3. Select your billing account
4. Click "SET ACCOUNT"

### Step 4: Enable Required APIs
1. Go to: https://console.cloud.google.com/apis/library
2. Search and enable these APIs:
   
   **a) Places API** (MOST IMPORTANT)
   - Search: "Places API"
   - Click it
   - Click "ENABLE"
   
   **b) Maps JavaScript API** (for future use)
   - Search: "Maps JavaScript API"
   - Click "ENABLE"
   
   **c) Geocoding API** (optional but useful)
   - Search: "Geocoding API"
   - Click "ENABLE"

### Step 5: Create NEW API Key
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "CREATE CREDENTIALS" → "API Key"
3. **Copy the new API key** (starts with AIza...)
4. Click "RESTRICT KEY" (recommended)

### Step 6: Restrict API Key (Security)
1. Under "API restrictions":
   - Select "Restrict key"
   - Check these APIs:
     ✅ Places API
     ✅ Maps JavaScript API
     ✅ Geocoding API
2. Click "SAVE"

### Step 7: Update Your Project
Replace API key in both files:

**File 1: `server/.env`**
```env
GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
USE_MOCK_TURFS=false
```

**File 2: `client/.env`**
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
```

### Step 8: Restart Everything
```bash
# Stop all Node processes
Get-Process -Name node | Stop-Process -Force

# Start server
cd server
node src/index.js

# In new terminal, start client
cd client
npm run dev
```

### Step 9: Test API
```bash
# Update API key in test file first
# Then run:
node test-places-textsearch.js
```

---

## 🧪 Quick Test (After Setup):

Open browser console on `http://localhost:5174` and run:
```javascript
const testAPI = async () => {
  const apiKey = 'YOUR_NEW_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=turf+in+bangalore&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
};
testAPI();
```

---

## ⚡ Quick Alternative (If Above Doesn't Work):

Use **Nearby Search instead of Text Search** (uses less quota):

**Backend Route:** Already exists at `/api/turfs/search`
**Usage:**
```javascript
// Frontend: Get user's location first, then search
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  const response = await fetch(
    `http://localhost:5000/api/turfs/search?lat=${latitude}&lng=${longitude}&radius=5000`
  );
  const data = await response.json();
  console.log(data.results); // Real turfs!
});
```

---

## 🎯 Expected Output (When Working):

```javascript
✅ Kolkata → Found 15 turfs
   📍 First turf: Salt Lake Stadium Sports Complex
   🗺️  Location: Salt Lake, Kolkata, West Bengal
   📊 Coordinates: 22.5726, 88.3639

✅ Mumbai → Found 23 turfs
   📍 First turf: Andheri Sports Arena
   🗺️  Location: Andheri West, Mumbai, Maharashtra
   📊 Coordinates: 19.1136, 72.8697
```

---

## 🆘 Still Not Working?

**Check This:**
1. Wait 2-5 minutes after enabling APIs (propagation time)
2. Make sure billing account is ACTIVE (not just created)
3. Check API quotas: https://console.cloud.google.com/apis/dashboard
4. Verify API key is from the SAME project where you enabled billing

**OR Use Mock Mode Temporarily:**
```env
# server/.env
USE_MOCK_TURFS=true
```

This will give you working turfs data while you fix Google API!

---

## 📞 Need Help?

Share screenshot of:
1. Google Cloud Console → APIs & Services → Enabled APIs
2. Google Cloud Console → Billing → Linked Projects
3. Error message you're getting

I'll help debug!
