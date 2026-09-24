const mongoose = require('mongoose');

const recentSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    searchTerm: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

recentSearchSchema.index({ user: 1, searchTerm: 1 }, { unique: true });
recentSearchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RecentSearch', recentSearchSchema);
