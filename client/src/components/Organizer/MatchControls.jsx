import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const MatchControls = ({ matchData }) => {
  const [showQR, setShowQR] = useState(false);
  const [matchLocked, setMatchLocked] = useState(false);

  const handleCancelMatch = () => {
    if (window.confirm('Are you sure you want to cancel this match? This action cannot be undone.')) {
      console.log('Match cancelled:', matchData?.id);
      alert('Match cancelled successfully!');
    }
  };

  const handleLockMatch = () => {
    setMatchLocked(!matchLocked);
    console.log(`Match ${matchLocked ? 'unlocked' : 'locked'}:`, matchData?.id);
  };

  const handleRemovePlayer = (playerId) => {
    if (window.confirm('Remove this player from the match?')) {
      console.log('Removing player:', playerId);
    }
  };

  // Mock player data
  const joinedPlayers = matchData?.players || [
    { id: 1, name: 'Rahul Sharma', status: 'joined', avatar: '🏃' },
    { id: 2, name: 'Priya Patel', status: 'joined', avatar: '⚽' },
    { id: 3, name: 'Arjun Singh', status: 'joined', avatar: '🏏' }
  ];

  const pendingPlayers = [
    { id: 4, name: 'Sneha Kumar', status: 'pending', avatar: '🎯' },
    { id: 5, name: 'Vikram Reddy', status: 'pending', avatar: '🏀' }
  ];

  const matchUrl = matchData?.id 
    ? `${window.location.origin}/match/${matchData.id}`
    : 'No match created yet';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-xl">
      {/* Section Title */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          Match Status & Controls
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
      </div>

      {matchData ? (
        <div className="space-y-6">
          {/* Match ID & QR Code */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Match ID</p>
                <p className="text-lg font-mono font-bold text-yellow-500">#{matchData.id}</p>
              </div>
              <button
                onClick={() => setShowQR(!showQR)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-yellow-500/50 rounded-lg text-white text-sm font-semibold transition-all"
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
            </div>

            {showQR && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="bg-white p-4 rounded-xl">
                  <QRCode value={matchUrl} size={150} />
                </div>
              </div>
            )}
          </div>

          {/* Match Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm ${
              matchLocked 
                ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                : 'bg-green-500/20 text-green-400 border border-green-500/50'
            }`}>
              {matchLocked ? '🔒 Locked' : '🟢 Open'}
            </span>
            <span className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-slate-800/50 text-slate-300 border border-slate-700">
              {joinedPlayers.length}/{matchData.maxPlayers} Players
            </span>
            {matchData.costPerPlayer > 0 && (
              <span className="px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                💰 ₹{matchData.costPerPlayer}/player
              </span>
            )}
          </div>

          {/* Player Lists */}
          <div className="space-y-4">
            {/* Joined Players */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-green-400">✓</span> Joined Players ({joinedPlayers.length})
              </h3>
              <div className="space-y-2">
                {joinedPlayers.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-xl">
                        {player.avatar}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{player.name}</p>
                        <p className="text-xs text-green-400">Confirmed</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold rounded-lg border border-red-500/50 hover:border-red-500 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Players */}
            {pendingPlayers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">⏳</span> Pending Invites ({pendingPlayers.length})
                </h3>
                <div className="space-y-2">
                  {pendingPlayers.map(player => (
                    <div 
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center text-xl">
                          {player.avatar}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{player.name}</p>
                          <p className="text-xs text-yellow-400">Awaiting response</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
            <button
              onClick={handleLockMatch}
              className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                matchLocked
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 hover:border-yellow-500/50'
              }`}
            >
              {matchLocked ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlock Match
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Lock Match
                </>
              )}
            </button>
            <button
              onClick={handleCancelMatch}
              className="flex-1 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Match
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">No active match</p>
          <p className="text-slate-500 text-sm mt-2">Create a match to see controls</p>
        </div>
      )}
    </div>
  );
};

export default MatchControls;
