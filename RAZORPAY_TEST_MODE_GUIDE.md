# 🧪 Razorpay Test Mode - Complete Guide

## ❗ Important: OTP Verification in Test Mode

### The Issue You're Experiencing

When you enter OTP `123456` in Razorpay Test Mode and get "Verification failed because of incorrect OTP", this is **expected behavior**.

### ✅ How Razorpay Test Mode Actually Works

In Razorpay's Test Mode, **you don't need to enter an actual OTP**. Instead:

1. **Enter test card details:**
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
   - Name: Any name

2. **When OTP screen appears:**
   - You'll see two buttons: **"Success"** and **"Failure"**
   - **Click "Success"** to simulate successful payment
   - **Click "Failure"** to simulate failed payment
   - **DO NOT** enter actual OTP digits like `123456`

### 🎯 Why This Happens

- Razorpay Test Mode **does not send real OTPs**
- The OTP input field is just a placeholder
- Test mode expects you to use the Success/Failure buttons
- Entering any OTP digits will fail because no real OTP was generated

---

## 📝 Step-by-Step Payment Flow

### For Successful Payment:

```
1. Click "Proceed to Payment" on booking page
   ↓
2. Razorpay popup opens
   ↓
3. Select "Card" payment method
   ↓
4. Enter test card details:
   - Card Number: 4111 1111 1111 1111
   - Expiry: 12/25 (any future date)
   - CVV: 123 (any 3 digits)
   - Name: Test User
   ↓
5. Click "Pay Now" button
   ↓
6. OTP screen appears with "Success" and "Failure" buttons
   ↓
7. ✅ Click "Success" button (NOT enter OTP digits!)
   ↓
8. Payment successful! ✅
```

### For Failed Payment (Testing Error Handling):

```
Follow steps 1-6 above
   ↓
7. ❌ Click "Failure" button
   ↓
8. Payment fails with error message
```

---

## 🔧 Technical Implementation

### Frontend (BookingPage.jsx)

The frontend now includes:
- **Console logs** at each step (check browser DevTools)
- **Enhanced error handling** with detailed error messages
- **Retry configuration** (max 3 attempts)
- **Updated test card instructions** showing Success/Failure buttons

### Backend (payments.js)

The backend now includes:
- **Detailed logging** of order creation
- **Amount validation** (INR → Paise conversion)
- **Credential verification** (checks if test/live mode)
- **Error details** in console and API response

---

## 🧪 Testing Checklist

### ✅ Before Testing:

1. Ensure server is running: `npm run dev` (from root)
2. Open browser DevTools → Console tab
3. Open Network tab to see API requests

### ✅ During Payment:

1. Watch console logs:
   - `🔄 Creating Razorpay order...`
   - `✅ Order created:`
   - `🚀 Opening Razorpay checkout...`

2. In Razorpay popup:
   - Don't try to enter OTP digits
   - Look for Success/Failure buttons
   - Click appropriate button

3. After payment:
   - Success: `✅ Payment Success:` in console
   - Failure: `❌ Payment Failed:` in console

---

## 🐛 Debugging Common Issues

### Issue 1: "Invalid API Key"
**Cause:** Wrong/missing Razorpay credentials  
**Fix:** Check `server/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_RWbJKxpj1Nwsju
RAZORPAY_KEY_SECRET=fySnFdddp4bgAPO9FbA7xHKe
```

### Issue 2: "Order creation failed"
**Cause:** Backend not running or wrong endpoint  
**Fix:** 
- Check server console for errors
- Verify API endpoint: `POST /api/payments/razorpay/create-order`

### Issue 3: "OTP verification failed"
**Cause:** Trying to enter OTP digits instead of clicking Success/Failure  
**Fix:** Don't enter OTP! Click the Success or Failure button.

### Issue 4: Razorpay popup doesn't open
**Cause:** Razorpay SDK not loaded  
**Fix:** Check `client/index.html` has:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 🔐 Security Notes

### ✅ What's Secure:

- `key_secret` is **NEVER** exposed to frontend
- Order creation happens on backend
- Payment verification should happen on backend (TODO)

### ⚠️ Production Checklist:

1. Replace test keys with live keys
2. Add payment signature verification endpoint
3. Store payment records in database
4. Send confirmation emails
5. Handle webhooks for payment status updates

---

## 📱 Live Mode Differences

When you switch to **Live Mode** (production):

1. **Real OTPs will be sent** to customer's mobile
2. **No Success/Failure buttons** - customer enters real OTP
3. **Real money** will be charged
4. **Webhook events** will be sent to your server

### Switching to Live Mode:

```env
# In server/.env, replace test keys with live keys:
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_here
```

---

## 📚 Official Documentation

- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Razorpay Checkout Integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Payment Verification](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/verify-payment/)

---

## 💡 Summary

**The key point:** In Razorpay Test Mode, when the OTP screen appears, **click the "Success" button** instead of entering OTP digits. This is how Razorpay simulates successful payments in test mode.

The current implementation is working correctly - it's just the testing process that's different from production!
