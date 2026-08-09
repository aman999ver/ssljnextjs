const express = require('express');
const User = require('../models/User');
const Banner = require('../models/Banner');
const Product = require('../models/Product');
const Category = require('../models/Category');
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

// Get all customers (Admin view)
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
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

// --- Category Management ---

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// --- Product Management ---

// Get all products (Admin view)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create Product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
