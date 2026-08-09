const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Automatically deletes documents after 30 days
});

module.exports = mongoose.model('Enquiry', enquirySchema);
