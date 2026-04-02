//用户反馈

// backend/src/routes/feedback.routes.js
const express = require('express');
const router = express.Router();

const FeedbackController = require('../controllers/feedbackController');

router.get('/', async (req, res) => {
  try {
    const feedbacks = await FeedbackController.getFeedbacks();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;