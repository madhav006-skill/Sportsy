import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { getUserFromToken } from '../lib/auth.js';
import { useSocket } from '../lib/useSocket.js';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  
  const [user, setUser] = useState(() => {
    // Try to get user from token first (for logged-in users)
    const payload = getUserFromToken();
    if (payload) {
      return payload.name || payload.displayName || payload.email || 'User';
    }
    
    // For non-logged-in users, use sessionStorage (tab-specific, persists on refresh)
    const storedUser = sessionStorage.getItem('chat_user');
    
    if (storedUser) {
      return storedUser;
    }
    
    // Generate new guest name
    const guestName = `Guest-${Math.floor(Math.random() * 1000)}`;
    sessionStorage.setItem('chat_user', guestName);
    return guestName;
  });
  
  const socketRef = useSocket();
  const listRef = useRef(null);
  
  // Track user statuses (userId -> { status: 'online'|'offline', lastSeen?: timestamp })
  const [userStatuses, setUserStatuses] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    api.get('/api/chat/recent').then(r => setMessages(r.data));
  }, []);

  // Notify server when user connects
  useEffect(() => {
    const sock = socketRef.current;
    if (!sock || !user) return;
    
    // Emit user connected event
    sock.emit('user-connected', user);
    
    // Cleanup: notify server when disconnecting
    return () => {
      sock.emit('user-disconnecting', user);
    };
  }, [socketRef.current, user]);

  useEffect(() => {
    const sock = socketRef.current;
    if (!sock) return;
    
    // Handle incoming messages
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    sock.on('chat:receive', handler);
    
    // Handle chat cleared
    const cleared = () => setMessages([]);
    sock.on('chat:cleared', cleared);
    
    // Handle user status updates
    const statusHandler = (statusUpdate) => {
      const { userId, status, lastSeen } = statusUpdate;
      setUserStatuses((prev) => ({
        ...prev,
        [userId]: { status, lastSeen }
      }));
      
      // Update online users list
      if (status === 'online') {
        setOnlineUsers((prev) => Array.from(new Set([...prev, userId])));
      } else {
        setOnlineUsers((prev) => prev.filter(id => id !== userId));
      }
    };
    sock.on('user-status', statusHandler);
    
    // Handle initial online users list
    const onlineUsersHandler = (users) => {
      setOnlineUsers(users);
      // Mark all as online in status
      const statusMap = {};
      users.forEach(userId => {
        statusMap[userId] = { status: 'online' };
      });
      setUserStatuses((prev) => ({ ...prev, ...statusMap }));
    };
    sock.on('online-users', onlineUsersHandler);
    
    return () => {
      sock.off('chat:receive', handler);
      sock.off('chat:cleared', cleared);
      sock.off('user-status', statusHandler);
      sock.off('online-users', onlineUsersHandler);
    };
  }, [socketRef.current]);

  useEffect(() => {
    localStorage.setItem('chat_user', user);
  }, [user]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = { user, text };
    await api.post('/api/chat/send', msg);
    setText('');
  };

  const clearAll = async () => {
    if (!confirm('Clear all messages? This cannot be undone.')) return;
    await api.delete('/api/chat/all');
    setMessages([]);
  };
  
  // Format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    }
    
    // Return time in HH:MM AM/PM format
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get user status display
  const getUserStatus = (username) => {
    const status = userStatuses[username];
    if (!status) return null;
    
    if (status.status === 'online') {
      return <span className="text-green-400 text-xs">🟢 Online</span>;
    } else if (status.status === 'offline' && status.lastSeen) {
      return <span className="text-gray-400 text-xs">⚫ Last seen {formatLastSeen(status.lastSeen)}</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">💬 Live Chat</h1>
            <p className="text-gray-400 text-sm">Real-time messaging with Socket.io</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Online Users Count */}
            <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-400 font-semibold">
                {onlineUsers.length} Online
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
              <span className="text-sm text-gray-400">Chatting as:</span>
              <input 
                value={user} 
                onChange={e => setUser(e.target.value)} 
                className="bg-transparent border-none outline-none text-yellow-400 font-semibold w-32 text-sm"
                placeholder="Your name"
              />
            </div>
            <button 
              type="button" 
              onClick={clearAll} 
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 overflow-hidden" style={{ height: '70vh' }}>
          {/* Messages Area */}
          <div 
            ref={listRef} 
            className="h-[calc(100%-80px)] overflow-y-auto p-6 space-y-4 bg-black/20"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(250, 204, 21, 0.3) transparent'
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map(m => {
                const mine = (m.user || 'Anon').toLowerCase() === (user || '').toLowerCase();
                const messageUser = m.user || 'User';
                // Only show status for OTHER users' messages, not your own
                const statusDisplay = !mine ? getUserStatus(messageUser) : null;
                
                return (
                  <div key={m.id || m._id || m.ts} className={`flex ${mine ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                    {!mine && (
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-sm font-bold text-black shadow-lg flex-shrink-0">
                          {(messageUser).slice(0, 1).toUpperCase()}
                        </div>
                        {userStatuses[messageUser]?.status === 'online' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900"></div>
                        )}
                      </div>
                    )}
                    <div className={`max-w-[60%] rounded-2xl px-5 py-3 shadow-lg ${
                      mine 
                        ? 'bg-yellow-400 text-black rounded-br-md' 
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-bl-md'
                    }`}>
                      <div className={`text-xs mb-1.5 font-semibold flex items-center gap-2 ${mine ? 'text-black/70' : 'text-yellow-400'}`}>
                        <span>{messageUser} · {new Date(m.ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {statusDisplay && (
                          <span className="ml-auto">{statusDisplay}</span>
                        )}
                      </div>
                      <div className={mine ? 'text-black' : 'text-white'}>{m.text}</div>
                    </div>
                    {mine && (
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-sm font-bold text-yellow-400 shadow-lg flex-shrink-0">
                          {(messageUser).slice(0, 1).toUpperCase()}
                        </div>
                        {/* Don't show online badge on your own messages */}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form 
            onSubmit={send} 
            className="h-20 border-t border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-center gap-3"
          >
            <input 
              value={text} 
              onChange={e => setText(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
              placeholder="Type your message..."
              autoFocus
            />
            <button 
              type="submit"
              disabled={!text.trim()} 
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold shadow-lg hover:bg-yellow-300 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
