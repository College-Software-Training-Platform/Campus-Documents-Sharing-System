const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 获取资料
router.get('/profile', userController.getUserProfile);
// 修改资料 
router.post('/update', userController.updateProfile);
// 修改密码
router.post('/password', userController.changePassword);
// 获取统计
router.get('/stats', userController.getUserStats);

module.exports = router;