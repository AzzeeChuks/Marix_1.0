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
  },
  campus: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'sold'],
    default: 'active',
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  whatsappClicks: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

productSchema.index({ productTitle: 'text' });

module.exports = mongoose.model('Product', productSchema);