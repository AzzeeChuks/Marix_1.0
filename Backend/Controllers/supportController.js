const IssueReport = require('../Models/IssueReport');

// @desc    Submit a support/issue report
// @route   POST /api/support/report
// @access  Private
exports.createIssueReport = async (req, res) => {
  try {
    const { issueType, description, screenshotUrl } = req.body;

    if (!issueType || !description) {
      return res.status(400).json({ message: 'Please provide issue type and description' });
    }

    const report = await IssueReport.create({
      reporterId: req.user._id,
      issueType,
      description,
      screenshotUrl: screenshotUrl || null,
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};