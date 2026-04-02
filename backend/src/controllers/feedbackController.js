// backend/src/controllers/feedbackController.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const FeedbackModel = require('../models/feedbacks')(sequelize, Sequelize.DataTypes);

// 获取所有反馈
const getFeedbacks = async () => {
  try {
    const feedbacks = await FeedbackModel.findAll();
    return feedbacks.map(f => f.toJSON());
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 处理反馈
const processFeedback = async (feedbackId) => {
  try {
    await FeedbackModel.update(
      { status: 'processed' },
      { where: { id: feedbackId } }
    );
    console.log(`反馈 ${feedbackId} 已处理`);
  } catch (err) {
    console.error(err);
  }
};

// 删除反馈
const deleteFeedback = async (feedbackId) => {
  try {
    await FeedbackModel.destroy({ where: { id: feedbackId } });
    console.log(`反馈 ${feedbackId} 已删除`);
  } catch (err) {
    console.error(err);
  }
};

const replyFeedback = async (feedbackId, replyContent) => {
  try {
    await FeedbackModel.update(
      {
        reply_Content: replyContent,
        status: 'processed'
      },
      {
        where: { feedback_ID: feedbackId }
      }
    );
    console.log(`反馈 ${feedbackId} 已回复`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getFeedbacks,
  replyFeedback
};