import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken, logout } from '../lib/auth';
import { api } from '../lib/api';
import BookButton from '../components/BookButton';
import ActiveMatches from '../components/ActiveMatches';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [turfs, setTurfs] = useState([]);
  const [loadingTurfs, setLoadingTurfs] = useState(false);
  const [showTurfsModal, setShowTurfsModal] = useState(false);
  const [locationError, setLocationError] = useState('');
  const dropdownRef = useRef(null);

  // Mock active matches data - in production, fetch from API
  const [activeMatches] = useState([
    {
      id: 'MATCH-1729789234567',
      sportType: 'football',
      date: '2025-10-25',
      time: '18:00',
      turf: 'Arena Sports Complex, Koramangala',
      maxPlayers: 12,
      joinedPlayers: 8,
      matchType: 'open',
      costPerPlayer: 150,
      status: 'active'
    },
    {
      id: 'MATCH-1729789234568',
      sportType: 'cricket',
      date: '2025-10-26',
      time: '16:00',
      turf: 'Champions Ground, Indiranagar',
      maxPlayers: 22,
      joinedPlayers: 15,
      matchType: 'open',
      costPerPlayer: 0,
      status: 'active'
    },
    {
      id: 'MATCH-1729789234569',
      sportType: 'basketball',
      date: '2025-10-24',
      time: '20:00',
      turf: 'Hoops Arena, Whitefield',
      maxPlayers: 10,
      joinedPlayers: 6,
      matchType: 'invite-only',
      costPerPlayer: 200,
      status: 'active'
    }
  ]);

  const username = user?.name || 'Champion';
  const userId = user?.id || user?.userId || 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const userEmail = user?.email || '';

  // Load animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Quick action handlers (routes can be wired later as features are implemented)
  const goCreateMatch = () => {
    setShowDropdown(false);
    navigate('/organizer');
  };
  const goMyBookings = () => {
    setShowDropdown(false);
    navigate('/dashboard?action=view-bookings');
  };
  const goLeaderboard = () => {
    setShowDropdown(false);
    navigate('/dashboard?action=leaderboard');
  };
  const goPayments = () => {
    setShowDropdown(false);
    navigate('/payments');
  };

  const searchNearbyTurfs = async () => {
    if (!searchQuery.trim()) {
      setLocationError('Please enter a location to search (e.g., Kolkata, Mumbai, Bangalore)');
      return;
    }

    setLocationError('');
    setLoadingTurfs(true);
    setTurfs([]);

    try {
      console.log(`🔍 Searching for turfs in: "${searchQuery}"`);
      
      // Use backend API which will handle location search via Places API Text Search
      const { data } = await api.get('/api/turfs/search-by-location', {
        params: { 
          location: searchQuery,
          radius: 5000 
        }
      });

      if (data.success) {
        setTurfs(data.results || []);
        if (data.results && data.results.length > 0) {
          console.log(`✅ Found ${data.results.length} turfs in ${searchQuery}`);
          console.log(`📍 Coordinates: ${data.coordinates?.lat}, ${data.coordinates?.lng}`);
          setShowTurfsModal(true);
        } else {
          setLocationError(`No sports turfs found in "${searchQuery}". Try a different location or larger city.`);
        }
      } else {
        setLocationError(data.message || 'Failed to search turfs');
      }
    } catch (error) {
      console.error('❌ Error searching turfs:', error);
      setLocationError('Failed to search location. Please try again.');
    } finally {
      setLoadingTurfs(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchNearbyTurfs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#111a2f] to-[#0a0f1f]">
      {/* Dashboard Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl shadow-cyan-500/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-2xl">⚽</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SPORTSY</span>
              </h1>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className="px-5 py-2.5 text-cyan-400 font-bold text-sm rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 transition-all hover:shadow-cyan-500/20">
                📅 Bookings
              </Link>
              <Link to="/chat" className="px-5 py-2.5 text-slate-300 font-semibold text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all">
                💬 Chat
              </Link>
              <button className="px-5 py-2.5 text-slate-300 font-semibold text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all">
                👤 Profile
              </button>
            </nav>

            {/* Mobile Menu & Avatar */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/50 hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-white">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden animate-fadeIn z-50">
                    <div className="px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-0.5">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white">
                            {username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-lg">{username}</p>
                          {userEmail && (
                            <p className="text-slate-400 text-xs truncate">{userEmail}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span className="text-xs text-slate-300 font-mono">ID: {userId}</span>
                      </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                      <button onClick={goCreateMatch} className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border border-cyan-500/30 text-white hover:border-cyan-400/60 hover:bg-cyan-500/20 transition-all">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm font-semibold text-left">Match Organizer</span>
                      </button>
                      <button onClick={goMyBookings} className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-600/15 border border-blue-500/30 text-white hover:border-blue-400/60 hover:bg-blue-500/20 transition-all">
                        <span className="text-lg">🗂️</span>
                        <span className="text-sm font-semibold text-left">My Bookings</span>
                      </button>
                      <button onClick={goLeaderboard} className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-600/15 border border-purple-500/30 text-white hover:border-purple-400/60 hover:bg-purple-500/20 transition-all">
                        <span className="text-lg">🏆</span>
                        <span className="text-sm font-semibold text-left">Leaderboard</span>
                      </button>
                      <button onClick={goPayments} className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-600/15 border border-emerald-500/30 text-white hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all">
                        <span className="text-lg">💳</span>
                        <span className="text-sm font-semibold text-left">Payments</span>
                      </button>
                    </div>
                    <div className="px-2 pb-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold group"
                      >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-2 space-y-2 animate-fadeIn">
              <Link 
                to="/dashboard" 
                className="block px-4 py-3 text-cyan-400 font-bold text-sm rounded-xl bg-cyan-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                onClick={() => setShowMobileMenu(false)}
              >
                📅 Bookings
              </Link>
              <Link 
                to="/chat" 
                className="block px-4 py-3 text-slate-300 font-semibold text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"
                onClick={() => setShowMobileMenu(false)}
              >
                💬 Chat
              </Link>
              <button 
                className="w-full text-left px-4 py-3 text-slate-300 font-semibold text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"
                onClick={() => setShowMobileMenu(false)}
              >
                👤 Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Greeting Section */}
        <div className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Hi <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">{username}</span> 👋
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 font-medium">Ready to play?</p>
          </div>

          {/* Active Matches Section */}
          <ActiveMatches matches={activeMatches} />

          {/* Search Bar */}
          <div className="relative max-w-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any location or turf... (e.g., Kolkata, Jaipur, Chennai, Goa)"
                className="w-full px-6 py-4 pl-14 pr-32 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all font-medium"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                disabled={loadingTurfs}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingTurfs ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching
                  </span>
                ) : (
                  'Find Turfs'
                )}
              </button>
            </form>
            {locationError && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {locationError}
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Match Card */}
        <div className={`relative group transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl hover:border-cyan-400/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-full">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-cyan-400 font-bold text-xs sm:text-sm">UPCOMING</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Upcoming Match</h3>
                <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">Friday, October 25, 2025 • 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">Champions Arena Sports Complex</span>
                </div>
              </div>
              <button className="relative group/btn overflow-hidden px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-black text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap w-full md:w-auto">
                <span className="relative z-10">View Details</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards moved to avatar dropdown quick actions */}

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 text-center hover:border-cyan-400/40 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">12</div>
            </div>
            <div className="text-slate-400 font-semibold text-xs sm:text-sm">Total Bookings</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 sm:p-6 text-center hover:border-blue-400/40 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all group">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">8</div>
            </div>
            <div className="text-slate-400 font-semibold text-xs sm:text-sm">Matches Played</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 sm:p-6 text-center hover:border-purple-400/40 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all group">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">450</div>
            </div>
            <div className="text-slate-400 font-semibold text-xs sm:text-sm">Points Earned</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 sm:p-6 text-center hover:border-pink-400/40 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20 transition-all group">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">#15</div>
            </div>
            <div className="text-slate-400 font-semibold text-xs sm:text-sm">Rank Position</div>
          </div>
        </div>

      </main>

      {/* Turfs Modal */}
      {showTurfsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl shadow-cyan-500/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white">Nearby Turfs</h3>
                <p className="text-sm text-slate-400 mt-1">Found {turfs.length} turfs near you</p>
              </div>
              <button
                onClick={() => setShowTurfsModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              {turfs.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-400 text-lg">No turfs found nearby</p>
                  <p className="text-slate-500 text-sm mt-2">Try searching in a different area</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {turfs.map((turf) => (
                    <div
                      key={turf.place_id}
                      className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      <div className="flex gap-4">
                        {/* Turf Image/Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
                            ⚽
                          </div>
                        </div>

                        {/* Turf Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-white mb-1 truncate">{turf.name}</h4>
                          <p className="text-sm text-slate-400 mb-2 truncate">{turf.vicinity}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {turf.rating && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold">{turf.rating}</span>
                              </div>
                            )}
                            
                            {turf.opening_hours && (
                              <div className={`flex items-center gap-1 ${turf.opening_hours.open_now ? 'text-green-400' : 'text-red-400'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{turf.opening_hours.open_now ? 'Open Now' : 'Closed'}</span>
                              </div>
                            )}

                            {turf.price_level && (
                              <div className="text-slate-400">
                                {'₹'.repeat(turf.price_level)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex flex-col gap-2">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${turf.geometry.location.lat},${turf.geometry.location.lng}&query_place_id=${turf.place_id}`, '_blank')}
                            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-cyan-500/50 rounded-lg text-white text-sm font-semibold transition-all"
                          >
                            View Map
                          </button>
                          <BookButton turfId={turf.place_id} turfData={turf} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
