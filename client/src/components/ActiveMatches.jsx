import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveMatches = ({ matches = [] }) => {
  const navigate = useNavigate();

  if (matches.length === 0) {
    return null;
  }

  const handleJoinMatch = (matchId) => {
    console.log('Joining match:', matchId);
    alert('Match join functionality coming soon!');
  };

  const getSportIcon = (sport) => {
    const icons = {
      football: '⚽',
      cricket: '🏏',
      basketball: '🏀',
      badminton: '🏸',
      tennis: '🎾',
      volleyball: '🏐'
    };
    return icons[sport?.toLowerCase()] || '⚽';
  };

  return (
    <div className="mb-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">🔥 Active Matches</h2>
        <button
          onClick={() => navigate('/organizer')}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 text-sm font-bold rounded-lg shadow-lg transition-all hover:scale-105"
        >
          + Create Match
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/50 transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getSportIcon(match.sportType)}</span>
                <div>
                  <h3 className="text-white font-bold text-lg capitalize">
                    {match.sportType}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {match.matchType === 'open' ? '🌐 Open Match' : '🔒 Invite Only'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/50">
                Active
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{match.turf}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{match.date} at {match.time}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{match.joinedPlayers || 1}/{match.maxPlayers}</span>
                </div>
                
                {match.costPerPlayer > 0 ? (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded border border-yellow-500/50">
                    ₹{match.costPerPlayer}/player
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/50">
                    FREE
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleJoinMatch(match.id)}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all group-hover:scale-[1.02]"
            >
              Join Match
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveMatches;
