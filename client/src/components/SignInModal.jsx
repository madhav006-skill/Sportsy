import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signin", { email, password });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem("auth_token", res.data.token);
        onClose?.();
        navigate("/dashboard");
      } else {
        setError(res.data?.message || "Sign in failed. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Unable to sign in right now.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog" aria-labelledby="signin-title">
      <div className="w-full max-w-sm md:max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 id="signin-title" className="text-lg md:text-xl font-semibold">Sign in</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          {error ? (
            <div className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">{error}</div>
          ) : null}
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Email</label>
            <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Password</label>
            <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center rounded-lg bg-yellow-400 text-black px-4 py-2 font-semibold shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <button type="button" onClick={onClose} className="w-full inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-800 px-4 py-2 font-medium hover:bg-slate-200 transition">Cancel</button>
        </form>
      </div>
    </div>
  );
}
