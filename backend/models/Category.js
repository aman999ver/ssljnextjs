const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
  image: { type: String, default: "" },
  color: { type: String, default: "" },
  gradient: { type: String, default: "" },
  sortOrder: { type: Number, default: 0 },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate slug from name if not provided
CategorySchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('categories', CategorySchema, 'catogries');
