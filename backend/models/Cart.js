const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'clientusers', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, default: 1 }
  }]
}, { strict: false, timestamps: true });

module.exports = mongoose.model('carts', CartSchema);
