// Create user with correct name
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sportsy';

async function createUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'amankumar552023@gmail.com';
    const name = 'Aman Kumar';
    const password = 'test123'; // Change this to the actual password

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      console.log('⚠️  User already exists');
      console.log(`   Current Name: ${existing.name}`);
      
      if (existing.name !== name) {
        console.log(`🔧 Updating name from "${existing.name}" to "${name}"...`);
        existing.name = name;
        await existing.save();
        console.log('✅ Name updated successfully!');
      } else {
        console.log('✅ Name is already correct!');
      }
    } else {
      console.log('🔧 Creating new user...');
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash
      });
      
      console.log('✅ User created successfully!');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Password: ${password}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUser();
