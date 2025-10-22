# 🔧 Google Maps API Fix Guide

## ❌ Problem Detected

Your Google Maps API key has **HTTP referrer restrictions** enabled, which prevents it from working with server-side requests.

### Error Message:
```
API Status: REQUEST_DENIED
Error: API keys with referer restrictions cannot be used with this API.
```

## ✅ Solution

You need to change the API key restrictions in Google Cloud Console.

### Option 1: Remove Restrictions (Recommended for Development)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your API key: `AIzaSyAz8ZYuo1Hh0U1Y898HKyNzf6lREbkk-ww`
3. Click on the key name to edit
4. Under **"Application restrictions"**, select:
   - ✅ **None** (for development/testing)
5. Click **Save**

### Option 2: Use IP Restrictions (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your API key
3. Click on the key name to edit
4. Under **"Application restrictions"**, select:
   - ✅ **IP addresses (web servers, cron jobs, etc.)**
5. Add your server IP addresses:
   - For local development: `127.0.0.1` or `0.0.0.0/0` (allows all IPs)
   - For production: Add your actual server IP
6. Click **Save**

### Option 3: Create a Separate API Key for Backend

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Edit the new key:
   - Name it: `Sportsy Backend API Key`
   - Application restrictions: **None** or **IP addresses**
   - API restrictions: Enable only **Places API**
4. Copy the new key
5. Replace `GOOGLE_MAPS_API_KEY` in `.env` file

## 🔍 Testing After Fix

Once you've updated the restrictions, test again with:

```bash
cd e:\Sportsy\server
node test-maps-api.js
```

You should see:
```
✅ Success! Found X turfs
First result: "..."
```

## 🎯 Current API Key Status

- ✅ **API Key loaded successfully**
- ✅ **Format is correct**
- ❌ **Restrictions blocking server-side requests**

## 📝 Note

The API key is working, it just has the wrong restrictions for backend usage. This is a common issue when using the same key for both frontend and backend.

**Best Practice:** Use separate API keys for frontend (with HTTP referrer restrictions) and backend (with IP restrictions or no restrictions for dev).
