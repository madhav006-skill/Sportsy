# 🧪 Testing Guide: Online Status & Last Seen

## Quick Test Instructions

### Prerequisites
- Server running on `http://localhost:5000` or `5001`
- Client running on `http://localhost:5174`

---

## Test 1: Single User Connection ✅

1. Open chat: `http://localhost:5174/chat`
2. **Expected Results**:
   - Header shows "1 Online" with green pulsing dot
   - Your avatar has a green status badge
   - Your messages show no status (you don't see your own status)

---

## Test 2: Multiple Users (Same Browser) ✅

### Setup:
1. Open chat in **Tab 1**: `http://localhost:5174/chat`
   - Set username to "Alice"
   - Send a message
   
2. Open chat in **Tab 2**: `http://localhost:5174/chat`
   - Set username to "Bob"
   - Send a message

### Expected Results:

#### In Tab 1 (Alice):
- Header: "2 Online" 🟢
- Bob's avatar: Has green dot
- Bob's message header: Shows "🟢 Online"
- Alice's messages: No status shown (self)

#### In Tab 2 (Bob):
- Header: "2 Online" 🟢
- Alice's avatar: Has green dot
- Alice's message header: Shows "🟢 Online"
- Bob's messages: No status shown (self)

---

## Test 3: User Disconnects ✅

### Setup:
1. Keep Tab 1 (Alice) **OPEN**
2. **CLOSE** Tab 2 (Bob)
3. Wait 1-2 seconds

### Expected Results in Tab 1:

#### Immediate Changes:
- Header updates: "1 Online" ⚫
- Bob's avatar: Green dot **REMOVED**
- Bob's messages: Status changes to "⚫ Last seen Just now"

#### After 2 minutes:
- Bob's status: "⚫ Last seen 2m ago"

#### After 1 hour:
- Bob's status: "⚫ Last seen 1h ago"

#### Next day:
- Bob's status: "⚫ Last seen at 03:45 PM" (actual time)

---

## Test 4: User Reconnects ✅

### Setup:
1. Tab 1 (Alice) shows Bob as offline
2. **Re-open** chat in Tab 2 as "Bob"
3. Send a message from Bob

### Expected Results in Tab 1:
- Header: "2 Online" 🟢 (instantly updates)
- Bob's avatar: Green dot **APPEARS**
- Bob's old messages: Status updates to "🟢 Online"
- Real-time status change without page refresh

---

## Test 5: Different Devices (Advanced) 🌐

### Setup:
1. **Device 1**: Open chat on your computer
   - Username: "User1"
   
2. **Device 2**: Open chat on phone/tablet or use another browser
   - Username: "User2"
   - Note: Use your computer's IP address, e.g., `http://192.168.1.X:5174/chat`

### Expected Results:
- Both devices see each other as online
- Real-time status synchronization across devices
- Closing one device instantly updates the other

---

## Test 6: Status Persistence ⏱️

### Setup:
1. User "Charlie" sends messages
2. Charlie closes tab (goes offline)
3. Wait 5 minutes
4. New user "Dave" joins chat

### Expected Results:
- Dave sees Charlie's messages with "⚫ Last seen 5m ago"
- Status persists in server memory (until server restart)
- Accurate time tracking

---

## Visual Indicators Checklist ✅

| Location | Online | Offline |
|----------|--------|---------|
| **Header Counter** | `🟢 X Online` (green) | Updates count |
| **Avatar Badge** | Green dot bottom-right | No dot |
| **Message Header** | `🟢 Online` (green) | `⚫ Last seen [time]` (gray) |
| **Time Format** | N/A | "Just now" → "5m ago" → "2h ago" → "03:45 PM" |

---

## Browser Console Checks 🔍

### Open DevTools (F12) → Console

#### When connecting:
```
Socket connected: abc123xyz
User Alice connected
```

#### Server broadcasts:
```
user-status: { userId: "Alice", status: "online", timestamp: "..." }
```

#### When disconnecting:
```
Socket disconnected: abc123xyz
User Alice disconnected
```

```
user-status: { userId: "Alice", status: "offline", lastSeen: "..." }
```

---

## Common Issues & Fixes 🔧

### Issue: Status not updating in real-time
**Fix**: Check if Socket.io connection is established
```javascript
// In browser console:
socketRef.current.connected  // Should be true
```

### Issue: "0 Online" even when connected
**Fix**: Ensure username is set before connecting
- Change username in the input field
- The connection auto-updates with new username

### Issue: Old status persists after reconnect
**Fix**: Server state is in-memory
- Restart server clears all status
- Expected behavior: Status should update within 1-2 seconds

### Issue: Multiple tabs show same status
**Fix**: Use different usernames in each tab
- Socket.io identifies users by username
- Same username = same user status

---

## Socket.io Events Flow 📡

```
CLIENT CONNECT:
  Client → Server: user-connected("Alice")
  Server → All: user-status({ userId: "Alice", status: "online" })
  Server → Client: online-users(["Alice", "Bob", ...])

DISCONNECT:
  Client closes/disconnects
  Server detects → Find userId by socket.id
  Server → All: user-status({ userId: "Alice", status: "offline", lastSeen: "..." })
```

---

## Performance Test 📊

### Load Testing:
1. Open 10 tabs with different usernames
2. **Expected**: 
   - Header shows "10 Online"
   - No lag in status updates
   - All avatars have green dots

3. Close 5 tabs randomly
4. **Expected**:
   - Header updates to "5 Online" immediately
   - Closed users show last seen
   - No memory leaks

---

## Production Checklist ✅

Before deploying to production:

- [ ] Test with real network latency
- [ ] Verify status persists across server restarts (if using MongoDB)
- [ ] Check memory usage with 100+ concurrent users
- [ ] Implement Redis for multi-server deployments
- [ ] Add error handling for network failures
- [ ] Set up monitoring for Socket.io connections
- [ ] Test mobile browser compatibility
- [ ] Verify HTTPS/WSS in production

---

## Debug Mode 🐛

Enable verbose Socket.io logging:

### Server (`server/src/index.js`):
```javascript
const io = new SocketIOServer(server, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Add debug logging
io.on('connection', (socket) => {
  console.log('✅ Connection:', socket.id);
  
  socket.onAny((eventName, ...args) => {
    console.log(`📨 Event: ${eventName}`, args);
  });
});
```

### Client (`useSocket.js`):
```javascript
const socket = io(url, { 
  transports: ['websocket'],
  debug: true  // Enable debug mode
});

socket.onAny((eventName, ...args) => {
  console.log(`📨 Received: ${eventName}`, args);
});
```

---

## Success Criteria ✅

Feature is working correctly if:

1. ✅ Online count updates in real-time
2. ✅ Green dots appear/disappear on avatars
3. ✅ Status text shows "Online" or "Last seen"
4. ✅ Time format is human-readable
5. ✅ Multiple users sync correctly
6. ✅ No page refresh needed for updates
7. ✅ Existing chat functionality unchanged
8. ✅ No console errors in browser/server

---

**Test Date**: October 19, 2025  
**Status**: ✅ Ready for Testing  
**Next Steps**: Open chat and follow Test 2 instructions!
