# 🗺️ Google Maps Places API Integration Guide

## Overview
Integrated Google Maps Places API to search for nearby turfs based on user's location using the Geolocation API.

---

## 🎯 Features Implemented

### 1. **Backend API Routes** (`server/src/routes/turfs.js`)

#### Search Nearby Turfs
```
GET /api/turfs/search?lat=<latitude>&lng=<longitude>&radius=<meters>
```

**Parameters:**
- `lat` (required): User's latitude
- `lng` (required): User's longitude
- `radius` (optional): Search radius in meters (default: 5000m = 5km)

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "place_id": "ChIJ...",
      "name": "Champions Arena Sports Complex",
      "vicinity": "123 Main Street, City",
      "geometry": {
        "location": {
          "lat": 12.9716,
          "lng": 77.5946
        }
      },
      "rating": 4.5,
      "opening_hours": {
        "open_now": true
      },
      "photos": [...],
      "price_level": 2
    }
  ],
  "status": "OK"
}
```

#### Get Turf Details
```
GET /api/turfs/details/:placeId
```

**Response:**
```json
{
  "success": true,
  "result": {
    "name": "Champions Arena",
    "formatted_address": "Full address",
    "formatted_phone_number": "+1234567890",
    "opening_hours": {...},
    "rating": 4.5,
    "reviews": [...],
    "photos": [...],
    "website": "https://..."
  }
}
```

---

### 2. **Frontend Implementation** (Dashboard.jsx)

#### Search Flow
1. **User clicks "Find Turfs" button**
2. **Geolocation API** requests user's location
3. **Location permission** granted by user
4. **Backend API call** with coordinates
5. **Google Places API** searches for turfs within 5km
6. **Results displayed** in modal

#### State Management
```javascript
const [turfs, setTurfs] = useState([]);
const [loadingTurfs, setLoadingTurfs] = useState(false);
const [showTurfsModal, setShowTurfsModal] = useState(false);
const [locationError, setLocationError] = useState('');
```

#### Search Function
```javascript
const searchNearbyTurfs = async () => {
  // Request geolocation
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `http://localhost:5000/api/turfs/search?lat=${latitude}&lng=${longitude}`
      );
      const data = await response.json();
      setTurfs(data.results);
      setShowTurfsModal(true);
    },
    (error) => {
      setLocationError('Unable to get your location');
    }
  );
};
```

---

## 🎨 UI Components

### Search Bar (Enhanced)
- Input field for turf search
- **"Find Turfs" button** with loading state
- Geolocation icon (📍)
- Error messages for location issues
- Responsive design

### Turfs Results Modal
**Features:**
- Glassmorphism design with backdrop blur
- Scrollable list of turfs
- Each turf card shows:
  - ⚽ Photo or icon
  - 📍 Name and address
  - ⭐ Rating (if available)
  - 🕒 Open/Closed status
  - 💰 Price level (₹₹₹)
  - **"View Map"** button → Opens Google Maps
  - **"Book Now"** button → Future booking flow

**Design:**
- Dark theme with cyan/blue accents
- Hover effects with glow
- Smooth animations
- Mobile responsive

---

## 🔐 Security & Configuration

### Environment Variables

#### Backend (.env)
```env
# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**⚠️ IMPORTANT:**
- API key is stored on backend only
- Never exposed to frontend
- Frontend calls backend API, not Google directly

### Get Your API Key

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/

2. **Enable APIs**
   - Places API
   - Maps JavaScript API (if using maps)
   - Geolocation API

3. **Create API Key**
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy the key

4. **Restrict API Key (Recommended)**
   - Application restrictions: HTTP referrers
   - API restrictions: Limit to Places API
   - Add your domains: `localhost:5000`, `yourdomain.com`

5. **Add to .env file**
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyC...your_key_here
   ```

---

## 📱 User Experience Flow

```
┌────────────────────────────────────────┐
│  Dashboard - Search Bar                │
│  [🔍 Search Turf...] [Find Turfs]     │
└──────────────────┬─────────────────────┘
                   │ User clicks "Find Turfs"
                   ▼
┌────────────────────────────────────────┐
│  Browser Geolocation Permission        │
│  "Allow Sportsy to access location?"   │
│     [Block]  [Allow]                   │
└──────────────────┬─────────────────────┘
                   │ User allows
                   ▼
┌────────────────────────────────────────┐
│  Getting Location...                   │
│  Latitude: 12.9716                     │
│  Longitude: 77.5946                    │
└──────────────────┬─────────────────────┘
                   │ Send to backend
                   ▼
┌────────────────────────────────────────┐
│  Backend: /api/turfs/search            │
│  → Google Places API                   │
│  → Search within 5km radius            │
│  → Keyword: "turf"                     │
└──────────────────┬─────────────────────┘
                   │ Results returned
                   ▼
┌────────────────────────────────────────┐
│  Modal: "Nearby Turfs"                 │
│  ┌──────────────────────────────────┐ │
│  │ ⚽ Champions Arena  ⭐ 4.5       │ │
│  │ 📍 123 Main St     🕒 Open      │ │
│  │ [View Map] [Book Now]            │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ ⚽ Victory Sports   ⭐ 4.2       │ │
│  │ 📍 456 Park Ave    🕒 Closed    │ │
│  │ [View Map] [Book Now]            │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 🎯 API Response Fields

### Turf Object Structure
```javascript
{
  place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
  name: "Champions Arena Sports Complex",
  vicinity: "123 Main Street, Mumbai",
  
  geometry: {
    location: {
      lat: 19.0760,
      lng: 72.8777
    }
  },
  
  rating: 4.5,                    // 0-5 scale
  user_ratings_total: 150,
  
  opening_hours: {
    open_now: true,              // Boolean
    weekday_text: [...]          // Opening hours text
  },
  
  price_level: 2,                // 0-4 (₹-₹₹₹₹)
  
  photos: [
    {
      photo_reference: "CmRaAAAA...",
      height: 1024,
      width: 768
    }
  ],
  
  types: ["stadium", "point_of_interest"],
  business_status: "OPERATIONAL"
}
```

