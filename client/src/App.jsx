import React from 'react';
import { Link, Route, Routes, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import Payments from './pages/Payments.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookingPage from './pages/BookingPage.jsx';
import { getUserFromToken, isAuthenticated, logout as authLogout } from './lib/auth.js';

function Auth({ mode }) {
  return (
    <div className="max-w-sm mx-auto card space-y-4">
      <h1 className="text-2xl font-semibold">{mode === 'signin' ? 'Sign in' : 'Sign up'}</h1>
      <input className="input w-full" placeholder="Email" />
      <input type="password" className="input w-full" placeholder="Password" />
      <button className="btn btn-primary w-full">{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/50 hover:bg-blue-500' 
        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-md'
    }`;

  const hideHeaderPaths = ['/', '/signin', '/signup', '/dashboard'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  // Check if user is logged in
  const user = React.useMemo(() => getUserFromToken(), [location]);

  const authed = !!user;

  const handleChatClick = (e) => {
    if (!authed) {
      e.preventDefault();
      alert('Please log in first to access the chat');
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    authLogout();
    setShowDropdown(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm border-b border-white/10 shadow-xl">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight hover:text-yellow-400 transition-colors">
            <span className="text-2xl">🏃</span>
            <span>SPORTSY</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <NavLink to="/" className={navLinkClass} end>🏠 Home</NavLink>
              <NavLink to="/chat" className={navLinkClass} onClick={handleChatClick}>💬 Chat</NavLink>
              <NavLink to="/payments" className={navLinkClass}>💳 Payments</NavLink>
            </nav>
            <div className="h-6 w-px bg-white/20"></div>
            
            {user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-sm font-bold text-black shadow-lg group-hover:scale-110 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-white transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-slate-700 to-slate-800">
                      <p className="text-sm font-semibold text-yellow-400 mb-1">Signed in as</p>
                      <p className="text-white font-bold truncate">{user.name || 'User'}</p>
                      {user.email && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      )}
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 group"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white border border-white/20 hover:bg-black hover:text-black hover:border-white/40 transition-all duration-200"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>
      )}
      <main className={showHeader ? "container section flex-1" : "flex-1"}>
        {/* Auth route guard wrapper */}
        { /* Define inside render to access hooks if needed */ }
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={
            authed ? (
              <Chat />
            ) : (
              <Navigate to="/signin" replace state={{ from: '/chat' }} />
            )
          } />
          <Route path="/payments" element={<Payments />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book/:turfId" element={<BookingPage />} />
        </Routes>
      </main>
    </div>
  );
}
