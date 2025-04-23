import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const initAdmin = async () => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Check connection state
      if (mongoose.connection.readyState !== 1) {
        console.log(`⏳ Waiting for MongoDB connection (attempt ${retries + 1})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        retries++;
        continue;
      }

      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        // Create admin user with all required fields
        const adminData = {
          name: 'Hospital Admin',
          email: process.env.ADMIN_EMAIL,
          password: await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 12),
          isAdmin: true
        };
        
        // Only add studentId if not admin to bypass validation
        if (!adminData.isAdmin) {
          adminData.studentId = 'EDS0/00000/00'; // Default valid format
        }
        
        await User.create(adminData);
        console.log('✅ Admin account created');
      }
      return;
    } catch (error) {
      console.error(`❌ Admin initialization attempt ${retries + 1} failed:`, error.message);
      retries++;
      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  throw new Error('Failed to initialize admin after multiple attempts');
};

export default initAdmin;
