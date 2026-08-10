const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');
const { getLiveRates, getTaxes, calculatePrice } = require('../utils/price');

const router = express.Router();

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SLJ-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create Order
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Get the user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).lean();
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }

    const mongoose = require('mongoose');
    const validProductIds = cart.items
      .map(item => item.productId)
      .filter(id => mongoose.Types.ObjectId.isValid(id));
      
    const products = await Product.find({ _id: { $in: validProductIds } }).lean();

    // Fetch rates and taxes once for the whole order
    const rates = await getLiveRates();
    const taxes = await getTaxes();

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const p = products.find(prod => prod._id.toString() === item.productId.toString());
      if (p) {
        const itemPrice = calculatePrice(p, rates, taxes);
        subtotal += itemPrice * item.quantity;
        orderItems.push({
          productId: p._id,
          name: p.name || p.productName || p.title,
          price: itemPrice, // The calculated snapshot price
          quantity: item.quantity,
          imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null)
        });
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ error: 'No valid products in cart' });
    }

    const totalAmount = subtotal; // add shipping fee here later if needed

    // Determine initial status based on payment method
    let paymentStatus = 'Pending';
    if (paymentMethod === 'Bank Transfer') {
      paymentStatus = 'Pending'; 
    } else if (paymentMethod === 'COD') {
      paymentStatus = 'Pending'; // Will require 500 advance via eSewa
    } else if (paymentMethod === 'eSewa') {
      paymentStatus = 'Pending';
    }

    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: req.user.id,
      items: orderItems,
      subtotal,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Pending',
      notes
    });

    await order.save();

    // Clear the cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({ message: 'Order created successfully', orderId: order._id, orderNumber: order.orderNumber, totalAmount });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get My Orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
