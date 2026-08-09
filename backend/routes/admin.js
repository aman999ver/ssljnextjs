const express = require('express');
const User = require('../models/User');
const Banner = require('../models/Banner');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

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
