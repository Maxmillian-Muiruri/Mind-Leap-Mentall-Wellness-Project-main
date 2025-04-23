import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Enhanced logging
console.log('🟡 Starting admin initialization...');
dotenv.config();

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'INIT_ADMIN_EMAIL', 'INIT_ADMIN_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

console.log('🟢 Environment variables verified');

const initAdmin = async () => {
  try {
    console.log('🟡 1. Starting initAdmin function');
    console.log('🟡 2. Connecting to MongoDB...');
    console.log('ℹ️ MongoDB URI present:', !!process.env.MONGODB_URI);
    
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🟢 3. MongoDB connected successfully');
      console.log('ℹ️ Connection state:', mongoose.connection.readyState);
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      throw err;
    }

    console.log('🟡 Creating admin account...');
    const hashedPassword = await bcrypt.hash(process.env.INIT_ADMIN_PASSWORD, 12);
    
    const newAdmin = await User.create({
      name: 'System Admin',
      email: process.env.INIT_ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true,
      studentId: 'EDS0/00000/00' // Special admin ID format
    });
    
    console.log('🟢 Admin account created:', newAdmin.email);
    
  } catch (error) {
    console.error('❌ Admin initialization failed:');
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log('🟡 Closing MongoDB connection...');
      await mongoose.disconnect();
    }
    console.log('🟢 Initialization process completed');
  }
};

// Execute immediately when run directly
if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  initAdmin();
}

export default initAdmin;
