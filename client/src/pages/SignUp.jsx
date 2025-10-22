import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/signup', { name, email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Sign up failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* subtle corner glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-yellow-400/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg z-10">
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-8 sm:p-10 text-white">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Join <span className="text-yellow-400">SPORTSY</span> 🎉</h1>
            <p className="mt-2 text-base text-gray-300">Create your account and get started</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-yellow-400 text-black h-14 text-lg font-bold shadow-lg hover:bg-yellow-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full inline-flex items-center justify-center rounded-xl border-2 border-white/30 text-white h-12 text-base font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-base text-gray-300">
            Already have an account?{' '}
            <Link to="/signin" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors underline-offset-2 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
