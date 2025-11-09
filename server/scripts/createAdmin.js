const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Import User model
const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('\n⚠️  An admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Name: ${existingAdmin.name}`);
      
      const overwrite = await question('\nDo you want to create another admin? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes') {
        console.log('Operation cancelled.');
        process.exit(0);
      }
    }

    console.log('\n=== Create Admin User ===\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 8 characters): ');

    // Validate input
    if (!name || !email || !password) {
      console.log('\n✗ All fields are required!');
      process.exit(1);
    }

    if (password.length < 8) {
      console.log('\n✗ Password must be at least 8 characters long!');
      process.exit(1);
    }

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();

    console.log('\n✓ Admin user created successfully!');
    console.log('\n=== Admin Credentials ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('\nYou can now login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('\n✗ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

// Run the script
createAdmin();

