require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Setting = require('./models/Setting');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://geniusappsolu:sslj@ac-c4xs8lc-shard-00-00.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-01.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-02.dqkklnk.mongodb.net:27017/sslj?ssl=true&replicaSet=atlas-c4xs8lc-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/upload', uploadRoutes);

// --- API Endpoints ---

// Get all settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find({}).lean();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const rawProducts = await Product.find({}).sort({ _id: -1 }).lean();
    
    // Defensive mapping for frontend
    const products = rawProducts.map((p) => ({
      ...p,
      slug: p.slug || p._id.toString(),
      name: p.name || p.productName || p.title || "Unnamed Product",
      price: p.price || p.productPrice || null,
      category: p.category || p.categoryName || null,
      imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null),
    }));
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products (top 4)
app.get('/api/products/featured', async (req, res) => {
  try {
    const rawProducts = await Product.find({}).sort({ _id: -1 }).limit(4).lean();
    
    const products = rawProducts.map((p) => ({
      ...p,
      slug: p.slug || p._id.toString(),
      name: p.name || p.productName || p.title || "Unnamed Product",
      price: p.price || p.productPrice || null,
      category: p.category || p.categoryName || null,
      imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null),
    }));
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get single product by slug or id
app.get('/api/products/:slug', async (req, res) => {
  try {
    let p = await Product.findOne({ slug: req.params.slug }).lean();
    if (!p && mongoose.Types.ObjectId.isValid(req.params.slug)) {
      p = await Product.findById(req.params.slug).lean();
    }
    
    if (!p) return res.status(404).json({ error: 'Product not found' });
    
    const product = {
      ...p,
      slug: p.slug || p._id.toString(),
      name: p.name || p.productName || p.title || "Unnamed Product",
      price: p.price || p.productPrice || null,
      category: p.category || p.categoryName || null,
      imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null),
    };
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


// Get active banners
app.get('/api/banners/active', async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ _id: -1 }).limit(3).lean();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Root endpoint for Render health check
app.get('/', (req, res) => {
  res.send('Subha Laxmi Jewellery Backend API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
