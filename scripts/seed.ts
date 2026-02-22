import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

async function seed() {
  try {
    console.log('Starting seed script...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED');
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database.');

    // Check if or admin already exists
    console.log('Checking for existing admin...');
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists. Skipping seeding.');
      process.exit(0);
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Cha#3014708', 12);

    const adminUser = new User({
      name: 'Ahmed Nasser',
      email: 'ahmednaser7707@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: ahmednaser7707@gmail.com');
    console.log('Password: Cha#3014708');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
