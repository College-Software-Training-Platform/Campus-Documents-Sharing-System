// backend/src/routes/users.routes.js
const express = require('express');
const router = express.Router();

// 引入统一的控制器
const userController = require('../controllers/userController');
const resourceController = require('../controllers/resourceController');

/**
 * ✅ 1. 管理员模块 (合并自旧版 user.routes.js)
 * 这里保留了旧版想要实现的“获取所有用户”功能
 */
router.get('/', userController.getUsers); 

/**
 * ✅ 2. 个人资料模块
 */
router.get('/profile', userController.getUserProfile);
router.post('/update', userController.updateProfile);
router.post('/password', userController.changePassword);
router.get('/stats', userController.getUserStats);

/**
 * ✅ 3. 资源与积分模块
 */
router.get('/resources', userController.getMyResources);
router.get('/downloads', userController.getMyDownloads);
router.get('/favorites', userController.getMyFavorites);
router.get('/points', userController.getPointDetails);

/**
 * ✅ 4. 下载动作 (扣积分)
 */
router.post('/download-action', resourceController.downloadResource);

module.exports = router;