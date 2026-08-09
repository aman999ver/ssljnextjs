const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.model('banners', BannerSchema);
