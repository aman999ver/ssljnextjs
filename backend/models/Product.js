const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.model('products', ProductSchema);
