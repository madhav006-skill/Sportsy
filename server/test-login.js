// Test login functionality
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsy';

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testEmail = 'amankumar552023@gmail.com';
    const testPassword = '123'; // Trying common password
    
    console.log('\n🔐 Testing login with:', { email: testEmail, password: testPassword });
    
    // Find user
    const user = await User.findOne({ email: testEmail.toLowerCase().trim() });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.name);
    
    // Test password
    const match = await bcrypt.compare(testPassword, user.passwordHash);
    
    if (match) {
      console.log('✅ Password correct!');
      
      // Generate token
      const payload = { 
        id: user._id.toString(),
        userId: user._id.toString(), 
        sub: user._id.toString(), 
        email: user.email, 
        name: user.name,
        displayName: user.name
      };
      const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
      const token = jwt.sign(payload, secret, { expiresIn: '2h' });
      
      console.log('✅ Token generated successfully');
      console.log('\n📝 Login successful! Use these credentials:');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
    } else {
      console.log('❌ Password incorrect');
      console.log('\n💡 Try these common passwords:');
      console.log('- test123');
      console.log('- password');
      console.log('- 123456');
      console.log('- aman123');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testLogin();
