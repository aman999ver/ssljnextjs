const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get cart for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).lean();
    if (!cart) {
      return res.json({ items: [] });
    }
    
    // Populate products manually to handle flexible schema
    const mongoose = require('mongoose');
    const validProductIds = cart.items
      .map(item => item.productId)
      .filter(id => mongoose.Types.ObjectId.isValid(id));
      
    const products = await Product.find({ _id: { $in: validProductIds } }).lean();
    
    const populatedItems = cart.items.map(item => {
      const p = products.find(prod => prod._id.toString() === item.productId.toString());
      if (!p) return null;
      return {
        _id: item._id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...p, // Pass full product so calculatePrice gets priceMode, weight, lossType, etc.
          name: p.name || p.productName || p.title,
          price: p.price || p.productPrice,
          imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null)
        }
      };
    }).filter(Boolean);

    res.json({ _id: cart._id, items: populatedItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user.phone || user.phone.includes('Not Provided')) {
      return res.status(400).json({ error: 'Please add your phone number in your Profile before adding items to your cart.' });
    }

    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Remove from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

module.exports = router;
