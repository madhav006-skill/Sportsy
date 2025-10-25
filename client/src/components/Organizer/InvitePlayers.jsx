import React, { useState } from 'react';

const InvitePlayers = ({ matchId }) => {
  const [inviteMethod, setInviteMethod] = useState('link'); // 'link', 'username', 'email'
  const [inviteValue, setInviteValue] = useState('');
  const [copied, setCopied] = useState(false);

  const shareableLink = matchId 
    ? `${window.location.origin}/match/${matchId}`
    : 'Create a match first to get a shareable link';

  const handleCopyLink = () => {
    if (matchId) {
      navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInvite = (e) => {
    e.preventDefault();
    console.log(`Inviting via ${inviteMethod}:`, inviteValue);
    // Mock API call
    alert(`Invitation sent to ${inviteValue} via ${inviteMethod}!`);
    setInviteValue('');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-xl">
      {/* Section Title */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          Invite Players
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
      </div>

      {/* Shareable Link */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Shareable Match Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className={`flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 outline-none ${
              !matchId ? 'cursor-not-allowed' : ''
            }`}
          />
          <button
            onClick={handleCopyLink}
            disabled={!matchId}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-yellow-500/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-slate-700"></div>
        <span className="text-slate-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      {/* Invite Method Tabs */}
      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInviteMethod('username')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              inviteMethod === 'username'
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            Username
          </button>
          <button
            onClick={() => setInviteMethod('email')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              inviteMethod === 'email'
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            Email
          </button>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type={inviteMethod === 'email' ? 'email' : 'text'}
            value={inviteValue}
            onChange={(e) => setInviteValue(e.target.value)}
            placeholder={
              inviteMethod === 'username' 
                ? 'Enter username (e.g., @player123)' 
                : 'Enter email address'
            }
            required
            disabled={!matchId}
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!matchId || !inviteValue}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-900 font-semibold rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>

      {/* Social Share Buttons */}
      {matchId && (
        <div className="mt-6">
          <p className="text-sm text-slate-400 mb-3">Share via social media:</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Join my match on Sportsy! ' + shareableLink)}`, '_blank')}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Join my match on Sportsy! ' + shareableLink)}`, '_blank')}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
          </div>
        </div>
      )}

      {!matchId && (
        <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
          <p className="text-sm text-slate-400 text-center">
            ℹ️ Create a match first to invite players
          </p>
        </div>
      )}
    </div>
  );
};

export default InvitePlayers;
