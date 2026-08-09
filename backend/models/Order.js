const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'clientusers', required: true },
  items: { type: Array, default: [] },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  shippingAddress: { type: Object, default: {} },
  billingAddress: { type: Object, default: {} },
  paymentMethod: { type: String, default: "COD" },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Rejected'], default: 'Pending' },
  notes: { type: String, default: "" },
  cancellationCharge: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('orders', OrderSchema);
