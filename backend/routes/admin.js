const express = require('express');
const User = require('../models/User');
const Banner = require('../models/Banner');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
const bcrypt = require('bcryptjs');

// Unprotected seed route to create first admin
router.get('/seed', async (req, res) => {
  try {
    const adminEmail = "admin@subhalaxmi.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return res.json({ message: "Admin already exists!" });

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
    res.json({ message: "Admin seeded successfully!", email: adminEmail, password: "admin123" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed admin' });
  }
});

router.use(authMiddleware, adminMiddleware);

router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.post('/banners', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    // In a real app we'd handle cloudinary upload here
    // For now we just create a new banner document
    const banner = new Banner({ image: imageUrl, isActive: true });
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add banner' });
  }
});

module.exports = router;
