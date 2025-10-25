import React, { useState, useEffect, useRef } from 'react';
import { turfAPI } from '../../lib/api';

const CreateMatchForm = ({ onCreateMatch }) => {
  const [formData, setFormData] = useState({
    sportType: '',
    date: '',
    time: '',
    turf: '',
    turfId: null,
    maxPlayers: 10,
    matchType: 'open', // 'open' or 'invite-only'
    costPerPlayer: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turfSearch, setTurfSearch] = useState('');
  const [turfSuggestions, setTurfSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateTurf, setShowCreateTurf] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionsRef = useRef(null);

  const sportTypes = [
    'Football',
    'Cricket',
    'Basketball',
    'Badminton',
    'Tennis',
    'Volleyball'
  ];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for turfs
  useEffect(() => {
    if (turfSearch.trim().length < 2) {
      setTurfSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await turfAPI.search(turfSearch, formData.sportType || null);
        if (response.success) {
          setTurfSuggestions(response.turfs || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Turf search error:', error);
        setTurfSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [turfSearch, formData.sportType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTurfInputChange = (e) => {
    const value = e.target.value;
    setTurfSearch(value);
    setFormData(prev => ({
      ...prev,
      turf: value,
      turfId: null
    }));
  };

  const handleSelectTurf = (turf) => {
    setTurfSearch(`${turf.name} - ${turf.location}`);
    setFormData(prev => ({
      ...prev,
      turf: `${turf.name} - ${turf.location}`,
      turfId: turf._id
    }));
    setShowSuggestions(false);
  };

  const handleCreateNewTurf = async (e) => {
    e.preventDefault();
    
    if (!turfSearch.trim() || !formData.sportType) {
      alert('Please enter turf name and select a sport type first');
      return;
    }

    try {
      const newTurfData = {
        name: turfSearch,
        location: turfSearch, // User can enter location in the search field
        sportType: formData.sportType
      };

      const response = await turfAPI.create(newTurfData);
      
      if (response.success) {
        // Select the newly created turf
        handleSelectTurf(response.turf);
        setShowCreateTurf(false);
        alert('Turf created successfully!');
      }
    } catch (error) {
      console.error('Create turf error:', error);
      alert('Failed to create turf. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      console.log('Creating match:', formData);
      onCreateMatch(formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        sportType: '',
        date: '',
        time: '',
        turf: '',
        turfId: null,
        maxPlayers: 10,
        matchType: 'open',
        costPerPlayer: 0
      });
      setTurfSearch('');
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-xl">
      {/* Section Title */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          Create New Match
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Sport Type */}
        <div>
          <label htmlFor="sportType" className="block text-sm font-semibold text-slate-300 mb-2">
            Sport Type *
          </label>
          <select
            id="sportType"
            name="sportType"
            value={formData.sportType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
          >
            <option value="">Select a sport</option>
            {sportTypes.map(sport => (
              <option key={sport} value={sport.toLowerCase()}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-slate-300 mb-2">
              Match Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-semibold text-slate-300 mb-2">
              Match Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Turf Selector */}
        <div className="relative" ref={suggestionsRef}>
          <label htmlFor="turf" className="block text-sm font-semibold text-slate-300 mb-2">
            Select Turf *
          </label>
          <div className="relative">
            <input
              type="text"
              id="turf"
              name="turf"
              value={turfSearch}
              onChange={handleTurfInputChange}
              onFocus={() => turfSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search for a turf or enter location"
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none pr-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && turfSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
              {turfSuggestions.map((turf) => (
                <button
                  key={turf._id}
                  type="button"
                  onClick={() => handleSelectTurf(turf)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{turf.name}</p>
                      <p className="text-sm text-slate-400">{turf.location}</p>
                      {turf.city && (
                        <p className="text-xs text-slate-500 mt-1">{turf.city}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full capitalize">
                        {turf.sportType}
                      </span>
                      {turf.pricePerHour > 0 && (
                        <span className="text-xs text-slate-400">
                          ₹{turf.pricePerHour}/hr
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No results message */}
          {showSuggestions && turfSuggestions.length === 0 && turfSearch.length >= 2 && !isSearching && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-4">
              <p className="text-slate-400 text-sm mb-3">No turfs found matching "{turfSearch}"</p>
              <button
                type="button"
                onClick={() => setShowCreateTurf(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 text-sm font-semibold rounded-lg transition-all"
              >
                + Create New Turf
              </button>
            </div>
          )}

          {/* Create New Turf Modal */}
          {showCreateTurf && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Create New Turf</h3>
                <form onSubmit={handleCreateNewTurf} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Turf Name & Location
                    </label>
                    <input
                      type="text"
                      value={turfSearch}
                      onChange={(e) => setTurfSearch(e.target.value)}
                      placeholder="e.g., Champions Arena, Koramangala"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      You can edit details later from your dashboard
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateTurf(false)}
                      className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-semibold rounded-lg transition-all"
                    >
                      Create Turf
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <p className="text-xs text-slate-500 mt-1">
            Type at least 2 characters to search • Or create a new turf
          </p>
        </div>

        {/* Max Players & Cost Per Player */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-semibold text-slate-300 mb-2">
              Maximum Players: {formData.maxPlayers}
            </label>
            <input
              type="range"
              id="maxPlayers"
              name="maxPlayers"
              min="2"
              max="30"
              value={formData.maxPlayers}
              onChange={handleChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>2</span>
              <span>30</span>
            </div>
          </div>

          <div>
            <label htmlFor="costPerPlayer" className="block text-sm font-semibold text-slate-300 mb-2">
              Cost Per Player (₹)
            </label>
            <input
              type="number"
              id="costPerPlayer"
              name="costPerPlayer"
              min="0"
              step="50"
              value={formData.costPerPlayer}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Set 0 for free matches</p>
          </div>
        </div>

        {/* Total Cost Display */}
        {formData.costPerPlayer > 0 && (
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Match Cost</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formData.maxPlayers} players × ₹{formData.costPerPlayer}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  ₹{formData.costPerPlayer * formData.maxPlayers}
                </p>
                <p className="text-xs text-green-300/80">Expected Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* Match Type Toggle */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Match Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, matchType: 'open' }))}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                formData.matchType === 'open'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              Open Match
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, matchType: 'invite-only' }))}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                formData.matchType === 'invite-only'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              Invite Only
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 text-base sm:text-lg font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Match...
            </span>
          ) : (
            <>
              <span className="inline sm:hidden">Create Match</span>
              <span className="hidden sm:inline">
                {formData.costPerPlayer > 0 
                  ? `Create Match - ₹${formData.costPerPlayer}/player` 
                  : 'Create Match (Free)'}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateMatchForm;
