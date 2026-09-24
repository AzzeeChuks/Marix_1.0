const mongoose = require('mongoose');

const productEventSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    eventType: {
      type: String,
      enum: ['view', 'whatsapp_click', 'save'],
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

productEventSchema.index({ product: 1, eventType: 1, createdAt: -1 });

module.exports = mongoose.model('ProductEvent', productEventSchema);
