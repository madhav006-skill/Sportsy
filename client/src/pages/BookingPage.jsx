import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function BookingPage() {
  const { turfId } = useParams();
  const navigate = useNavigate();
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Dummy turf data (replace with API call later)
  const turfData = {
    id: turfId,
    name: 'Champions Arena Sports Complex',
    address: 'Sector 18, Noida, Uttar Pradesh 201301',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format&fit=crop',
    openTime: '6:00 AM',
    closeTime: '11:00 PM',
    facilities: ['Floodlights', 'Parking', 'Changing Rooms', 'First Aid']
  };

  // Dummy booking data
  const [bookingDetails] = useState({
    date: 'Friday, October 25, 2025',
    timeSlot: '6:00 PM - 7:00 PM',
    duration: '1 hour',
    basePrice: 1200,
    taxes: 216,
    total: 1416
  });

  const handleProceedToPayment = async () => {
    setPaymentLoading(true);

    try {
      // Step 1: Create order on backend (secure - key_secret stays on server)
      console.log('🔄 Creating Razorpay order...', { amount: bookingDetails.total });
      
      const response = await api.post('/api/payments/razorpay/create-order', {
        amount: bookingDetails.total // Amount in INR (e.g., 1416)
      });

      console.log('✅ Order created:', response.data);

      if (!response.data.success) {
        alert('Failed to create payment order. Please try again.');
        setPaymentLoading(false);
        return;
      }

      const { order_id, amount, currency, key_id } = response.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: key_id, // Razorpay test key ID from backend
        amount: amount, // Amount in paise from backend
        currency: currency,
        name: 'Sportsy Booking',
        description: 'Turf Booking Payment',
        order_id: order_id,
        theme: {
          color: '#0ea5e9' // Cyan-500 to match app theme
        },
        // Disable card saving to avoid OTP verification in test mode
        config: {
          display: {
            hide: [
              { method: 'paylater' },
              { method: 'emi' }
            ],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        // Don't save card details (this triggers the OTP issue)
        remember_customer: false,
        handler: function (response) {
          // Payment successful - verify signature on backend (recommended for production)
          console.log('✅ Payment Success:', response);
          
          // For now, show success alert
          alert(
            `Payment Successful! 🎉\n\n` +
            `Payment ID: ${response.razorpay_payment_id}\n` +
            `Order ID: ${response.razorpay_order_id}\n` +
            `Signature: ${response.razorpay_signature}`
          );
          
          // TODO: Send payment details to backend for verification and booking confirmation
          // api.post('/api/payments/razorpay/verify', {
          //   razorpay_order_id: response.razorpay_order_id,
          //   razorpay_payment_id: response.razorpay_payment_id,
          //   razorpay_signature: response.razorpay_signature
          // });
          
          // Navigate back to dashboard or show success page
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        },
        modal: {
          ondismiss: function() {
            console.log('⚠️ Payment popup closed by user');
            setPaymentLoading(false);
          },
          // Escape key handling
          escape: true,
          // Animation
          animation: true,
          // Confirm close on Esc
          confirm_close: true
        },
        prefill: {
          name: 'Test User',
          email: 'test@sportsy.com',
          contact: '9999999999' // Use this number for test mode
        },
        notes: {
          turf_id: turfId,
          booking_date: bookingDetails.date,
          time_slot: bookingDetails.timeSlot
        },
        // Enable retry on failure
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      // Check if Razorpay SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        console.error('❌ Razorpay SDK not loaded');
        alert('Payment gateway not loaded. Please refresh the page.');
        setPaymentLoading(false);
        return;
      }

      console.log('🚀 Opening Razorpay checkout with options:', {
        key: key_id,
        amount,
        currency,
        order_id
      });

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        console.error('❌ Payment Failed:', response.error);
        
        const errorMsg = response.error.description || response.error.reason || 'Payment failed';
        
        alert(
          `Payment Failed ❌\n\n` +
          `Error: ${errorMsg}\n` +
          `Code: ${response.error.code || 'N/A'}\n` +
          `Step: ${response.error.step || 'N/A'}`
        );
        
        setPaymentLoading(false);
      });

      razorpayInstance.open();
      setPaymentLoading(false);

    } catch (error) {
      console.error('❌ Payment initiation error:', error);
      alert(`Failed to initiate payment: ${error.message || 'Unknown error'}`);
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#111a2f] to-[#0a0f1f]">
      {/* Header with Back Button */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl shadow-cyan-500/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 font-semibold rounded-xl hover:bg-cyan-500/10 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-xl">⚽</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SPORTSY</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white mb-2">Complete Your Booking</h2>
          <p className="text-slate-400 text-lg">Review details and proceed to payment</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Left Column: Turf Details (3 columns width) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Turf Image Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-video relative">
                  <img 
                    src={turfData.image} 
                    alt={turfData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-full border border-yellow-400/30">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-yellow-400 font-bold text-lg">{turfData.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Turf Info Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-2xl font-black text-white mb-4">{turfData.name}</h3>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-1">Location</p>
                      <p className="text-white font-semibold">{turfData.address}</p>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-1">Operating Hours</p>
                      <p className="text-white font-semibold">{turfData.openTime} - {turfData.closeTime}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 font-medium mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {turfData.facilities.map((facility, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-semibold"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Summary (2 columns width) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-slate-800/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-500/30 px-6 py-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Booking Summary
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    
                    {/* Date & Time */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-400 text-sm font-medium">Date & Time</span>
                      </div>
                      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white font-semibold">{bookingDetails.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white font-semibold">{bookingDetails.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Turf Name */}
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-2">Turf</p>
                      <p className="text-white font-bold text-lg">{turfData.name}</p>
                    </div>

                    {/* Duration */}
                    <div>
                      <p className="text-slate-400 text-sm font-medium mb-2">Duration</p>
                      <p className="text-white font-semibold">{bookingDetails.duration}</p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-cyan-500/20 pt-4">
                      <p className="text-slate-400 text-sm font-medium mb-4">Price Breakdown</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Base Price</span>
                          <span className="text-white font-semibold">₹{bookingDetails.basePrice}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">Taxes & Fees (18%)</span>
                          <span className="text-white font-semibold">₹{bookingDetails.taxes}</span>
                        </div>
                        <div className="border-t border-cyan-500/20 pt-3 flex items-center justify-between">
                          <span className="text-white font-bold text-lg">Total Amount</span>
                          <span className="text-cyan-400 font-black text-2xl">₹{bookingDetails.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={handleProceedToPayment}
                      disabled={paymentLoading}
                      className="w-full relative group/btn overflow-hidden px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-bold text-white text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {paymentLoading ? (
                          <>
                            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Proceed to Payment
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>

                    {/* Security Notice */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure payment powered by Razorpay</span>
                    </div>

                    {/* Test Card Info (only show in development) */}
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg space-y-3">
                      <p className="text-yellow-400 text-xs font-semibold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Razorpay Test Mode - Use INDIAN Test Cards
                      </p>
                      
                      {/* Success Flow - Indian Cards */}
                      <div className="text-xs text-slate-300 space-y-2 bg-green-500/5 border border-green-500/20 rounded p-3">
                        <p className="text-green-400 font-semibold">✅ Indian Domestic Cards (Recommended):</p>
                        
                        <div className="space-y-1 border-b border-green-500/10 pb-2">
                          <p className="font-semibold text-white">Option 1: Mastercard (Debit)</p>
                          <p>Card: <span className="font-mono bg-slate-900/50 px-1 rounded">5267 3181 8797 5449</span></p>
                          <p>Expiry: <span className="font-mono">12/25</span> | CVV: <span className="font-mono">123</span></p>
                          <p className="text-green-300 italic">→ Works without international card error</p>
                        </div>

                        <div className="space-y-1 border-b border-green-500/10 pb-2">
                          <p className="font-semibold text-white">Option 2: Visa (Debit)</p>
                          <p>Card: <span className="font-mono bg-slate-900/50 px-1 rounded">4508 7502 6340 0067</span></p>
                          <p>Expiry: <span className="font-mono">12/25</span> | CVV: <span className="font-mono">123</span></p>
                          <p className="text-green-300 italic">→ Indian domestic card</p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold text-white">Option 3: RuPay (Debit)</p>
                          <p>Card: <span className="font-mono bg-slate-900/50 px-1 rounded">6074 8291 9945 2495</span></p>
                          <p>Expiry: <span className="font-mono">12/25</span> | CVV: <span className="font-mono">123</span></p>
                          <p className="text-green-300 italic">→ India-only card network</p>
                        </div>
                      </div>

                      {/* Important Note */}
                      <div className="text-xs text-slate-300 bg-red-500/5 border border-red-500/20 rounded p-3 space-y-1">
                        <p className="text-red-400 font-semibold">⚠️ AVOID International Cards:</p>
                        <p>• <strike>4111 1111 1111 1111</strike> ← This is international (Visa)</p>
                        <p>• Your account has international cards disabled</p>
                        <p>• Use Indian cards listed above instead</p>
                      </div>

                      {/* Steps */}
                      <div className="text-xs text-slate-300 bg-cyan-500/5 border border-cyan-500/20 rounded p-3 space-y-1">
                        <p className="text-cyan-400 font-semibold">📝 Steps:</p>
                        <p>1. Copy one of the Indian card numbers above</p>
                        <p>2. Enter expiry: <strong>12/25</strong>, CVV: <strong>123</strong></p>
                        <p>3. Click "Pay Now"</p>
                        <p>4. Click <strong>"Success"</strong> when test buttons appear</p>
                      </div>

                      <div className="text-xs text-slate-400 italic">
                        💡 <strong>Note:</strong> Test mode shows Success/Failure buttons instead of real OTP.
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
