// backend/src/routes/users.routes.js 
const express = require('express');
const router = express.Router();

// 控制器
const userController = require('../controllers/userController');
const resourceController = require('../controllers/resourceController');

// 中间件
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * ✅ 1. 公共路由（无需登录）
 */
router.post('/login', userController.login);
router.post('/register', userController.register);

/**
 * ✅ 2. 管理员模块
 */
router.get('/', userController.getUsers);

/**
 * ✅ 3. 个人资料模块（建议加鉴权🔥）
 */
router.get('/profile', authMiddleware, userController.getUserProfile);
router.post('/update', authMiddleware, userController.updateProfile);
router.post('/password', authMiddleware, userController.changePassword);
router.get('/stats', authMiddleware, userController.getUserStats);

/**
 * ✅ 4. 资源与积分模块
 */
router.get('/resources', authMiddleware, userController.getMyResources);
router.get('/downloads', authMiddleware, userController.getMyDownloads);
router.get('/favorites', authMiddleware, userController.getMyFavorites);
router.get('/points', authMiddleware, userController.getPointDetails);

/**
 * ✅ 5. 下载动作（扣积分）
 */
router.post('/download-action', authMiddleware, resourceController.downloadResource);

module.exports = router;