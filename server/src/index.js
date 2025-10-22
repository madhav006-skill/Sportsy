import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import paymentRouter from './routes/payments.js';
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import turfsRouter from './routes/turfs.js';

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

// Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Track online users and last seen
const onlineUsers = new Map(); // userId -> socket.id
const lastSeen = new Map(); // userId -> timestamp

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Handle user connection with their ID
  socket.on('user-connected', (userId) => {
    if (!userId) return;
    
    console.log(`User ${userId} connected`);
    
    // Store user as online
    onlineUsers.set(userId, socket.id);
    
    // Remove from last seen if they were offline
    if (lastSeen.has(userId)) {
      lastSeen.delete(userId);
    }
    
    // Broadcast to all clients that this user is online
    io.emit('user-status', {
      userId,
      status: 'online',
      timestamp: new Date().toISOString()
    });
    
    // Send current online users to the newly connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit('online-users', onlineUsersList);
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Find which user disconnected
    let disconnectedUserId = null;
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }
    
    if (disconnectedUserId) {
      console.log(`User ${disconnectedUserId} disconnected`);
      
      // Remove from online users
      onlineUsers.delete(disconnectedUserId);
      
      // Store last seen timestamp
      const lastSeenTime = new Date().toISOString();
      lastSeen.set(disconnectedUserId, lastSeenTime);
      
      // Broadcast to all clients that this user is offline
      io.emit('user-status', {
        userId: disconnectedUserId,
        status: 'offline',
        lastSeen: lastSeenTime
      });
    }
  });
  
  // Handle explicit user disconnect request
  socket.on('user-disconnecting', (userId) => {
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      const lastSeenTime = new Date().toISOString();
      lastSeen.set(userId, lastSeenTime);
      
      io.emit('user-status', {
        userId,
        status: 'offline',
        lastSeen: lastSeenTime
      });
    }
  });
});

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.send('MongoDB Connection Working!');
});

// DB health route
app.get('/db/health', async (req, res) => {
  try {
    const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
    let ping = null;
    let ok = false;
    if (state === 1 && mongoose.connection.db) {
      try {
        // Run a ping on the admin DB to verify connectivity
        const admin = mongoose.connection.db.admin();
        const result = await admin.command({ ping: 1 });
        ping = result;
        ok = result?.ok === 1;
      } catch (e) {
        ping = { error: e.message };
      }
    }
    res.json({
      connected: state === 1,
      readyState: state,
      ping,
      dbName: mongoose.connection.name || null,
      host: mongoose.connection.host || null,
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// API routes
app.use('/api/payments', paymentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/api/turfs', turfsRouter);

async function start() {
  try {
    // MongoDB Connection
    const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin%40123@cluster0.gfrbftv.mongodb.net/';
    const looksLikePlaceholder = typeof uri === 'string' && uri.includes('<');
    
    if (uri && !looksLikePlaceholder) {
      try {
        await mongoose.connect(uri, { 
          dbName: 'sportsy'
        });
        console.log('✅ MongoDB Connected Successfully!');
      } catch (mongoError) {
        console.error('❌ MongoDB Connection Failed:', mongoError.message);
        console.warn('⚠️ Starting in in-memory mode (no persistence).');
      }
    } else {
      console.warn('MONGODB_URI not set or is placeholder. Starting in in-memory mode (no persistence).');
    }

    // Try to bind to PORT, and if it's busy, try the next few ports
    const basePort = Number(PORT) || 5000;
    let attempt = 0;
    const maxAttempts = 5;

    const tryListen = (port) => new Promise((resolve, reject) => {
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
          const next = port + 1;
          attempt += 1;
          console.warn(`Port ${port} in use, trying ${next}...`);
          // Remove error listener before retrying
          server.removeAllListeners('error');
          resolve(tryListen(next));
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
        resolve();
      });
    });

    await tryListen(basePort);
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

start();

export { io, onlineUsers, lastSeen };
