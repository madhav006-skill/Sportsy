import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

function signToken(user) {
  const payload = { 
    id: user._id.toString(),
    userId: user._id.toString(), 
    sub: user._id.toString(), 
    email: user.email, 
    name: user.name,
    displayName: user.name
  };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  return jwt.sign(payload, secret, { expiresIn: '2h' });
}

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const token = signToken(user);
    return res.json({ success: true, token });
  } catch (err) {
    console.error('Signin error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });
    const token = signToken(user);
    return res.json({ success: true, token });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Debug: user count
router.get('/_count', async (_req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
