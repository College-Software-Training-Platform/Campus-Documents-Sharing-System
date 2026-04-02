const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// ✅ 【新增】获取所有用户（管理端）
router.get('/', userController.getUsers);

// --- 基础资料模块 ---
// 获取个人详细资料
router.get('/profile', userController.getUserProfile);
// 修改个人基本资料 
router.post('/update', userController.updateProfile);
// 修改登录密码
router.post('/password', userController.changePassword);
// 获取主页统计数据 (上传数/下载数)
router.get('/stats', userController.getUserStats);


// 获取“我的上传”列表
router.get('/resources', userController.getMyResources);
// 获取“我的下载”记录
router.get('/downloads', userController.getMyDownloads);
// 获取“我的收藏”列表
router.get('/favorites', userController.getMyFavorites);
// 获取积分变动明细
router.get('/points', userController.getPointDetails);

module.exports = router;