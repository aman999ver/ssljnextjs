require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://geniusappsolu:sslj@ac-c4xs8lc-shard-00-00.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-01.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-02.dqkklnk.mongodb.net:27017/sslj?ssl=true&replicaSet=atlas-c4xs8lc-shard-0&authSource=admin&retryWrites=true&w=majority";

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB to seed Admin user...");
    // We don't force family 4 here just in case this is run from an environment that doesn't need it,
    // but I'll add it to be safe against local execution.
    await mongoose.connect(MONGODB_URI, { family: 4 });
    console.log("Connected.");

    const adminEmail = "admin@subhalaxmi.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      phone: "0000000000",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@subhalaxmi.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
}

seedAdmin();
