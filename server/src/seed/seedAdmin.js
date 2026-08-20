import 'dotenv/config';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (adminExists) {
      console.log('Admin user already exists in the database.');
      process.exit(0);
    }

    const adminUser = await User.create({
      username: 'Master Admin',
      email: 'admin@school.com',
      password: 'password123',
      role: 'ADMIN',
      isActive: true
    });

    console.log(`Master Admin created successfully: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();