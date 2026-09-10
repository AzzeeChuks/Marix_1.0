const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issueType: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  screenshotUrl: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('IssueReport', issueReportSchema);
