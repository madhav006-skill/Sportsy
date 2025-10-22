# 🟢 Online Status & Last Seen Feature

## Overview
Real-time user presence tracking in the Sportsy chat system using Socket.io. Users can see who's online and when others were last active.

## Features Implemented

### 1. **Server-Side Tracking** (`server/src/index.js`)
- **Online Users Map**: Tracks currently connected users (`userId -> socket.id`)
- **Last Seen Map**: Stores timestamps when users go offline (`userId -> timestamp`)
- **Socket Events**:
  - `user-connected`: Emitted when a user joins chat
  - `user-disconnecting`: Emitted when user explicitly disconnects
  - `disconnect`: Automatic disconnect detection
  - `user-status`: Broadcast status changes to all clients
  - `online-users`: Send list of online users to newly connected client

### 2. **API Endpoints** (`server/src/routes/chat.js`)
- `GET /api/chat/user-status/:userId` - Get specific user's status
- `GET /api/chat/online-users` - Get list of all online users

### 3. **Client-Side Integration** (`client/src/pages/Chat.jsx`)

#### Status Indicators:
- **Online**: 🟢 Green dot + "Online" text
- **Offline**: ⚫ Gray dot + "Last seen [time]" text

#### Visual Features:
- Green pulse dot in header showing online count
- Status badge on user avatars (green dot for online)
- Real-time status updates in message headers
- Automatic status sync without page refresh

## How It Works

### Connection Flow:
```javascript
// 1. User opens chat
User connects → Socket.io established

// 2. Client emits connection
socket.emit('user-connected', username)

// 3. Server updates tracking
onlineUsers.set(username, socket.id)
lastSeen.delete(username) // Clear old last seen

// 4. Server broadcasts to all
io.emit('user-status', { userId, status: 'online' })

// 5. All clients update UI
Clients receive → Update userStatuses state → Re-render
```

### Disconnection Flow:
```javascript
// 1. User closes tab/browser
socket.disconnect()

// 2. Server detects disconnect
Find userId by socket.id → Remove from onlineUsers

// 3. Store last seen
lastSeen.set(userId, new Date().toISOString())

// 4. Broadcast offline status
io.emit('user-status', { userId, status: 'offline', lastSeen })

// 5. Clients update UI
Show "Last seen at [time]" instead of "Online"
```

## Time Formatting

The `formatLastSeen()` function converts timestamps to human-readable format:
- **< 1 minute**: "Just now"
- **< 60 minutes**: "Xm ago" (e.g., "5m ago")
- **< 24 hours**: "Xh ago" (e.g., "2h ago")
- **> 24 hours**: "HH:MM AM/PM" (e.g., "03:45 PM")

## UI Components

### Header Status Counter
```jsx
<div className="bg-green-500/10 rounded-lg px-3 py-2">
  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
  <span className="text-green-400">{onlineUsers.length} Online</span>
</div>
```

### Avatar Status Badge
```jsx
{userStatuses[username]?.status === 'online' && (
  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 
                  bg-green-400 rounded-full border-2 border-gray-900">
  </div>
)}
```

### Message Header Status
```jsx
{statusDisplay && <span className="ml-auto">{statusDisplay}</span>}
// Shows: 🟢 Online  OR  ⚫ Last seen 5m ago
```

## State Management

### Client State:
```javascript
const [userStatuses, setUserStatuses] = useState({});
// { "John": { status: "online" }, "Jane": { status: "offline", lastSeen: "..." } }

const [onlineUsers, setOnlineUsers] = useState([]);
// ["John", "Alice", "Bob"]
```

### Server State:
```javascript
const onlineUsers = new Map();
// Map { "John" => "socket123", "Alice" => "socket456" }

const lastSeen = new Map();
// Map { "Jane" => "2025-10-19T12:34:56.789Z" }
```

## Testing the Feature

1. **Open chat in two browser tabs/windows**
2. **Use different usernames** in each tab
3. **Observe**:
   - Online counter increases to 2
   - Green dots appear on avatars
   - "🟢 Online" shows in message headers
4. **Close one tab**
5. **Observe in remaining tab**:
   - Online counter decreases to 1
   - User's avatar loses green dot
   - "⚫ Last seen [time]" appears

## Integration Points

### No Breaking Changes:
✅ Existing message functionality preserved  
✅ Room/channel logic untouched  
✅ Message sending/receiving works as before  
✅ Only extends with presence tracking  

### Socket Events Added:
- `user-connected` (client → server)
- `user-disconnecting` (client → server)
- `user-status` (server → all clients)
- `online-users` (server → new client)

## Performance Considerations

- **In-memory storage**: Uses JavaScript Map for fast lookups
- **Broadcast optimization**: Only sends status changes, not full user lists
- **Cleanup**: Automatic removal of stale connections on disconnect
- **Scalability**: For production, consider Redis for multi-server deployments

## Future Enhancements

Potential improvements:
1. **Typing indicators**: Show "User is typing..." in real-time
2. **Read receipts**: Mark messages as read/delivered
3. **Persistent last seen**: Store in MongoDB for history across sessions
4. **Away status**: Auto-mark as away after X minutes of inactivity
5. **Do Not Disturb**: Manual status override
6. **Multiple device support**: Handle same user on multiple devices

## Code Files Modified

### Server:
- ✅ `server/src/index.js` - Socket.io connection handlers
- ✅ `server/src/routes/chat.js` - Status API endpoints

### Client:
- ✅ `client/src/pages/Chat.jsx` - UI components and Socket listeners

## Environment Variables

No new environment variables required. Uses existing Socket.io configuration:
```env
CLIENT_URL=http://localhost:5173
PORT=5000
```

---

**Status**: ✅ Fully Implemented and Tested  
**Version**: 1.0  
**Date**: October 19, 2025
