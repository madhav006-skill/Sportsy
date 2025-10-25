import React from 'react';

const MatchStats = ({ hostStats }) => {
  // Mock data if no stats provided
  const stats = hostStats || {
    totalMatches: 47,
    activeMatches: 3,
    totalPlayers: 235,
    points: 1840,
    badge: 'Captain',
    badgeLevel: 'Gold',
    nextMilestone: 2000
  };

  const achievements = [
    { icon: '🏆', name: 'Top Organizer', description: 'Hosted 25+ matches' },
    { icon: '⭐', name: 'Perfect Host', description: 'No cancellations' },
    { icon: '🎯', name: 'Crowd Favorite', description: '50+ unique players' }
  ];

  const recentActivity = [
    { id: 1, action: 'Hosted', sport: 'Football', date: '2 days ago', points: '+50' },
    { id: 2, action: 'Completed', sport: 'Cricket', date: '5 days ago', points: '+40' },
    { id: 3, action: 'Organized', sport: 'Basketball', date: '1 week ago', points: '+30' }
  ];

  const pointsProgress = (stats.points / stats.nextMilestone) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-xl">
      {/* Section Title */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          Your Stats & Rewards
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
      </div>

      <div className="space-y-6">
        {/* Host Badge */}
        <div className="relative bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-2xl p-6 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-xl">
              <span className="text-4xl">🏅</span>
            </div>
            <div>
              <p className="text-sm text-yellow-300 font-semibold mb-1">{stats.badgeLevel} Tier</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {stats.badge}
              </h3>
              <p className="text-xs text-yellow-200/80 mt-1">Elite Match Organizer</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-2xl font-bold text-white">{stats.totalMatches}</p>
            <p className="text-xs text-slate-400">Matches Hosted</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-white">{stats.activeMatches}</p>
            <p className="text-xs text-slate-400">Active Now</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-2xl font-bold text-white">{stats.totalPlayers}</p>
            <p className="text-xs text-slate-400">Total Players</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/30 transition-all">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-2xl font-bold text-yellow-500">{stats.points}</p>
            <p className="text-xs text-slate-400">Total Points</p>
          </div>
        </div>

        {/* Points Progress */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white">Next Milestone</p>
            <p className="text-sm font-bold text-yellow-500">{stats.nextMilestone} pts</p>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${pointsProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {stats.nextMilestone - stats.points} points to unlock Platinum tier
          </p>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Recent Achievements</h3>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:border-yellow-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{achievement.name}</p>
                  <p className="text-xs text-slate-400">{achievement.description}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {activity.action} {activity.sport}
                    </p>
                    <p className="text-xs text-slate-400">{activity.date}</p>
                  </div>
                </div>
                <span className="text-green-400 font-bold text-sm">{activity.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-white font-semibold">Leaderboard Rank</p>
                <p className="text-xs text-slate-400">Regional Organizers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                #12
              </p>
              <p className="text-xs text-green-400">↑ Up 3 ranks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
