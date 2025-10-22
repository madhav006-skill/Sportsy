import express from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

const router = express.Router();

// Stripe PaymentIntent
router.post('/stripe/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount required (in smallest currency unit)' });
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(400).json({ error: 'Stripe not configured' });
    const stripe = new Stripe(stripeKey);
    const intent = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
    res.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Razorpay Order - Create order securely on backend
// Expects amount in INR (rupees), converts to paise automatically
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR (e.g., 1416 for ₹1416)
    
    console.log('📝 Razorpay order request:', { amount, amountType: typeof amount });
    
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({ 
        success: false, 
        error: 'Valid amount required (in INR)' 
      });
    }

    // Get Razorpay credentials from environment (NEVER expose key_secret to frontend)
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_id || !key_secret) {
      console.error('❌ Razorpay credentials missing in .env');
      return res.status(500).json({ 
        success: false, 
        error: 'Razorpay not configured on server' 
      });
    }

    console.log('✅ Razorpay credentials loaded:', { 
      key_id: key_id.substring(0, 15) + '...',
      mode: key_id.includes('test') ? 'TEST' : 'LIVE'
    });

    // Initialize Razorpay instance
    const rzp = new Razorpay({ key_id, key_secret });

    // Convert amount from INR to paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    console.log('💰 Creating order:', {
      amountInINR: amount,
      amountInPaise: amountInPaise,
      currency: 'INR'
    });

    // Create Razorpay order
    const order = await rzp.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        booking_type: 'turf_booking',
        created_at: new Date().toISOString()
      }
    });

    console.log('✅ Order created successfully:', {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    });

    // Return order details to frontend (key_secret is never sent)
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount, // in paise
      currency: order.currency,
      key_id: key_id // Safe to send key_id to frontend
    });

  } catch (err) {
    console.error('❌ Razorpay order creation error:', {
      message: err.message,
      stack: err.stack,
      error: err.error || err
    });
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to create payment order' 
    });
  }
});

export default router;
