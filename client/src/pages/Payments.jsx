import { useState } from 'react';
import { api } from '../lib/api.js';

export default function Payments() {
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const createStripeIntent = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/payments/stripe/create-intent', { amount, currency: 'INR' });
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  const createRazorpayOrder = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/payments/razorpay/create-order', { amount, currency: 'INR' });
      setResult(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Payments</h1>
      <div className="card space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Amount (minor units)</label>
            <input type="number" className="input w-56" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </div>
          <div className="flex gap-2">
            <button onClick={createStripeIntent} className="btn bg-indigo-600 text-white hover:bg-indigo-700" disabled={loading}>Stripe Intent</button>
            <button onClick={createRazorpayOrder} className="btn bg-emerald-600 text-white hover:bg-emerald-700" disabled={loading}>Razorpay Order</button>
          </div>
          {loading && <span className="text-sm text-slate-500">Processing…</span>}
        </div>
        {result && (
          <div className="space-y-2">
            <div className="text-sm text-slate-600">Response</div>
            <pre className="bg-slate-950 text-slate-100 rounded-md p-3 overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
