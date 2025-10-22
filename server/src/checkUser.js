// Quick script to check and fix user data
import mongoose from 'mongoose';
import { User } from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sportsy';

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'amankumar552023@gmail.com';
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      console.log('\n📋 All users in database:');
      const allUsers = await User.find({}, 'name email');
      allUsers.forEach(u => {
        console.log(`   - ${u.name} (${u.email})`);
      });
    } else {
      console.log(`✅ User found:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      
      if (user.name === 'Champion') {
        console.log('\n⚠️  User has incorrect name "Champion"');
        console.log('🔧 Updating to "Aman Kumar"...');
        
        user.name = 'Aman Kumar';
        await user.save();
        
        console.log('✅ Updated successfully!');
        console.log(`   New Name: ${user.name}`);
      } else {
        console.log('\n✅ User name is correct!');
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();
