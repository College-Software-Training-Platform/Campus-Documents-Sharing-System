// backend/src/controllers/feedbackController.js 
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const FeedbackModel = require('../models/feedbacks')(sequelize, Sequelize.DataTypes);

// ✅ 获取所有反馈
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.findAll();
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '获取失败' });
  }
};

// ✅ 标记已处理
const processFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await FeedbackModel.update(
      { status: 'processed' },
      { where: { feedback_ID: id } }  // 🔥 必须改这里
    );

    if (result[0] === 0) {
      return res.status(404).json({ message: '反馈不存在' });
    }

    res.json({ message: '已标记为处理' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '处理失败' });
  }
};

// ✅ 删除
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await FeedbackModel.destroy({
      where: { feedback_ID: id }  // 🔥 必须改
    });

    if (!result) {
      return res.status(404).json({ message: '反馈不存在' });
    }

    res.json({ message: '删除成功' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '删除失败' });
  }
};

// ✅ 回复（顺便修）
const replyFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyContent } = req.body;

    await FeedbackModel.update(
      {
        reply_Content: replyContent,
        status: 'processed'
      },
      {
        where: { feedback_ID: id } // 🔥 统一
      }
    );

    res.json({ message: '回复成功' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '回复失败' });
  }
};

module.exports = {
  getFeedbacks,//获取列表
  processFeedback,   // 标记为已处理
  deleteFeedback,    // 删除
  replyFeedback//回复
};