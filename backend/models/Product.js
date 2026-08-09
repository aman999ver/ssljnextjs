const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  metalType: { type: String, default: "22K" },
  weight: { type: Number, default: 0 },
  lossType: { type: String, enum: ['percentage', 'grams', 'none'], default: 'none' },
  lossValue: { type: Number, default: 0 },
  makingCharge: { type: Number, default: 0 },
  priceMode: { type: String, enum: ['dynamic', 'static'], default: 'dynamic' },
  price: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  reviews: { type: Array, default: [] },
  sku: { type: String, default: "" }
}, { strict: false, timestamps: true });

module.exports = mongoose.model('products', ProductSchema);
