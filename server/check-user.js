// Test script to check user and create if needed
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsy';

async function checkAndCreateUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testEmail = 'amankumar552023@gmail.com';
    
    // Check if user exists
    let user = await User.findOne({ email: testEmail });
    
    if (user) {
      console.log('✅ User exists:', {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } else {
      console.log('❌ User not found. Creating test user...');
      
      // Create test user
      const passwordHash = await bcrypt.hash('test123', 10);
      user = await User.create({
        name: 'Aman Kumar',
        email: testEmail,
        passwordHash
      });
      
      console.log('✅ Test user created:', {
        name: user.name,
        email: user.email,
        password: 'test123'
      });
    }

    // Show all users count
    const count = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkAndCreateUser();
