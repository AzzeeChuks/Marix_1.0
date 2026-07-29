const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  campus: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    type: String, // Array of image URL strings
  }],
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'hidden'],
    default: 'active',
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Create indexes for fast filtering and regex text search in MongoDB
productSchema.index({ productTitle: 'text', description: 'text' });
productSchema.index({ campus: 1, category: 1, price: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);