import express from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message.js';
import { io, onlineUsers, lastSeen } from '../index.js';

const router = express.Router();

const memory = [];

router.get('/recent', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const docs = await Message.find().sort({ ts: -1 }).limit(50).lean();
    return res.json(docs.reverse());
  }
  res.json(memory.slice(-50));
});

router.post('/send', async (req, res) => {
  const { user, text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  if (mongoose.connection.readyState === 1) {
    const doc = await Message.create({ user: user || 'Anon', text });
    const payload = { _id: doc._id, user: doc.user, text: doc.text, ts: doc.ts };
    io.emit('chat:receive', payload);
    return res.json(payload);
  }
  const msg = { id: Date.now().toString(36), user: user || 'Anon', text, ts: Date.now() };
  memory.push(msg);
  io.emit('chat:receive', msg);
  res.json(msg);
});

router.delete('/all', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    await Message.deleteMany({});
  }
  memory.length = 0;
  io.emit('chat:cleared');
  res.json({ ok: true });
});

// Get user status (online/offline with last seen)
router.get('/user-status/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (onlineUsers.has(userId)) {
    return res.json({
      userId,
      status: 'online',
      online: true
    });
  }
  
  if (lastSeen.has(userId)) {
    return res.json({
      userId,
      status: 'offline',
      online: false,
      lastSeen: lastSeen.get(userId)
    });
  }
  
  return res.json({
    userId,
    status: 'unknown',
    online: false
  });
});

// Get all online users
router.get('/online-users', (req, res) => {
  const users = Array.from(onlineUsers.keys());
  res.json({ users });
});

export default router;
