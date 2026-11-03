const mongoose = require('mongoose');

const variantOptionSchema = new mongoose.Schema({
  optionName: { type: String, required: true },
  price: { type: Number, required: true },
  overridePrice: { type: Boolean, default: false }
});

const productVariantSchema = new mongoose.Schema({
  variantTitle: { type: String, required: true },
  options: [variantOptionSchema],
  images: [{ type: String }] 
});

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
  
  productCondition: {
    type: String,
    default: 'Brand New',
  },

  basePrice: {
    type: Number,
    required: false,
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
  variants: [productVariantSchema],
  
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
