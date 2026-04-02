const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 路由：生成 AI 摘要
router.post('/generate-summary', aiController.generateSummary);

module.exports = router;
