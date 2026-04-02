//用户反馈

// backend/src/routes/feedback.routes.js
const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')

// 获取列表
router.get('/', feedbackController.getFeedbacks)

// 标记已处理
router.put('/:id', feedbackController.processFeedback)

// 删除
router.delete('/:id', feedbackController.deleteFeedback)

module.exports = router