---

## 🚀 Testing the Integration

### Step 1: Set Up API Key
```bash
# Edit server/.env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 2: Restart Backend
```bash
cd server
npm run dev
```

### Step 3: Test Search Flow
1. Go to `/dashboard`
2. Click **"Find Turfs"** button
3. Allow location access
4. View results in modal
5. Click **"View Map"** to open in Google Maps
6. Click **"Book Now"** (placeholder for future feature)

### Step 4: Test Different Scenarios

#### Scenario 1: Normal Search
- Allow location
- See list of nearby turfs
- ✅ Expected: Modal with turfs

#### Scenario 2: Location Blocked
- Block location permission
- ❌ Expected: Error message shown

#### Scenario 3: No Turfs Found
- Search in remote area
- 📭 Expected: "No turfs found nearby"

#### Scenario 4: API Key Missing
- Remove API key from .env
- ⚠️ Expected: "Maps API not configured"

---

## 🔧 Troubleshooting

### Problem: "Unable to get your location"
**Causes:**
- User blocked location permission
- HTTPS required (geolocation works on localhost)
- Browser doesn't support geolocation

**Solutions:**
1. Check browser permissions: chrome://settings/content/location
2. Ensure using HTTPS in production
3. Test in modern browser (Chrome, Firefox, Safari)

### Problem: "Maps API not configured"
**Causes:**
- API key not set in .env
- .env file not loaded
- Backend not restarted after .env change

**Solutions:**
1. Add `GOOGLE_MAPS_API_KEY` to `server/.env`
2. Restart backend: `npm run dev`
3. Check console logs for API key

### Problem: "ZERO_RESULTS" from Google
**Causes:**
- No turfs in the area
- Wrong keyword
- API quota exceeded

**Solutions:**
1. Try searching in different location
2. Change keyword in backend: `keyword=turf`
3. Check API quota in Google Cloud Console

### Problem: Photos not loading
**Causes:**
- Photo reference expired
- API key restrictions
- Missing photo permissions

**Solutions:**
1. Enable Places API with photo permissions
2. Check API key restrictions
3. Use fallback icon (⚽) when no photo

---

## 📊 API Usage & Costs

### Google Places API Pricing

| Request Type | Cost per Request |
|-------------|------------------|
| Nearby Search | $32 per 1000 requests |
| Place Details | $17 per 1000 requests |
| Photos | $7 per 1000 requests |

### Monthly Free Tier
- $200 free credit = ~6,250 searches/month
- Resets monthly
- Billing required after credit exhausted

### Optimization Tips
1. **Cache results** - Store turfs in database
2. **Limit searches** - Don't search on every keystroke
3. **Use bounds** - Restrict search area
4. **Batch requests** - Combine multiple queries

---

## 🎨 Customization Options

### Change Search Radius
```javascript
// Dashboard.jsx - searchNearbyTurfs function
const radius = 10000; // 10km instead of 5km
const response = await fetch(
  `http://localhost:5000/api/turfs/search?lat=${latitude}&lng=${longitude}&radius=${radius}`
);
```

### Change Search Keyword
```javascript
// server/src/routes/turfs.js
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=football+ground&key=${apiKey}`;
// Now searches for "football ground" instead of "turf"
```

### Filter by Type
```javascript
// Add &type=stadium to search only stadiums
const url = `...&keyword=turf&type=stadium&key=${apiKey}`;
```

### Show More Results
```javascript
// Google API returns max 20 results per page
// Use nextPageToken for pagination
if (data.next_page_token) {
  // Fetch next page after 2-second delay
}
```

---

## 🔜 Future Enhancements

### Phase 1: Basic Features
- [x] Search nearby turfs
- [x] Display results in modal
- [x] Show turf photos
- [x] View on Google Maps
- [ ] Filter by rating
- [ ] Filter by price
- [ ] Sort by distance

### Phase 2: Advanced Features
- [ ] Show turfs on map with markers
- [ ] Click marker to see turf details
- [ ] Get directions to turf
- [ ] Save favorite turfs
- [ ] Share turf location

### Phase 3: Booking Integration
- [ ] Check turf availability
- [ ] Book time slots
- [ ] Payment integration
- [ ] Booking confirmation
- [ ] Booking history

---

## 📁 File Structure

```
server/
├── .env                        # API key configuration
├── src/
│   ├── index.js                # Register turfs router
│   └── routes/
│       └── turfs.js            # NEW - Turfs API routes

client/
├── src/
│   └── pages/
│       └── Dashboard.jsx       # UPDATED - Search & modal
```

---

## 🔍 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/turfs/search` | GET | Search nearby turfs |
| `/api/turfs/details/:placeId` | GET | Get turf details |

---

## ✅ Checklist

Before going live:

- [ ] Get Google Maps API key
- [ ] Enable Places API
- [ ] Add API key to `.env`
- [ ] Restrict API key to your domains
- [ ] Set up billing in Google Cloud
- [ ] Test location permission flow
- [ ] Test with blocked location
- [ ] Test with no results
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Add error handling
- [ ] Add loading states
- [ ] Cache results (optional)
- [ ] Monitor API usage
- [ ] Set up usage alerts

---

**Integration Status**: ✅ Complete  
**API Provider**: Google Maps Platform  
**Security**: ✅ API key on backend only  
**Mobile Ready**: ✅ Responsive design  
**Date**: October 18, 2025
