import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateMatchForm from '../components/Organizer/CreateMatchForm';
import InvitePlayers from '../components/Organizer/InvitePlayers';
import MatchControls from '../components/Organizer/MatchControls';
import MatchStats from '../components/Organizer/MatchStats';

const Organizer = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(null);

  const handleCreateMatch = (matchData) => {
    // Mock match creation - in production, this would call the API
    const newMatch = {
      id: `MATCH-${Date.now()}`,
      ...matchData,
      createdAt: new Date().toISOString(),
      status: 'active',
      players: [],
      hostId: 'user123', // Would come from auth context
      joinedPlayers: 1, // Host is automatically joined
      totalCost: matchData.costPerPlayer * matchData.maxPlayers
    };

    console.log('Match created:', newMatch);
    setCurrentMatch(newMatch);
    
    // Show success message with cost details
    const costMessage = matchData.costPerPlayer > 0 
      ? `\n💰 Cost: ₹${matchData.costPerPlayer}/player\n📊 Total Revenue: ₹${newMatch.totalCost}`
      : '\n🎉 Free Match';
    
    alert(`✅ Match created successfully!\n\n📋 Match ID: ${newMatch.id}\n⚽ Sport: ${matchData.sportType}\n👥 Max Players: ${matchData.maxPlayers}${costMessage}\n\n🔗 Share link with players to join!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <svg className="w-6 h-6 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Match Organizer</h1>
                <p className="text-sm text-slate-400">Host and manage your matches</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-slate-300">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Stats Section - Full Width */}
          <div className="w-full">
            <MatchStats />
          </div>

          {/* Two Column Layout - Responsive */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <CreateMatchForm onCreateMatch={handleCreateMatch} />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <InvitePlayers matchId={currentMatch?.id} />
              <MatchControls matchData={currentMatch} />
            </div>
          </div>

          {/* Info Banner */}
          {!currentMatch && (
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Getting Started</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Welcome to the Match Organizer! Create your first match by filling out the form on the left. 
                    You'll be able to invite players, manage the match status, and earn points as a host.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300">
                      ⚡ Earn 50 points per match
                    </span>
                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300">
                      🏆 Unlock achievement badges
                    </span>
                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300">
                      👥 Invite unlimited players
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-slate-800/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 Sportsy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Guidelines</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Organizer;
