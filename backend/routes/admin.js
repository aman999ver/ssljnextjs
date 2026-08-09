const express = require('express');
const User = require('../models/User');
const Banner = require('../models/Banner');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Setting = require('../models/Setting');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Helper for Pagination
const paginate = async (model, query, req, sort = { createdAt: -1 }, populate = null) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let dbQuery = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) dbQuery = dbQuery.populate(populate);

  const [data, total] = await Promise.all([
    dbQuery.lean(),
    model.countDocuments(query)
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

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

// --- Settings Management ---
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.find({}).lean();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const updates = req.body; // e.g. [{ key: "goldTax", value: 13 }, { key: "silverTax", value: 13 }]
    for (const item of updates) {
      await Setting.findOneAndUpdate({ key: item.key }, { value: item.value }, { upsert: true, new: true });
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});


// --- Customer Management ---
router.get('/customers', async (req, res) => {
  try {
    const result = await paginate(User, { role: { $ne: 'admin' } }, req, { createdAt: -1 });
    // Remove password field
    result.data = result.data.map(c => { delete c.password; return c; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// --- Banner Management ---
router.post('/banners', async (req, res) => {
  try {
    const { imageUrl } = req.body;
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
    const result = await paginate(Category, {}, req, { sortOrder: 1, createdAt: -1 });
    res.json(result);
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
router.get('/products', async (req, res) => {
  try {
    const result = await paginate(Product, {}, req, { createdAt: -1 });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- Order Management ---
router.get('/orders', async (req, res) => {
  try {
    // Populate user to get their name
    const result = await paginate(Order, {}, req, { createdAt: -1 }, 'user');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
